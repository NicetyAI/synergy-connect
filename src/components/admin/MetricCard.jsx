import React from "react";
import { motion } from "framer-motion";

export default function MetricCard({ icon: Icon, title, value, subtitle, color = '#3B82F6', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-6 rounded-2xl text-center"
    >
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
      <h3 className="text-sm font-medium mb-2" style={{ color: '#B6C4E0' }}>
        {title}
      </h3>
      <p className="text-4xl font-bold mb-2" style={{ color }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: '#7A8BA6' }}>
        {subtitle}
      </p>
    </motion.div>
  );
}