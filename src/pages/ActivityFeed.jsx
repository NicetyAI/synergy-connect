import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Sidebar from "@/components/partnerships/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ActivityItem from "@/components/activity/ActivityItem";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Users, MessageSquare, Award, Sparkles } from "lucide-react";

export default function ActivityFeed() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  React.useEffect(() => {
    base44.auth.me().then(user => setCurrentUser(user)).catch(() => setCurrentUser(null));
  }, []);

  const { data: connections = [] } = useQuery({
    queryKey: ['connections'],
    queryFn: () => base44.entities.Connection.list(),
    enabled: !!currentUser,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: () => base44.entities.Activity.list('-created_date'),
    refetchInterval: 30000,
  });

  // Get connected user emails
  const connectedEmails = connections
    .filter(c => (c.user1_email === currentUser?.email || c.user2_email === currentUser?.email) && c.status === 'connected')
    .map(c => c.user1_email === currentUser?.email ? c.user2_email : c.user1_email);

  // Filter activities to show only from connected users
  const connectedActivities = activities.filter(
    a => connectedEmails.includes(a.user_email) || a.user_email === currentUser?.email
  );

  const filteredActivities = activeFilter === "all" 
    ? connectedActivities 
    : connectedActivities.filter(a => a.type === activeFilter);

  const activityCounts = {
    all: connectedActivities.length,
    connection: connectedActivities.filter(a => a.type === 'connection').length,
    post: connectedActivities.filter(a => a.type === 'post').length,
    comment: connectedActivities.filter(a => a.type === 'comment').length,
    achievement: connectedActivities.filter(a => a.type === 'achievement').length,
  };

  const EmptyState = ({ message }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg" 
        style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(31, 58, 138, 0.2) 100%)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <Activity className="w-10 h-10" style={{ color: '#3B82F6' }} />
      </div>
      <p className="text-lg font-medium" style={{ color: '#B6C4E0' }}>{message}</p>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-main">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#E5EDFF' }}>Activity Feed</h1>
            <p className="text-lg" style={{ color: '#B6C4E0' }}>
              See what your connections are up to
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5" style={{ color: '#3B82F6' }} />
                <p className="text-sm font-medium" style={{ color: '#B6C4E0' }}>All Activity</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#E5EDFF' }}>{activityCounts.all}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5" style={{ color: '#22C55E' }} />
                <p className="text-sm font-medium" style={{ color: '#B6C4E0' }}>Connections</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#E5EDFF' }}>{activityCounts.connection}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5" style={{ color: '#F59E0B' }} />
                <p className="text-sm font-medium" style={{ color: '#B6C4E0' }}>Posts & Comments</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#E5EDFF' }}>{activityCounts.post + activityCounts.comment}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5" style={{ color: '#7C3AED' }} />
                <p className="text-sm font-medium" style={{ color: '#B6C4E0' }}>Achievements</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#E5EDFF' }}>{activityCounts.achievement}</p>
            </motion.div>
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full mb-8">
            <TabsList className="glass-card p-2 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <TabsTrigger 
                value="all" 
                className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white" 
                style={{ color: '#B6C4E0' }}
              >
                All Activity
                <Badge className="ml-2 px-2 py-0.5" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}>
                  {activityCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="connection" 
                className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#22C55E] data-[state=active]:text-white" 
                style={{ color: '#B6C4E0' }}
              >
                Connections
              </TabsTrigger>
              <TabsTrigger 
                value="post" 
                className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#F59E0B] data-[state=active]:text-white" 
                style={{ color: '#B6C4E0' }}
              >
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="comment" 
                className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#06B6D4] data-[state=active]:text-white" 
                style={{ color: '#B6C4E0' }}
              >
                Comments
              </TabsTrigger>
              <TabsTrigger 
                value="achievement" 
                className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white" 
                style={{ color: '#B6C4E0' }}
              >
                Achievements
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Activity List */}
          <div className="glass-card p-6 rounded-2xl">
            {filteredActivities.length === 0 ? (
              <EmptyState message={activeFilter === "all" ? "No activity from your connections yet" : `No ${activeFilter} activity`} />
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ActivityItem activity={activity} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}