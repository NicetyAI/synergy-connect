import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle, Circle, ChevronRight, X, Sparkles, User, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingDialog from "@/components/profile/OnboardingDialog";

export default function ProfileCompletionWizard({ user, onNavigateToTab }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { data: interests = [] } = useQuery({
    queryKey: ['userInterests', user.email],
    queryFn: () => base44.entities.Interest.filter({ user_email: user.email, status: 'approved' }),
  });



  // Calculate completion status
  const completionChecks = [
    {
      id: 'basic',
      label: 'Basic Information',
      icon: User,
      tab: 'about',
      completed: !!(user.full_name && user.email && user.occupation),
      suggestions: [
        !user.full_name && 'Add your full name',
        !user.occupation && 'Add your occupation',
        !user.phone_number && 'Add your phone number',
        !user.location && 'Add your location',
      ].filter(Boolean),
    },
    {
      id: 'profile',
      label: 'Profile Details',
      icon: Target,
      tab: 'about',
      completed: !!(user.overview && user.business_name),
      suggestions: [
        !user.overview && 'Write a compelling overview about yourself',
        !user.business_name && 'Add your business name',
        !user.avatar_url && 'Upload a profile photo',
      ].filter(Boolean),
    },
    {
      id: 'interests',
      label: 'Interests',
      icon: Heart,
      tab: 'interest',
      completed: interests.length >= 3,
      suggestions: interests.length === 0 
        ? ['Add at least 3 interests to get better recommendations']
        : interests.length < 3
        ? [`Add ${3 - interests.length} more interest${3 - interests.length !== 1 ? 's' : ''} to unlock full matching`]
        : [],
    },

  ];

  const completedCount = completionChecks.filter(c => c.completed).length;
  const totalCount = completionChecks.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);
  const isFullyComplete = completionPercentage === 100;

  if (isDismissed || isFullyComplete) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-8 rounded-2xl overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          border: '2px solid #F59E0B',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
        }}
      >
        {/* Header */}
        <div className="p-6 flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" 
              style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#000' }}>
                Complete Your Profile
              </h3>
              <p className="text-sm mb-4" style={{ color: '#78350F' }}>
                A complete profile helps you get better recommendations and connects you with the right people
              </p>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <Progress 
                  value={completionPercentage} 
                  className="h-3 flex-1"
                  style={{ background: 'rgba(0,0,0,0.1)' }}
                />
                <span className="text-lg font-bold min-w-[60px]" style={{ color: '#D97706' }}>
                  {completionPercentage}%
                </span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => setIsDismissed(true)}
            variant="ghost"
            size="icon"
            className="rounded-lg flex-shrink-0"
            style={{ color: '#92400E' }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
                {completionChecks.map((check) => {
                  const Icon = check.icon;
                  return (
                    <motion.div
                      key={check.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-xl transition-all cursor-pointer"
                      style={{ 
                        background: check.completed ? '#FEF3C7' : '#fff',
                        border: check.completed ? '2px solid #22C55E' : '2px solid #E5E7EB'
                      }}
                      onClick={() => onNavigateToTab(check.tab)}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0">
                          {check.completed ? (
                            <CheckCircle className="w-6 h-6" style={{ color: '#22C55E' }} />
                          ) : (
                            <Circle className="w-6 h-6" style={{ color: '#9CA3AF' }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-5 h-5 flex-shrink-0" style={{ color: check.completed ? '#22C55E' : '#6B7280' }} />
                            <h4 className="font-bold" style={{ color: '#000' }}>{check.label}</h4>
                          </div>
                          {check.suggestions.length > 0 && (
                            <div className="space-y-1 mt-2">
                              {check.suggestions.map((suggestion, idx) => (
                                <p key={idx} className="text-xs flex items-start gap-1" style={{ color: '#78350F' }}>
                                  <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
                                  <span>{suggestion}</span>
                                </p>
                              ))}
                            </div>
                          )}
                          {check.completed && (
                            <p className="text-xs mt-1" style={{ color: '#22C55E' }}>✓ Completed</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Button */}
              {completedCount < totalCount && (
                <div className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={() => setShowOnboarding(true)}
                    className="w-full rounded-xl py-4 text-lg font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
                    style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#fff', border: 'none' }}
                  >
                    Continue Setup
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 flex items-center justify-center gap-2 transition-colors hover:bg-black/5"
          style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
        >
          <span className="text-sm font-medium" style={{ color: '#78350F' }}>
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </span>
          <ChevronRight 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
            style={{ color: '#78350F' }}
          />
        </button>
      </motion.div>

      <OnboardingDialog
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        user={user}
      />
    </AnimatePresence>
  );
}