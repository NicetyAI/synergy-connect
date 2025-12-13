import React from "react";
import { motion } from "framer-motion";
import { Eye, MousePointerClick, CheckCircle, TrendingUp } from "lucide-react";

export default function PerformanceCards({ campaigns, metrics }) {
  const activeCampaigns = campaigns.filter(c => c.status === 'approved' && (!c.expiry_date || new Date(c.expiry_date) > new Date()));
  
  const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
  const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
  const totalConversions = metrics.reduce((sum, m) => sum + (m.conversions || 0), 0);
  const clickThroughRate = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

  const cards = [
    {
      title: "Total Impressions",
      value: totalImpressions.toLocaleString(),
      icon: Eye,
      color: "#3B82F6",
      bgGradient: "linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)"
    },
    {
      title: "Total Clicks",
      value: totalClicks.toLocaleString(),
      icon: MousePointerClick,
      color: "#8B5CF6",
      bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)"
    },
    {
      title: "Conversions",
      value: totalConversions.toLocaleString(),
      icon: CheckCircle,
      color: "#22C55E",
      bgGradient: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
    },
    {
      title: "Click-Through Rate",
      value: `${clickThroughRate}%`,
      icon: TrendingUp,
      color: "#F59E0B",
      bgGradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: card.bgGradient }}>
              <card.icon className="w-6 h-6" style={{ color: '#fff' }} />
            </div>
          </div>
          <h3 className="text-sm font-medium mb-1" style={{ color: '#B6C4E0' }}>
            {card.title}
          </h3>
          <p className="text-3xl font-bold" style={{ color: '#E5EDFF' }}>
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}