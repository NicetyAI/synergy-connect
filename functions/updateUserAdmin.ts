import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { userId, data } = await req.json();

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    const { role, ...profileData } = data;

    // Update profile fields
    if (Object.keys(profileData).length > 0) {
      await base44.asServiceRole.entities.User.update(userId, profileData);
    }

    // Update role as a separate call since it's a built-in field
    if (role !== undefined) {
      await base44.asServiceRole.entities.User.update(userId, { role });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});