import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

export default function ActivityChart({ activities }) {
  // Group by type
  const typeData = activities.reduce((acc, activity) => {
    const type = activity.type || 'other';
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += 1;
    return acc;
  }, {});

  const data = Object.entries(typeData)
    .map(([type, count]) => ({
      type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 activities

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: '#E5EDFF' }}>
        Top Activities
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="type" 
            stroke="#7A8BA6"
            tick={{ fill: '#7A8BA6', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            stroke="#7A8BA6"
            tick={{ fill: '#7A8BA6' }}
          />
          <Tooltip
            contentStyle={{
              background: '#0F2744',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '8px',
              color: '#E5EDFF'
            }}
          />
          <Bar dataKey="count" fill="#7C3AED" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}