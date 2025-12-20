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
      className="p-6 rounded-2xl"
      style={{ background: '#fff', border: '2px solid #000' }}
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: '#000' }}>
        Interest Trends (Last 6 Months)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis 
            dataKey="month" 
            stroke="#000"
            tick={{ fill: '#000' }}
          />
          <YAxis 
            stroke="#000"
            tick={{ fill: '#000' }}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '2px solid #000',
              borderRadius: '8px',
              color: '#000'
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