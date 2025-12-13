import React, { useState, useEffect } from "react";
import Sidebar from "@/components/partnerships/Sidebar";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Eye, MousePointerClick, CheckCircle } from "lucide-react";
import CampaignList from "@/components/adcampaigns/CampaignList";
import AnalyticsDashboard from "@/components/adcampaigns/AnalyticsDashboard";
import PerformanceCards from "@/components/adcampaigns/PerformanceCards";
import ExpiringAdsNotice from "@/components/adcampaigns/ExpiringAdsNotice";

export default function AdCampaigns() {
  const [currentUser, setCurrentUser] = useState(null);
  const [vendorApp, setVendorApp] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
      
      const vendorApps = await base44.entities.VendorApplication.filter({
        user_email: user.email,
        status: "approved"
      });
      
      if (vendorApps.length > 0) {
        setVendorApp(vendorApps[0]);
      }
    };
    fetchUser();
  }, []);

  const { data: campaigns = [] } = useQuery({
    queryKey: ['ad-campaigns', vendorApp?.vendor_id],
    queryFn: () => base44.entities.AdvertiseApplication.filter({ vendor_id: vendorApp.vendor_id }),
    enabled: !!vendorApp?.vendor_id,
  });

  const { data: allMetrics = [] } = useQuery({
    queryKey: ['ad-metrics', vendorApp?.vendor_id],
    queryFn: () => base44.entities.AdMetrics.filter({ vendor_id: vendorApp.vendor_id }),
    enabled: !!vendorApp?.vendor_id,
  });

  const activeCampaigns = campaigns.filter(c => c.status === 'approved' && (!c.expiry_date || new Date(c.expiry_date) > new Date()));
  const expiredCampaigns = campaigns.filter(c => c.status === 'expired' || (c.expiry_date && new Date(c.expiry_date) <= new Date()));

  if (!vendorApp) {
    return (
      <div className="flex min-h-screen bg-gradient-main">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="glass-card p-8 max-w-md text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ color: '#7A8BA6' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#E5EDFF' }}>
              Vendor Status Required
            </h2>
            <p style={{ color: '#B6C4E0' }}>
              You must be an approved vendor to access the Ad Campaign Management dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-main">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8" style={{ color: '#3B82F6' }} />
              <h1 className="text-3xl font-bold" style={{ color: '#E5EDFF' }}>
                Ad Campaign Management
              </h1>
            </div>
            <p style={{ color: '#B6C4E0' }}>
              Monitor performance, manage campaigns, and optimize your advertising strategy
            </p>
          </div>

          {/* Expiring Ads Notice */}
          <ExpiringAdsNotice campaigns={activeCampaigns} />

          {/* Performance Overview Cards */}
          <PerformanceCards campaigns={campaigns} metrics={allMetrics} />

          {/* Analytics Dashboard */}
          <AnalyticsDashboard campaigns={campaigns} metrics={allMetrics} />

          {/* Campaign Management Tabs */}
          <Tabs defaultValue="active" className="mt-8">
            <TabsList className="glass-card p-2 rounded-2xl mb-6" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
              <TabsTrigger value="active" className="rounded-xl px-6 py-3 font-semibold" style={{ color: '#B6C4E0' }}>
                Active Campaigns ({activeCampaigns.length})
              </TabsTrigger>
              <TabsTrigger value="expired" className="rounded-xl px-6 py-3 font-semibold" style={{ color: '#B6C4E0' }}>
                Expired Campaigns ({expiredCampaigns.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="rounded-xl px-6 py-3 font-semibold" style={{ color: '#B6C4E0' }}>
                All Campaigns ({campaigns.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <CampaignList campaigns={activeCampaigns} metrics={allMetrics} type="active" />
            </TabsContent>

            <TabsContent value="expired">
              <CampaignList campaigns={expiredCampaigns} metrics={allMetrics} type="expired" />
            </TabsContent>

            <TabsContent value="all">
              <CampaignList campaigns={campaigns} metrics={allMetrics} type="all" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}