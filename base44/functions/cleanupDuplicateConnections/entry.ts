import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all connections
    const allConnections = await base44.asServiceRole.entities.Connection.list('-created_date', 1000);
    
    // Track unique pairs and find duplicates
    const seen = new Map(); // key: "email1_email2" (sorted), value: first connection id
    const toDelete = [];

    for (const conn of allConnections) {
      const pair = [conn.user1_email, conn.user2_email].sort().join('|');
      const key = `${pair}_${conn.status}`;
      
      if (seen.has(key)) {
        // This is a duplicate - mark for deletion
        toDelete.push(conn.id);
      } else {
        // First occurrence - keep it
        seen.set(key, conn.id);
      }
    }

    console.log(`Found ${toDelete.length} duplicate connections to delete out of ${allConnections.length} total`);

    // Delete duplicates in batches
    let deleted = 0;
    for (const id of toDelete) {
      await base44.asServiceRole.entities.Connection.delete(id);
      deleted++;
    }

    return Response.json({ 
      total: allConnections.length,
      duplicatesRemoved: deleted,
      remaining: allConnections.length - deleted
    });
  } catch (error) {
    console.error('Cleanup error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});