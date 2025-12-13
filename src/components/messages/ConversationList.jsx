import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, User } from "lucide-react";
import { format } from "date-fns";

export default function ConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  onShowSearch,
  currentUserEmail
}) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredConversations = conversations.filter(conv => 
    conv.otherUserEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="w-80 border-r overflow-y-auto"
      style={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.18)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.18)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#E5EDFF' }}>Messages</h2>
          <Button
            onClick={onShowSearch}
            className="rounded-lg p-2"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)', color: '#E5EDFF' }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A8BA6' }} />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 glass-input rounded-xl"
            style={{ color: '#E5EDFF' }}
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="p-2">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => {
            const lastMessage = conv.messages[0];
            const isSelected = selectedConversation === conv.id;

            return (
              <motion.div
                key={conv.id}
                whileHover={{ x: 4 }}
                onClick={() => onSelectConversation(conv.id)}
                className="p-3 rounded-xl mb-2 cursor-pointer transition-all"
                style={isSelected ? {
                  background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(31, 58, 138, 0.2) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                } : {
                  background: 'rgba(255, 255, 255, 0.03)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)' }}
                  >
                    <User className="w-5 h-5" style={{ color: '#E5EDFF' }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate" style={{ color: '#E5EDFF' }}>
                        {conv.otherUserEmail.split('@')[0]}
                      </p>
                      {lastMessage && (
                        <span className="text-xs" style={{ color: '#7A8BA6' }}>
                          {format(new Date(lastMessage.created_date), 'MMM d')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm truncate" style={{ color: '#7A8BA6' }}>
                        {lastMessage ? (
                          lastMessage.sender_email === currentUserEmail ? `You: ${lastMessage.content}` : lastMessage.content
                        ) : 'No messages yet'}
                      </p>
                      
                      {conv.unreadCount > 0 && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: '#3B82F6', color: '#fff' }}
                        >
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: '#7A8BA6' }}>
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}