import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function UserGrowthChart({ users }) {
  // Group users by month
  const monthlyData = users.reduce((acc, user) => {
    const date = new Date(user.created_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, users: 0 };
    }
    acc[monthKey].users += 1;
    return acc;
  }, {});

  const data = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  // Calculate cumulative growth
  let cumulative = 0;
  const cumulativeData = data.map(item => {
    cumulative += item.users;
    return { month: item.month, users: cumulative };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: '#E5EDFF' }}>
        User Growth Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={cumulativeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="#7A8BA6"
            tick={{ fill: '#7A8BA6' }}
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
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}