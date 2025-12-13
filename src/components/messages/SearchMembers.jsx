import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, User, MessageSquare } from "lucide-react";

export default function SearchMembers({ connections, onSelectMember, onClose, currentUserEmail }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await base44.entities.User.list();
        setAllUsers(users.filter(u => u.email !== currentUserEmail));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUserEmail]);

  const connectedEmails = new Set(
    connections.map(conn => 
      conn.user1_email === currentUserEmail ? conn.user2_email : conn.user1_email
    )
  );

  const connectedUsers = allUsers.filter(user => connectedEmails.has(user.email));

  const filteredUsers = connectedUsers.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.18)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#E5EDFF' }}>Search Connected Members</h2>
          <Button
            onClick={onClose}
            className="rounded-lg p-2"
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#B6C4E0' }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A8BA6' }} />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 glass-input rounded-xl"
            style={{ color: '#E5EDFF' }}
            autoFocus
          />
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center py-8">
            <p style={{ color: '#7A8BA6' }}>Loading members...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                whileHover={{ x: 4 }}
                onClick={() => onSelectMember(user.email)}
                className="p-4 rounded-xl cursor-pointer transition-all glass-card-hover"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)' }}
                  >
                    <User className="w-6 h-6" style={{ color: '#E5EDFF' }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium" style={{ color: '#E5EDFF' }}>
                      {user.full_name || 'User'}
                    </p>
                    <p className="text-sm truncate" style={{ color: '#7A8BA6' }}>
                      {user.email}
                    </p>
                  </div>

                  <MessageSquare className="w-5 h-5" style={{ color: '#3B82F6' }} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: '#7A8BA6' }} />
            <p className="text-lg mb-2" style={{ color: '#B6C4E0' }}>
              {searchQuery ? 'No members found' : 'No connected members'}
            </p>
            <p className="text-sm" style={{ color: '#7A8BA6' }}>
              {searchQuery 
                ? 'Try searching with a different name or email'
                : 'Connect with members to start messaging'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}