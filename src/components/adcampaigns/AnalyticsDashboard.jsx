import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import moment from "moment";

export default function AnalyticsDashboard({ campaigns, metrics }) {
  // Group metrics by date for chart
  const chartData = metrics.reduce((acc, metric) => {
    const date = moment(metric.date).format('MMM DD');
    const existing = acc.find(d => d.date === date);
    
    if (existing) {
      existing.impressions += metric.impressions || 0;
      existing.clicks += metric.clicks || 0;
      existing.conversions += metric.conversions || 0;
    } else {
      acc.push({
        date,
        impressions: metric.impressions || 0,
        clicks: metric.clicks || 0,
        conversions: metric.conversions || 0
      });
    }
    
    return acc;
  }, []);

  // Sort by date
  chartData.sort((a, b) => moment(a.date, 'MMM DD').diff(moment(b.date, 'MMM DD')));

  // Get last 30 days
  const last30Days = chartData.slice(-30);

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Performance Trends */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 rounded-2xl"
        style={{ background: '#fff', border: '1px solid #000' }}
      >
        <h3 className="text-xl font-bold mb-6" style={{ color: '#000' }}>
          Performance Trends (Last 30 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={last30Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="date" stroke="#000" fontSize={12} />
            <YAxis stroke="#000" fontSize={12} />
            <Tooltip
              contentStyle={{ 
                background: '#fff', 
                border: '1px solid #000',
                borderRadius: '12px',
                color: '#000'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="impressions" stroke="#D8A11F" strokeWidth={2} name="Impressions" />
            <Line type="monotone" dataKey="clicks" stroke="#666" strokeWidth={2} name="Clicks" />
            <Line type="monotone" dataKey="conversions" stroke="#22C55E" strokeWidth={2} name="Conversions" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Campaign Comparison */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 rounded-2xl"
        style={{ background: '#fff', border: '1px solid #000' }}
      >
        <h3 className="text-xl font-bold mb-6" style={{ color: '#000' }}>
          Campaign Performance Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={campaigns.slice(0, 5).map(campaign => {
            const campaignMetrics = metrics.filter(m => m.application_id === campaign.id);
            return {
              name: campaign.business_name.substring(0, 15) + '...',
              impressions: campaignMetrics.reduce((sum, m) => sum + (m.impressions || 0), 0),
              clicks: campaignMetrics.reduce((sum, m) => sum + (m.clicks || 0), 0),
              conversions: campaignMetrics.reduce((sum, m) => sum + (m.conversions || 0), 0)
            };
          })}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="name" stroke="#000" fontSize={12} />
            <YAxis stroke="#000" fontSize={12} />
            <Tooltip
              contentStyle={{ 
                background: '#fff', 
                border: '1px solid #000',
                borderRadius: '12px',
                color: '#000'
              }}
            />
            <Legend />
            <Bar dataKey="impressions" fill="#D8A11F" name="Impressions" />
            <Bar dataKey="clicks" fill="#666" name="Clicks" />
            <Bar dataKey="conversions" fill="#22C55E" name="Conversions" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}