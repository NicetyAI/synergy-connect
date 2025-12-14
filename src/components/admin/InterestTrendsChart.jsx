import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function InterestTrendsChart({ interests }) {
  // Group by status over time (last 6 months)
  const monthlyData = {};
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = {
      month: monthKey,
      approved: 0,
      pending: 0,
      rejected: 0
    };
  }

  interests.forEach(interest => {
    const date = new Date(interest.created_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthlyData[monthKey]) {
      monthlyData[monthKey][interest.status] = (monthlyData[monthKey][interest.status] || 0) + 1;
    }
  });

  const data = Object.values(monthlyData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: '#E5EDFF' }}>
        Interest Trends (Last 6 Months)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
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
          <Area 
            type="monotone" 
            dataKey="approved" 
            stackId="1"
            stroke="#10B981" 
            fill="#10B981"
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="pending" 
            stackId="1"
            stroke="#F59E0B" 
            fill="#F59E0B"
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="rejected" 
            stackId="1"
            stroke="#EF4444" 
            fill="#EF4444"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}