import React, { useState } from "react";
import Sidebar from "@/components/partnerships/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, BarChart3, Table as TableIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import CreatePartnershipDialog from "@/components/partnerships/CreatePartnershipDialog";
import PartnershipDetailsDialog from "@/components/partnerships/PartnershipDetailsDialog";
import PartnershipDashboard from "@/components/partnerships/PartnershipDashboard";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const stageColors = {
  outreach: { bg: '#E0E7FF', text: '#4338CA' },
  negotiation: { bg: '#FEF3C7', text: '#92400E' },
  agreement: { bg: '#DBEAFE', text: '#1E40AF' },
  active: { bg: '#D1FAE5', text: '#065F46' },
  renewal: { bg: '#FED7AA', text: '#9A3412' },
  termination: { bg: '#FEE2E2', text: '#991B1B' },
  completed: { bg: '#E5E7EB', text: '#374151' }
};

export default function PartnershipManagement() {
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: partnerships, isLoading } = useQuery({
    queryKey: ['partnerships'],
    queryFn: () => base44.entities.Partnership.list('-created_date')
  });

  const handlePartnershipClick = (partnership) => {
    setSelectedPartnership(partnership);
    setDetailsOpen(true);
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto" style={{ minHeight: 'calc(100vh - 73px)', background: '#F2F1F5' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#000' }}>
                Partnership Lifecycle Management
              </h1>
              <p style={{ color: '#000' }}>
                Track and manage partnerships from outreach to completion
              </p>
            </div>
            <CreatePartnershipDialog />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList>
              <TabsTrigger value="dashboard">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="partnerships">
                <TableIcon className="w-4 h-4 mr-2" />
                All Partnerships
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <PartnershipDashboard />
            </TabsContent>

            <TabsContent value="partnerships">
              {isLoading ? (
                <div className="text-center py-12">
                  <p style={{ color: '#000' }}>Loading partnerships...</p>
                </div>
              ) : partnerships?.length === 0 ? (
                <div className="text-center py-12">
                  <p style={{ color: '#000' }}>No partnerships yet. Create your first one to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partnerships?.map((partnership) => {
                    const stageColor = stageColors[partnership.stage] || stageColors.outreach;
                    
                    return (
                      <div
                        key={partnership.id}
                        onClick={() => handlePartnershipClick(partnership)}
                        className="p-6 rounded-lg cursor-pointer transition-all hover:shadow-lg"
                        style={{ background: '#fff', border: '1px solid #E5E7EB' }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg" style={{ color: '#000' }}>
                            {partnership.title}
                          </h3>
                          <Badge style={{ background: stageColor.bg, color: stageColor.text }}>
                            {partnership.stage}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <p style={{ color: '#000' }}>
                            <span className="font-medium">Partner:</span> {partnership.partner_name}
                          </p>
                          {partnership.industry && (
                            <p style={{ color: '#000' }}>
                              <span className="font-medium">Industry:</span> {partnership.industry}
                            </p>
                          )}
                          {partnership.deal_size && (
                            <p style={{ color: '#000' }}>
                              <span className="font-medium">Deal Size:</span> {partnership.deal_size}
                            </p>
                          )}
                          {partnership.start_date && (
                            <p style={{ color: '#000' }}>
                              <span className="font-medium">Started:</span> {format(new Date(partnership.start_date), 'MMM d, yyyy')}
                            </p>
                          )}
                          {partnership.performance_score && (
                            <div>
                              <p className="font-medium mb-1" style={{ color: '#000' }}>Performance: {partnership.performance_score}%</p>
                              <div className="w-full h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-full rounded-full" 
                                  style={{ 
                                    width: `${partnership.performance_score}%`,
                                    background: partnership.performance_score >= 75 ? '#22C55E' : partnership.performance_score >= 50 ? '#FACC15' : '#EF4444'
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {selectedPartnership && (
        <PartnershipDetailsDialog
          partnership={selectedPartnership}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
    </div>
  );
}