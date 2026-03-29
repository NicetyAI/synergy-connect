import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const currentUser = await base44.auth.me();

    if (!currentUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use service role to list all users so non-admin users can search the directory
    const allUsers = await base44.asServiceRole.entities.User.list();

    // Return only safe public fields, exclude current user
    const members = allUsers
      .filter(u => u.email !== currentUser.email)
      .map(u => ({
        id: u.id,
        full_name: u.full_name || '',
        email: u.email,
        avatar_url: u.avatar_url || '',
        title: u.title || '',
        occupation: u.occupation || '',
      }));

    return Response.json({ members });
  } catch (error) {
    console.error("Error fetching members:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});