import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Eye, Calendar } from "lucide-react";
import moment from "moment";

export default function AdCampaignApplicationsTable() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [durationMonths, setDurationMonths] = useState(1);
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-ad-applications'],
    queryFn: () => base44.entities.AdvertiseApplication.list('-created_date'),
  });

  const approveMutation = useMutation({
    mutationFn: async ({ appId, durationMonths }) => {
      const approvedDate = new Date();
      const expiryDate = new Date(approvedDate);
      expiryDate.setMonth(expiryDate.getMonth() + parseInt(durationMonths));

      await base44.entities.AdvertiseApplication.update(appId, {
        status: 'approved',
        approved_date: approvedDate.toISOString(),
        expiry_date: expiryDate.toISOString(),
      });

      // Create notification for user
      const app = applications.find(a => a.id === appId);
      if (app) {
        await base44.entities.Notification.create({
          user_email: app.user_email,
          type: 'ad_campaign_approved',
          title: 'Ad Campaign Approved!',
          message: `Your ad campaign "${app.business_name}" has been approved and is now active. It will run until ${moment(expiryDate).format('MMM DD, YYYY')}.`,
          read: false,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ad-applications'] });
      setShowApproveDialog(false);
      setSelectedApp(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ appId, reason }) => {
      await base44.entities.AdvertiseApplication.update(appId, {
        status: 'rejected',
      });

      // Create notification for user
      const app = applications.find(a => a.id === appId);
      if (app) {
        await base44.entities.Notification.create({
          user_email: app.user_email,
          type: 'ad_campaign_rejected',
          title: 'Ad Campaign Not Approved',
          message: `Your ad campaign "${app.business_name}" was not approved. Reason: ${reason}`,
          read: false,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ad-applications'] });
      setShowRejectDialog(false);
      setSelectedApp(null);
      setRejectionReason("");
    },
  });

  const handleApprove = (app) => {
    setSelectedApp(app);
    setDurationMonths(app.duration_months || 1);
    setShowApproveDialog(true);
  };

  const handleReject = (app) => {
    setSelectedApp(app);
    setShowRejectDialog(true);
  };

  const confirmApproval = () => {
    if (selectedApp) {
      approveMutation.mutate({ appId: selectedApp.id, durationMonths });
    }
  };

  const confirmRejection = () => {
    if (selectedApp && rejectionReason.trim()) {
      rejectMutation.mutate({ appId: selectedApp.id, reason: rejectionReason });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#FEF3C7', color: '#D8A11F', text: 'Pending Review' },
      approved: { bg: '#D1FAE5', color: '#059669', text: 'Approved' },
      rejected: { bg: '#FEE2E2', color: '#DC2626', text: 'Rejected' },
      expired: { bg: '#F3F4F6', color: '#6B7280', text: 'Expired' },
    };
    const style = styles[status] || styles.pending;
    return (
      <Badge style={{ background: style.bg, color: style.color }}>
        {style.text}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading applications...</div>;
  }

  return (
    <>
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #000' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #000' }}>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000' }}>Business</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000' }}>Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000' }}>Package</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000' }}>Budget</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000' }}>Duration</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000' }}>Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000' }}>Applied</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={app.id} style={{ borderBottom: index < applications.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium" style={{ color: '#000' }}>{app.business_name}</p>
                      <p className="text-sm" style={{ color: '#666' }}>{app.user_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm" style={{ color: '#000' }}>{app.contact_name}</p>
                      <p className="text-sm" style={{ color: '#666' }}>{app.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm" style={{ color: '#000' }}>{app.package}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium" style={{ color: '#000' }}>{app.budget}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm" style={{ color: '#000' }}>{app.duration_months} month(s)</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm" style={{ color: '#666' }}>
                      {moment(app.created_date).format('MMM DD, YYYY')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {app.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(app)}
                          size="sm"
                          className="rounded-lg"
                          style={{ background: '#22C55E', color: '#fff' }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(app)}
                          size="sm"
                          className="rounded-lg"
                          style={{ background: '#EF4444', color: '#fff' }}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm" style={{ color: '#666' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: '#666' }} />
            <p style={{ color: '#666' }}>No ad campaign applications yet</p>
          </div>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent style={{ background: '#F2F1F5', border: '1px solid #000' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#000' }}>Approve Ad Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p style={{ color: '#666' }}>
              Approve ad campaign for <strong>{selectedApp?.business_name}</strong>?
            </p>
            <div>
              <Label style={{ color: '#000' }}>Campaign Duration (months)</Label>
              <Input
                type="number"
                min="1"
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value)}
                className="mt-2 rounded-xl"
                style={{ background: '#fff', border: '1px solid #000', color: '#000' }}
              />
              <p className="text-xs mt-1" style={{ color: '#666' }}>
                Campaign will expire on: {moment().add(durationMonths, 'months').format('MMM DD, YYYY')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowApproveDialog(false)}
                className="flex-1 rounded-lg"
                style={{ background: '#fff', color: '#000', border: '1px solid #000' }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApproval}
                disabled={approveMutation.isPending}
                className="flex-1 rounded-lg"
                style={{ background: '#22C55E', color: '#fff' }}
              >
                {approveMutation.isPending ? 'Approving...' : 'Approve Campaign'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent style={{ background: '#F2F1F5', border: '1px solid #000' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#000' }}>Reject Ad Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p style={{ color: '#666' }}>
              Reject ad campaign for <strong>{selectedApp?.business_name}</strong>?
            </p>
            <div>
              <Label style={{ color: '#000' }}>Reason for Rejection *</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-2 rounded-xl"
                style={{ background: '#fff', border: '1px solid #000', color: '#000' }}
                placeholder="Provide a clear reason for rejection..."
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason("");
                }}
                className="flex-1 rounded-lg"
                style={{ background: '#fff', color: '#000', border: '1px solid #000' }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRejection}
                disabled={!rejectionReason.trim() || rejectMutation.isPending}
                className="flex-1 rounded-lg"
                style={{ background: '#EF4444', color: '#fff', opacity: !rejectionReason.trim() ? 0.5 : 1 }}
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject Campaign'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}