import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock } from "lucide-react";
import moment from "moment";

export default function ExpiringAdsNotice({ campaigns }) {
  const expiringCampaigns = campaigns.filter(c => {
    if (!c.expiry_date) return false;
    const daysRemaining = moment(c.expiry_date).diff(moment(), 'days');
    return daysRemaining <= 7 && daysRemaining > 0;
  });

  if (expiringCampaigns.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl mb-8"
      style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
          <Clock className="w-6 h-6" style={{ color: '#F59E0B' }} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#F59E0B' }}>
            Expiring Campaigns Alert
          </h3>
          <p className="mb-3" style={{ color: '#FCD34D' }}>
            You have {expiringCampaigns.length} campaign(s) expiring within the next 7 days:
          </p>
          <ul className="space-y-2">
            {expiringCampaigns.map(campaign => {
              const daysRemaining = moment(campaign.expiry_date).diff(moment(), 'days');
              return (
                <li key={campaign.id} className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" style={{ color: '#F59E0B' }} />
                  <span style={{ color: '#FDE68A' }}>
                    <strong>{campaign.business_name}</strong> - {daysRemaining} day(s) remaining
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}