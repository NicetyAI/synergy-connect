import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Activity as ActivityIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ActivityTab({ userEmail }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: activities = [] } = useQuery({
    queryKey: ['userActivities', userEmail],
    queryFn: () => base44.entities.Activity.filter({ user_email: userEmail }),
  });

  // Sort by most recent first
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.created_date) - new Date(a.created_date)
  );

  // Pagination
  const totalPages = Math.ceil(sortedActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = sortedActivities.slice(startIndex, endIndex);

  const getActivityTypeColor = (type) => {
    const colors = {
      connection: 'bg-blue-500/20 text-blue-300',
      post: 'bg-purple-500/20 text-purple-300',
      comment: 'bg-green-500/20 text-green-300',
      achievement: 'bg-yellow-500/20 text-yellow-300',
      interest_approved: 'bg-teal-500/20 text-teal-300',
      interest_created: 'bg-indigo-500/20 text-indigo-300',
      user_login: 'bg-gray-500/20 text-gray-300',
      admin_user_profile_update: 'bg-orange-500/20 text-orange-300',
      admin_opening_updated: 'bg-pink-500/20 text-pink-300',
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300';
  };

  const getActivityTypeLabel = (type) => {
    const labels = {
      connection: 'Connection',
      post: 'Post',
      comment: 'Comment',
      achievement: 'Achievement',
      interest_approved: 'Interest Approved',
      interest_created: 'Interest Created',
      user_login: 'User Login',
      admin_user_profile_update: 'Admin User Profile Update',
      admin_opening_updated: 'Admin Opening Updated',
    };
    return labels[type] || type.replace(/_/g, ' ');
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 7;
    
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) buttons.push(i);
        buttons.push('...');
        buttons.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        buttons.push(1);
        buttons.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) buttons.push(i);
      } else {
        buttons.push(1);
        buttons.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) buttons.push(i);
        buttons.push('...');
        buttons.push(totalPages);
      }
    }
    
    return buttons;
  };

  return (
    <div className="p-8 rounded-2xl" style={{ background: '#fff', border: '2px solid #000' }}>
      <div className="flex items-center gap-3 mb-8">
        <ActivityIcon className="w-8 h-8" style={{ color: '#3B82F6' }} />
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#000' }}>Activity Log</h2>
          <p className="text-sm" style={{ color: '#666' }}>
            Track all your activities and actions
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div className="mb-4">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 rounded-xl" style={{ background: '#F2F1F5' }}>
          <div className="col-span-1">
            <span className="text-sm font-semibold" style={{ color: '#000' }}>Status</span>
          </div>
          <div className="col-span-2">
            <span className="text-sm font-semibold" style={{ color: '#000' }}>Type</span>
          </div>
          <div className="col-span-6">
            <span className="text-sm font-semibold" style={{ color: '#000' }}>Message</span>
          </div>
          <div className="col-span-3">
            <span className="text-sm font-semibold" style={{ color: '#000' }}>Created At</span>
          </div>
        </div>
      </div>

      {/* Activity List */}
      {currentActivities.length > 0 ? (
        <div className="space-y-2 mb-6">
          {currentActivities.map((activity) => (
            <div 
              key={activity.id}
              className="grid grid-cols-12 gap-4 px-4 py-4 rounded-xl transition-all hover:bg-gray-50"
              style={{ background: '#fff', border: '1px solid #ddd' }}
            >
              <div className="col-span-1 flex items-center">
                <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#3B82F6' }}></div>
              </div>
              <div className="col-span-2 flex items-center">
                <Badge className={getActivityTypeColor(activity.type)}>
                  {getActivityTypeLabel(activity.type)}
                </Badge>
              </div>
              <div className="col-span-6 flex items-center">
                <p className="text-sm" style={{ color: '#000' }}>
                  {activity.description || activity.title}
                </p>
              </div>
              <div className="col-span-3 flex items-center">
                <p className="text-sm" style={{ color: '#666' }}>
                  {formatDistanceToNow(new Date(activity.created_date), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ActivityIcon className="w-16 h-16 mx-auto mb-4" style={{ color: '#7A8BA6' }} />
          <p style={{ color: '#7A8BA6' }}>No activities to display</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg p-2"
            style={{ 
              background: currentPage === 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)', 
              color: '#B6C4E0',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {renderPaginationButtons().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2" style={{ color: '#7A8BA6' }}>...</span>
            ) : (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="rounded-lg w-10 h-10"
                style={{ 
                  background: currentPage === page 
                    ? 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: currentPage === page ? '#fff' : '#B6C4E0'
                }}
              >
                {page}
              </Button>
            )
          ))}

          <Button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg p-2"
            style={{ 
              background: currentPage === totalPages ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)', 
              color: '#B6C4E0',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}