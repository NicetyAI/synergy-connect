import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";

export default function RenewCampaignDialog({ open, onOpenChange, campaign }) {
  const [durationMonths, setDurationMonths] = useState(campaign?.duration_months || 1);
  const queryClient = useQueryClient();

  const renewMutation = useMutation({
    mutationFn: async (data) => {
      // Calculate new expiry date
      const startDate = campaign.expiry_date && new Date(campaign.expiry_date) > new Date() 
        ? moment(campaign.expiry_date)
        : moment();
      
      const newExpiryDate = startDate.add(data.duration_months, 'months').toISOString();

      return base44.entities.AdvertiseApplication.update(campaign.id, {
        duration_months: campaign.duration_months + data.duration_months,
        expiry_date: newExpiryDate,
        status: 'approved'
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['ad-campaigns'] });
      
      // Create notification
      await base44.entities.Notification.create({
        recipient_email: campaign.user_email,
        type: 'ad_renewed',
        title: 'Campaign Renewed Successfully',
        message: `Your ad campaign "${campaign.business_name}" has been extended for ${durationMonths} more month(s).`,
        read: false
      });

      onOpenChange(false);
    }
  });

  const handleRenew = () => {
    renewMutation.mutate({ duration_months: parseInt(durationMonths) });
  };

  const calculateNewExpiry = () => {
    const startDate = campaign.expiry_date && new Date(campaign.expiry_date) > new Date() 
      ? moment(campaign.expiry_date)
      : moment();
    
    return startDate.add(parseInt(durationMonths), 'months').format('MMM DD, YYYY');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" style={{ background: '#0F2744', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color: '#E5EDFF' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)' }}>
              <RefreshCw className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            Renew Ad Campaign
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Campaign Info */}
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 className="font-semibold mb-2" style={{ color: '#E5EDFF' }}>
              {campaign?.business_name}
            </h3>
            <p className="text-sm" style={{ color: '#B6C4E0' }}>
              Current Package: {campaign?.package}
            </p>
            {campaign?.expiry_date && (
              <p className="text-sm" style={{ color: '#7A8BA6' }}>
                Current Expiry: {moment(campaign.expiry_date).format('MMM DD, YYYY')}
              </p>
            )}
          </div>

          {/* Extension Duration */}
          <div>
            <Label htmlFor="duration" style={{ color: '#B6C4E0' }}>
              Extension Duration (months) *
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
              className="glass-input mt-2"
              style={{ color: '#E5EDFF' }}
            />
            <p className="text-xs mt-2" style={{ color: '#7A8BA6' }}>
              Minimum 1 month extension
            </p>
          </div>

          {/* New Expiry Date */}
          <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <Calendar className="w-5 h-5" style={{ color: '#3B82F6' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#E5EDFF' }}>
                New Expiry Date
              </p>
              <p className="text-lg font-bold" style={{ color: '#3B82F6' }}>
                {calculateNewExpiry()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#B6C4E0', border: '1px solid rgba(255, 255, 255, 0.18)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenew}
              disabled={renewMutation.isPending}
              className="flex-1 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)', color: '#fff' }}
            >
              {renewMutation.isPending ? 'Processing...' : 'Renew Campaign'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}