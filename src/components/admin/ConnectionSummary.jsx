import React from "react";
import { Link, UserPlus, UserCheck } from "lucide-react";
import MetricCard from "./MetricCard";

export default function ConnectionSummary({ metrics }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ color: '#E5EDFF' }}>
        Connection Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={Link}
          title="Total"
          value={metrics.total}
          subtitle="All active user connections."
          color="#3B82F6"
          index={0}
        />
        <MetricCard
          icon={UserPlus}
          title="Pending Requests"
          value={metrics.pending}
          subtitle="Awaiting your response."
          color="#F59E0B"
          index={1}
        />
        <MetricCard
          icon={UserCheck}
          title="Requested Connections"
          value={metrics.requested}
          subtitle="Sent but not accepted yet."
          color="#7C3AED"
          index={2}
        />
      </div>
    </div>
  );
}