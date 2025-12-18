import React from "react";
import { FileText, Calendar, TrendingUp, MessageSquare, Upload, CheckCircle, User } from "lucide-react";
import { format } from "date-fns";

const activityIcons = {
  stage_change: TrendingUp,
  milestone_completed: CheckCircle,
  contract_signed: FileText,
  meeting: Calendar,
  email: MessageSquare,
  call: MessageSquare,
  note_added: MessageSquare,
  document_uploaded: Upload
};

export default function ActivitiesTab({ partnership, activities }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: '#000' }}>Activity Timeline</h3>
      
      {activities.length === 0 ? (
        <p style={{ color: '#666' }}>No activities yet.</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.activity_type] || MessageSquare;
            
            return (
              <div key={activity.id} className="flex gap-3 p-4 rounded-lg" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#D8A11F20' }}>
                  <Icon className="w-5 h-5" style={{ color: '#D8A11F' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold" style={{ color: '#000' }}>{activity.title}</h4>
                      {activity.description && (
                        <p className="text-sm mt-1" style={{ color: '#666' }}>{activity.description}</p>
                      )}
                    </div>
                    <span className="text-xs whitespace-nowrap" style={{ color: '#9CA3AF' }}>
                      {format(new Date(activity.created_date), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <User className="w-3 h-3" style={{ color: '#9CA3AF' }} />
                    <span className="text-xs" style={{ color: '#666' }}>{activity.user_name || activity.user_email}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}