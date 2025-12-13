import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, Eye, TrendingUp } from "lucide-react";

const stats = [
  { icon: MessageSquare, label: "Total Posts", key: "totalPosts", color: "#3B82F6" },
  { icon: Users, label: "Active Members", key: "activeMembers", color: "#22C55E" },
  { icon: Eye, label: "Total Views", key: "totalViews", color: "#7C3AED" },
  { icon: TrendingUp, label: "Growth Rate", value: "+12%", color: "#F59E0B" },
];

export default function ForumStats({ totalPosts, activeMembers, totalViews }) {
  const values = {
    totalPosts,
    activeMembers,
    totalViews,
  };

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${stat.color}20` }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>
                {stat.value || values[stat.key] || 0}
              </p>
              <p className="text-sm" style={{ color: '#7A8BA6' }}>
                {stat.label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}