import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ConnectionTab({ userEmail }) {
  const { data: connections = [] } = useQuery({
    queryKey: ['connections', userEmail],
    queryFn: () => base44.entities.Connection.list(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const userConnections = connections.filter(
    c => (c.user1_email === userEmail || c.user2_email === userEmail) && c.status === 'connected'
  );

  const connectedUsers = userConnections.map(c => {
    const connectedEmail = c.user1_email === userEmail ? c.user2_email : c.user1_email;
    return users.find(u => u.email === connectedEmail);
  }).filter(Boolean);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6" style={{ color: '#3B82F6' }} />
        <h2 className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>
          Connections ({connectedUsers.length})
        </h2>
      </div>

      {connectedUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedUsers.map((user) => (
            <Link key={user.id} to={createPageUrl('Profile') + `?email=${user.email}`}>
              <div className="glass-card glass-card-hover p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: user.avatar_url ? 'transparent' : 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)' }}
                  >
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" style={{ color: '#E5EDFF' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ color: '#E5EDFF' }}>{user.full_name}</p>
                    {user.title && (
                      <p className="text-sm truncate" style={{ color: '#7A8BA6' }}>{user.title}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4" style={{ color: '#7A8BA6' }} />
          <p style={{ color: '#7A8BA6' }}>No connections yet</p>
        </div>
      )}
    </div>
  );
}