import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const statusProgression = {
  'intent_created': 'accepted_into_group',
  'pending_group_join': 'accepted_into_group',
  'accepted_into_group': 'approvals_complete',
  'approvals_complete': 'group_forming',
  'group_forming': 'documents_gathering',
  'documents_gathering': 'partnership_active',
  'partnership_active': 'partnership_completed'
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all partnership groups
    const groups = await base44.asServiceRole.entities.PartnershipGroup.list();
    const updatedIntents = [];
    const updatedGroups = [];

    for (const group of groups) {
      if (group.status === 'completed' || group.status === 'closed') continue;

      const activeMembers = group.members?.filter(m => m.status === 'active') || [];
      const pendingMembers = group.pending_members || [];
      const documents = group.documents || [];
      
      let groupStatusChanged = false;
      let newGroupStatus = group.status;

      // Rule 1: If all pending members are accepted (no pending), advance group to approvals_complete
      if (group.status === 'forming' && pendingMembers.length === 0 && activeMembers.length >= 2) {
        newGroupStatus = 'approvals_complete';
        groupStatusChanged = true;
      }

      // Rule 2: If group has minimum members and approvals complete, advance to documents_gathering
      if (group.status === 'approvals_complete' && activeMembers.length >= 2) {
        newGroupStatus = 'documents_gathering';
        groupStatusChanged = true;
      }

      // Rule 3: If all members have uploaded documents, advance to active
      if (group.status === 'documents_gathering' && documents.length >= activeMembers.length && activeMembers.length >= 2) {
        newGroupStatus = 'active';
        groupStatusChanged = true;
      }

      // Update group status if changed
      if (groupStatusChanged) {
        await base44.asServiceRole.entities.PartnershipGroup.update(group.id, {
          status: newGroupStatus
        });
        updatedGroups.push({ groupId: group.id, oldStatus: group.status, newStatus: newGroupStatus });
      }

      // Get all intents for this group
      const intents = await base44.asServiceRole.entities.PartnershipIntent.filter({
        group_id: group.id
      });

      for (const intent of intents) {
        let intentStatusChanged = false;
        let newIntentStatus = intent.current_status;
        let statusNote = '';

        // Rule 1: Auto-accept pending members after 24 hours (or if they're the 2nd member)
        if (intent.current_status === 'pending_group_join') {
          // If this is the second member, auto-accept
          if (activeMembers.length === 1 && pendingMembers.length === 1) {
            newIntentStatus = 'accepted_into_group';
            statusNote = 'Automatically accepted as second member';
            intentStatusChanged = true;

            // Move from pending to active in group
            const updatedPending = pendingMembers.filter(m => m.email !== intent.user_email);
            const member = pendingMembers.find(m => m.email === intent.user_email);
            if (member) {
              const updatedActive = [...activeMembers, { ...member, joined_date: new Date().toISOString(), status: 'active' }];
              await base44.asServiceRole.entities.PartnershipGroup.update(group.id, {
                members: updatedActive,
                pending_members: updatedPending
              });
            }
          }
        }

        // Rule 2: Sync intent status with group progression
        if (!intentStatusChanged && groupStatusChanged) {
          // Map group status to intent status
          const statusMapping = {
            'approvals_complete': 'approvals_complete',
            'documents_gathering': 'documents_gathering',
            'active': 'partnership_active',
            'completed': 'partnership_completed'
          };

          if (statusMapping[newGroupStatus] && intent.current_status !== statusMapping[newGroupStatus]) {
            // Only advance if current status is earlier in progression
            const currentIdx = Object.keys(statusProgression).indexOf(intent.current_status);
            const newIdx = Object.keys(statusProgression).indexOf(statusMapping[newGroupStatus]);
            
            if (newIdx > currentIdx) {
              newIntentStatus = statusMapping[newGroupStatus];
              statusNote = `Advanced with group to ${newGroupStatus}`;
              intentStatusChanged = true;
            }
          }
        }

        // Rule 3: Check member-specific conditions
        if (intent.current_status === 'accepted_into_group' && activeMembers.length >= 3) {
          newIntentStatus = 'group_forming';
          statusNote = 'Group forming with sufficient members';
          intentStatusChanged = true;
        }

        // Update intent if status changed
        if (intentStatusChanged) {
          const statusHistory = intent.status_history || [];
          statusHistory.push({
            status: newIntentStatus,
            timestamp: new Date().toISOString(),
            notes: statusNote
          });

          await base44.asServiceRole.entities.PartnershipIntent.update(intent.id, {
            current_status: newIntentStatus,
            status_history: statusHistory
          });

          updatedIntents.push({
            intentId: intent.id,
            userEmail: intent.user_email,
            oldStatus: intent.current_status,
            newStatus: newIntentStatus,
            note: statusNote
          });
        }
      }
    }

    return Response.json({
      success: true,
      message: `Advanced ${updatedIntents.length} intents and ${updatedGroups.length} groups`,
      updatedIntents,
      updatedGroups,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error advancing partnership stages:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});