import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Eye, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function VendorApplicationsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['vendorApplications'],
    queryFn: () => base44.entities.VendorApplication.list('-created_date'),
  });

  const approveMutation = useMutation({
    mutationFn: async (applicationId) => {
      const vendorId = `vendor_${Date.now()}`;
      await base44.entities.VendorApplication.update(applicationId, {
        status: 'approved',
        vendor_id: vendorId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorApplications'] });
      setSelectedApplication(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (applicationId) =>
      base44.entities.VendorApplication.update(applicationId, { status: 'rejected' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorApplications'] });
      setSelectedApplication(null);
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ appId, featured }) => 
      base44.entities.VendorApplication.update(appId, { featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorApplications'] });
    },
  });

  const filteredApplications = applications.filter(app =>
    app.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
  };

  if (isLoading) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center">
        <p style={{ color: '#7A8BA6' }}>Loading vendor applications...</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>
              Vendor Applications
            </h2>
            <p className="text-sm mt-1" style={{ color: '#7A8BA6' }}>
              {applications.length} total applications
            </p>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A8BA6' }} />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-input"
              style={{ color: '#E5EDFF' }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ color: '#B6C4E0' }}>Business Name</TableHead>
                <TableHead style={{ color: '#B6C4E0' }}>Email</TableHead>
                <TableHead style={{ color: '#B6C4E0' }}>Category</TableHead>
                <TableHead style={{ color: '#B6C4E0' }}>Province</TableHead>
                <TableHead style={{ color: '#B6C4E0' }}>Status</TableHead>
                <TableHead style={{ color: '#B6C4E0' }}>Featured</TableHead>
                <TableHead style={{ color: '#B6C4E0' }}>Date</TableHead>
                <TableHead style={{ color: '#B6C4E0' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => {
                const StatusIcon = statusColors[app.status]?.icon || Clock;
                return (
                  <TableRow key={app.id}>
                    <TableCell style={{ color: '#E5EDFF' }} className="font-medium">
                      {app.business_name}
                    </TableCell>
                    <TableCell style={{ color: '#B6C4E0' }}>{app.user_email}</TableCell>
                    <TableCell style={{ color: '#B6C4E0' }}>{app.category}</TableCell>
                    <TableCell style={{ color: '#B6C4E0' }}>{app.province}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[app.status]?.bg} ${statusColors[app.status]?.text}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {app.status === 'approved' && (
                        <Button
                          size="sm"
                          variant={app.featured ? "default" : "outline"}
                          onClick={() => toggleFeaturedMutation.mutate({ appId: app.id, featured: !app.featured })}
                          disabled={toggleFeaturedMutation.isPending}
                          className={app.featured ? 'bg-[#D8A11F] hover:bg-[#C2941B]' : ''}
                        >
                          <Star className="w-3 h-3 mr-1" fill={app.featured ? 'currentColor' : 'none'} />
                          {app.featured ? 'Featured' : 'Feature'}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell style={{ color: '#B6C4E0' }}>
                      {new Date(app.created_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {app.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => approveMutation.mutate(app.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => rejectMutation.mutate(app.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* View Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="glass-card max-w-2xl" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#E5EDFF' }}>Application Details</DialogTitle>
            <DialogDescription style={{ color: '#7A8BA6' }}>
              Review vendor application information
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#7A8BA6' }}>Business Name</p>
                  <p style={{ color: '#E5EDFF' }}>{selectedApplication.business_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#7A8BA6' }}>Email</p>
                  <p style={{ color: '#E5EDFF' }}>{selectedApplication.user_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#7A8BA6' }}>Category</p>
                  <p style={{ color: '#E5EDFF' }}>{selectedApplication.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#7A8BA6' }}>Province</p>
                  <p style={{ color: '#E5EDFF' }}>{selectedApplication.province}</p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#7A8BA6' }}>Status</p>
                  <Badge className={`${statusColors[selectedApplication.status]?.bg} ${statusColors[selectedApplication.status]?.text}`}>
                    {selectedApplication.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#7A8BA6' }}>Vendor ID</p>
                  <p style={{ color: '#E5EDFF' }}>{selectedApplication.vendor_id || 'Not assigned'}</p>
                </div>
              </div>

              {selectedApplication.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => approveMutation.mutate(selectedApplication.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    onClick={() => rejectMutation.mutate(selectedApplication.id)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}