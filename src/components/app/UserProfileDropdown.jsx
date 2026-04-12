import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { User, Settings, LogOut, Shield, ChevronDown, Crown, Zap, Sparkles } from "lucide-react";
import { canAccessAdmin } from "@/components/utils/permissions";

const PLAN_CONFIG = {
  free: { label: "Free Plan", color: "#6B7280", bg: "rgba(107,114,128,0.15)", icon: Zap },
  professional: { label: "Pro Plan", color: "#D8A11F", bg: "rgba(216,161,31,0.15)", icon: Sparkles },
  enterprise: { label: "Enterprise", color: "#7C3AED", bg: "rgba(124,58,237,0.15)", icon: Crown },
};

export default function UserProfileDropdown({ user, compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const plan = PLAN_CONFIG[user.subscription_plan] || PLAN_CONFIG.free;
  const isAdmin = user.role === "admin";
  const PlanIcon = plan.icon;

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:opacity-90"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: plan.color }}>
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: plan.color }}>
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        {!compact && (
          <>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-semibold leading-tight truncate max-w-[100px]" style={{ color: '#E5EDFF' }}>
                {user.full_name || "User"}
              </p>
              <div className="flex items-center gap-1">
                <PlanIcon className="w-3 h-3" style={{ color: plan.color }} />
                <span className="text-[10px] font-medium" style={{ color: plan.color }}>
                  {isAdmin ? "Admin" : plan.label}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 hidden xl:block" style={{ color: '#7A8BA6' }} />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden z-50 shadow-2xl"
          style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          {/* User Info */}
          <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: plan.color }}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: plan.color }}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: '#E5EDFF' }}>
                  {user.full_name || "User"}
                </p>
                <p className="text-xs truncate" style={{ color: '#7A8BA6' }}>{user.email}</p>
              </div>
            </div>
            {/* Plan Badge */}
            <div
              className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: plan.bg, border: `1px solid ${plan.color}33` }}
            >
              <PlanIcon className="w-4 h-4" style={{ color: plan.color }} />
              <span className="text-xs font-semibold" style={{ color: plan.color }}>
                {isAdmin ? "Administrator" : plan.label}
              </span>
              {user.subscription_plan === "free" && !isAdmin && (
                <Link
                  to="/#pricing"
                  onClick={() => setOpen(false)}
                  className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#D8A11F', color: '#fff' }}
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              to={createPageUrl("Profile")}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5"
            >
              <User className="w-4 h-4" style={{ color: '#B6C4E0' }} />
              <span className="text-sm font-medium" style={{ color: '#B6C4E0' }}>My Profile</span>
            </Link>
            <Link
              to={createPageUrl("Settings")}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5"
            >
              <Settings className="w-4 h-4" style={{ color: '#B6C4E0' }} />
              <span className="text-sm font-medium" style={{ color: '#B6C4E0' }}>Settings</span>
            </Link>
            {canAccessAdmin(user.role) && (
              <Link
                to={createPageUrl("Admin")}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5"
              >
                <Shield className="w-4 h-4" style={{ color: '#EF4444' }} />
                <span className="text-sm font-medium" style={{ color: '#EF4444' }}>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Sign Out */}
          <div className="p-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => { setOpen(false); base44.auth.logout(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" style={{ color: '#EF4444' }} />
              <span className="text-sm font-medium" style={{ color: '#EF4444' }}>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}