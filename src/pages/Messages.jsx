import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/partnerships/Sidebar";
import ConversationList from "@/components/messages/ConversationList";
import ChatArea from "@/components/messages/ChatArea";
import SearchMembers from "@/components/messages/SearchMembers";

export default function Messages() {
  const [user, setUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const { data: connections = [] } = useQuery({
    queryKey: ['connections', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const conn1 = await base44.entities.Connection.filter({ user1_email: user.email, status: "connected" });
      const conn2 = await base44.entities.Connection.filter({ user2_email: user.email, status: "connected" });
      return [...conn1, ...conn2];
    },
    enabled: !!user,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const sent = await base44.entities.Message.filter({ sender_email: user.email });
      const received = await base44.entities.Message.filter({ recipient_email: user.email });
      return [...sent, ...received].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!user,
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (messageData) => base44.entities.Message.create(messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: ({ id }) => base44.entities.Message.update(id, { read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const getConversations = () => {
    const conversationMap = new Map();
    
    connections.forEach(conn => {
      const otherUserEmail = conn.user1_email === user?.email ? conn.user2_email : conn.user1_email;
      const conversationId = [user?.email, otherUserEmail].sort().join('_');
      
      conversationMap.set(conversationId, {
        id: conversationId,
        otherUserEmail,
        messages: [],
        unreadCount: 0,
      });
    });

    messages.forEach(msg => {
      const conversationId = msg.conversation_id;
      if (conversationMap.has(conversationId)) {
        const conv = conversationMap.get(conversationId);
        conv.messages.push(msg);
        if (!msg.read && msg.recipient_email === user?.email) {
          conv.unreadCount++;
        }
      }
    });

    return Array.from(conversationMap.values());
  };

  const handleSendMessage = (content, recipientEmail) => {
    const conversationId = [user.email, recipientEmail].sort().join('_');
    sendMessageMutation.mutate({
      conversation_id: conversationId,
      sender_email: user.email,
      recipient_email: recipientEmail,
      content,
    });
  };

  if (!user) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p style={{ color: '#B6C4E0' }}>Loading...</p>
        </main>
      </div>
    );
  }

  const conversations = getConversations();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 flex" style={{ height: 'calc(100vh - 73px)' }}>
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onShowSearch={() => setShowSearch(true)}
          currentUserEmail={user.email}
        />
        
        {showSearch ? (
          <SearchMembers
            connections={connections}
            onSelectMember={(email) => {
              const conversationId = [user.email, email].sort().join('_');
              setSelectedConversation(conversationId);
              setShowSearch(false);
            }}
            onClose={() => setShowSearch(false)}
            currentUserEmail={user.email}
          />
        ) : selectedConversation ? (
          <ChatArea
            conversation={conversations.find(c => c.id === selectedConversation)}
            onSendMessage={handleSendMessage}
            onMarkAsRead={markAsReadMutation.mutate}
            currentUserEmail={user.email}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg mb-2" style={{ color: '#B6C4E0' }}>
                Select a conversation to start messaging
              </p>
              <p className="text-sm" style={{ color: '#7A8BA6' }}>
                Or search for connected members to chat with
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}