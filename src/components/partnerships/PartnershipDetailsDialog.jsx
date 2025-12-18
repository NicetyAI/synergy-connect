import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Activity,
  CheckCircle,
  Clock,
  Upload,
  Download,
  Edit,
  Trash2
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import MilestonesTab from "./details/MilestonesTab";
import RemindersTab from "./details/RemindersTab";
import ActivitiesTab from "./details/ActivitiesTab";
import ContractTab from "./details/ContractTab";
import OverviewTab from "./details/OverviewTab";

const stageColors = {
  outreach: { bg: '#E0E7FF', text: '#4338CA' },
  negotiation: { bg: '#FEF3C7', text: '#92400E' },
  agreement: { bg: '#DBEAFE', text: '#1E40AF' },
  active: { bg: '#D1FAE5', text: '#065F46' },
  renewal: { bg: '#FED7AA', text: '#9A3412' },
  termination: { bg: '#FEE2E2', text: '#991B1B' },
  completed: { bg: '#E5E7EB', text: '#374151' }
};

export default function PartnershipDetailsDialog({ partnership, open, onOpenChange }) {
  const queryClient = useQueryClient();

  const { data: milestones } = useQuery({
    queryKey: ['partnershipMilestones', partnership?.id],
    queryFn: () => base44.entities.PartnershipMilestone.filter({ partnership_id: partnership.id }),
    enabled: !!partnership
  });

  const { data: reminders } = useQuery({
    queryKey: ['partnershipReminders', partnership?.id],
    queryFn: () => base44.entities.PartnershipReminder.filter({ partnership_id: partnership.id }),
    enabled: !!partnership
  });

  const { data: activities } = useQuery({
    queryKey: ['partnershipActivities', partnership?.id],
    queryFn: () => base44.entities.PartnershipActivity.filter({ partnership_id: partnership.id }, '-created_date'),
    enabled: !!partnership
  });

  if (!partnership) return null;

  const stageColor = stageColors[partnership.stage] || stageColors.outreach;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" style={{ background: '#fff' }}>
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl mb-2" style={{ color: '#000' }}>{partnership.title}</DialogTitle>
              <div className="flex items-center gap-3">
                <Badge style={{ background: stageColor.bg, color: stageColor.text }}>
                  {partnership.stage.charAt(0).toUpperCase() + partnership.stage.slice(1)}
                </Badge>
                {partnership.industry && (
                  <span className="text-sm" style={{ color: '#666' }}>{partnership.industry}</span>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones ({milestones?.length || 0})</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="reminders">Reminders ({reminders?.length || 0})</TabsTrigger>
            <TabsTrigger value="activities">Activities ({activities?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab partnership={partnership} />
          </TabsContent>

          <TabsContent value="milestones" className="mt-6">
            <MilestonesTab partnership={partnership} milestones={milestones || []} />
          </TabsContent>

          <TabsContent value="contract" className="mt-6">
            <ContractTab partnership={partnership} />
          </TabsContent>

          <TabsContent value="reminders" className="mt-6">
            <RemindersTab partnership={partnership} reminders={reminders || []} />
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <ActivitiesTab partnership={partnership} activities={activities || []} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}