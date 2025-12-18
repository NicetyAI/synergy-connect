import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PartnershipDashboard() {
  const { data: partnerships } = useQuery({
    queryKey: ['partnerships'],
    queryFn: () => base44.entities.Partnership.list()
  });

  const { data: allMilestones } = useQuery({
    queryKey: ['allMilestones'],
    queryFn: () => base44.entities.PartnershipMilestone.list()
  });

  if (!partnerships) return <div>Loading...</div>;

  // Calculate metrics
  const stageDistribution = partnerships.reduce((acc, p) => {
    acc[p.stage] = (acc[p.stage] || 0) + 1;
    return acc;
  }, {});

  const activePartnerships = partnerships.filter(p => p.stage === 'active').length;
  const avgPerformance = partnerships
    .filter(p => p.performance_score)
    .reduce((sum, p) => sum + p.performance_score, 0) / partnerships.filter(p => p.performance_score).length || 0;

  const upcomingRenewals = partnerships.filter(p => 
    p.renewal_date && new Date(p.renewal_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  const overdueMilestones = allMilestones?.filter(m => 
    !m.completed && new Date(m.due_date) < new Date()
  ).length || 0;

  const stageChartData = Object.entries(stageDistribution).map(([stage, count]) => ({
    name: stage.charAt(0).toUpperCase() + stage.slice(1),
    value: count
  }));

  const COLORS = ['#3B82F6', '#FACC15', '#22C55E', '#D8A11F', '#EF4444', '#8B5CF6', '#6B7280'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-lg" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: '#666' }}>Total Partnerships</span>
            <TrendingUp className="w-5 h-5" style={{ color: '#22C55E' }} />
          </div>
          <p className="text-3xl font-bold" style={{ color: '#000' }}>{partnerships.length}</p>
          <p className="text-xs mt-1" style={{ color: '#666' }}>{activePartnerships} active</p>
        </div>

        <div className="p-6 rounded-lg" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: '#666' }}>Avg Performance</span>
            <CheckCircle className="w-5 h-5" style={{ color: '#3B82F6' }} />
          </div>
          <p className="text-3xl font-bold" style={{ color: '#000' }}>{avgPerformance.toFixed(1)}%</p>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
            <div className="h-full rounded-full" style={{ width: `${avgPerformance}%`, background: '#22C55E' }} />
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: '#666' }}>Upcoming Renewals</span>
            <Clock className="w-5 h-5" style={{ color: '#FACC15' }} />
          </div>
          <p className="text-3xl font-bold" style={{ color: '#000' }}>{upcomingRenewals}</p>
          <p className="text-xs mt-1" style={{ color: '#666' }}>Next 30 days</p>
        </div>

        <div className="p-6 rounded-lg" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: '#666' }}>Overdue Milestones</span>
            <AlertTriangle className="w-5 h-5" style={{ color: '#EF4444' }} />
          </div>
          <p className="text-3xl font-bold" style={{ color: overdueMilestones > 0 ? '#EF4444' : '#000' }}>
            {overdueMilestones}
          </p>
          <p className="text-xs mt-1" style={{ color: '#666' }}>Require attention</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#000' }}>Partnership Stages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stageChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stageChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-lg" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#000' }}>Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={partnerships.filter(p => p.performance_score).slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="partner_name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="performance_score" fill="#D8A11F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}