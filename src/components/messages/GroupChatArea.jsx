import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Users, User } from "lucide-react";
import { format } from "date-fns";

export default function GroupChatArea({ group, messages, onSendMessage, currentUser }) {
  const [messageText, setMessageText] = React.useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText, group.id);
      setMessageText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.created_date) - new Date(b.created_date)
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div 
        className="p-4 border-b"
        style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.18)'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
          >
            <Users className="w-6 h-6" style={{ color: '#E5EDFF' }} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg" style={{ color: '#E5EDFF' }}>
              {group.name}
            </p>
            <p className="text-xs" style={{ color: '#7A8BA6' }}>
              {group.members.length} members
            </p>
          </div>
        </div>
        {group.description && (
          <p className="text-sm mt-2" style={{ color: '#B6C4E0' }}>{group.description}</p>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {sortedMessages.map((msg, index) => {
          const isOwn = msg.sender_email === currentUser.email;
          const showTimestamp = index === 0 || 
            (new Date(msg.created_date) - new Date(sortedMessages[index - 1].created_date)) > 300000;

          return (
            <div key={msg.id}>
              {showTimestamp && (
                <div className="text-center mb-4">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#7A8BA6' }}>
                    {format(new Date(msg.created_date), 'MMM d, h:mm a')}
                  </span>
                </div>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwn && (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
                  >
                    <User className="w-4 h-4" style={{ color: '#E5EDFF' }} />
                  </div>
                )}
                
                <div className="max-w-[70%]">
                  {!isOwn && (
                    <p className="text-xs font-semibold mb-1 px-2" style={{ color: '#7C3AED' }}>
                      {msg.sender_name}
                    </p>
                  )}
                  <div 
                    className="px-4 py-2 rounded-2xl"
                    style={isOwn ? {
                      background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                      color: '#E5EDFF',
                      borderBottomRightRadius: '4px'
                    } : {
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#E5EDFF',
                      borderBottomLeftRadius: '4px'
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div 
        className="p-4 border-t"
        style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.18)'
        }}
      >
        <div className="flex gap-2">
          <Textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="glass-input resize-none"
            style={{ color: '#E5EDFF' }}
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="rounded-xl px-4"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)', color: '#E5EDFF' }}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}