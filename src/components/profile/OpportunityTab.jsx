import React from "react";
import { Briefcase } from "lucide-react";

export default function OpportunityTab({ userEmail }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-6 h-6" style={{ color: '#3B82F6' }} />
        <h2 className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>Opportunities</h2>
      </div>

      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 mx-auto mb-4" style={{ color: '#7A8BA6' }} />
        <p style={{ color: '#7A8BA6' }}>No opportunities to display</p>
      </div>
    </div>
  );
}