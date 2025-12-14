import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, MousePointerClick, CheckCircle, Clock, RefreshCw, Edit } from "lucide-react";
import moment from "moment";
import RenewCampaignDialog from "./RenewCampaignDialog";
import EditCampaignDialog from "./EditCampaignDialog";

export default function CampaignList({ campaigns, metrics, type }) {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getCampaignMetrics = (campaignId) => {
    const campaignMetrics = metrics.filter(m => m.application_id === campaignId);
    return {
      impressions: campaignMetrics.reduce((sum, m) => sum + (m.impressions || 0), 0),
      clicks: campaignMetrics.reduce((sum, m) => sum + (m.clicks || 0), 0),
      conversions: campaignMetrics.reduce((sum, m) => sum + (m.conversions || 0), 0)
    };
  };

  const getStatusBadge = (campaign) => {
    if (campaign.status === 'pending') {
      return <Badge className="bg-yellow-500/20 text-yellow-300">Pending Approval</Badge>;
    }
    if (campaign.status === 'rejected') {
      return <Badge className="bg-red-500/20 text-red-300">Rejected</Badge>;
    }
    if (campaign.status === 'expired' || (campaign.expiry_date && new Date(campaign.expiry_date) <= new Date())) {
      return <Badge className="bg-gray-500/20 text-gray-300">Expired</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-300">Active</Badge>;
  };

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const days = moment(expiryDate).diff(moment(), 'days');
    return days > 0 ? days : 0;
  };

  const handleRenew = (campaign) => {
    setSelectedCampaign(campaign);
    setShowRenewDialog(true);
  };

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setShowEditDialog(true);
  };

  if (campaigns.length === 0) {
    return (
      <div className="glass-card p-12 text-center rounded-2xl">
        <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: '#7A8BA6' }} />
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#E5EDFF' }}>
          No {type} campaigns found
        </h3>
        <p style={{ color: '#B6C4E0' }}>
          {type === 'active' ? 'Create your first ad campaign to get started.' : 'Your expired campaigns will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {campaigns.map((campaign, index) => {
          const stats = getCampaignMetrics(campaign.id);
          const daysRemaining = getDaysRemaining(campaign.expiry_date);
          const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;

          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Campaign Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold" style={{ color: '#E5EDFF' }}>
                          {campaign.business_name}
                        </h3>
                        {getStatusBadge(campaign)}
                        {isExpiringSoon && (
                          <Badge className="bg-orange-500/20 text-orange-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {daysRemaining} days left
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mb-2" style={{ color: '#B6C4E0' }}>
                        Package: {campaign.package}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#7A8BA6' }}>
                        {campaign.approved_date && (
                          <span>Started: {moment(campaign.approved_date).format('MMM DD, YYYY')}</span>
                        )}
                        {campaign.expiry_date && (
                          <span>Expires: {moment(campaign.expiry_date).format('MMM DD, YYYY')}</span>
                        )}
                        <span>Duration: {campaign.duration_months} month(s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="flex flex-wrap gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" style={{ color: '#3B82F6' }} />
                      <span className="text-sm font-medium" style={{ color: '#E5EDFF' }}>
                        {stats.impressions.toLocaleString()}
                      </span>
                      <span className="text-xs" style={{ color: '#7A8BA6' }}>impressions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointerClick className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                      <span className="text-sm font-medium" style={{ color: '#E5EDFF' }}>
                        {stats.clicks.toLocaleString()}
                      </span>
                      <span className="text-xs" style={{ color: '#7A8BA6' }}>clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                      <span className="text-sm font-medium" style={{ color: '#E5EDFF' }}>
                        {stats.conversions.toLocaleString()}
                      </span>
                      <span className="text-xs" style={{ color: '#7A8BA6' }}>conversions</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {campaign.status === 'pending' && (
                    <Button
                      onClick={() => handleEdit(campaign)}
                      className="rounded-lg flex items-center gap-2"
                      style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#A5B4FC', border: '1px solid rgba(99, 102, 241, 0.3)' }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Campaign
                    </Button>
                  )}
                  {(type === 'expired' || isExpiringSoon) && (
                    <Button
                      onClick={() => handleRenew(campaign)}
                      className="rounded-lg flex items-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)', color: '#fff' }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Renew Campaign
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedCampaign && (
        <>
          <RenewCampaignDialog
            open={showRenewDialog}
            onOpenChange={setShowRenewDialog}
            campaign={selectedCampaign}
          />
          <EditCampaignDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            campaign={selectedCampaign}
          />
        </>
      )}
    </>
  );
}