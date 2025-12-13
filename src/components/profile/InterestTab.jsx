import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X, CheckCircle, XCircle, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterestTab({ user, isOwnProfile }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newInterest, setNewInterest] = useState({ interest_name: "", description: "" });
  const queryClient = useQueryClient();

  const { data: interests = [] } = useQuery({
    queryKey: ['interests', user.email],
    queryFn: () => base44.entities.Interest.filter({ user_email: user.email }),
  });

  const addInterestMutation = useMutation({
    mutationFn: (data) => base44.entities.Interest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
      setShowAddDialog(false);
      setNewInterest({ interest_name: "", description: "" });
    },
  });

  const deleteInterestMutation = useMutation({
    mutationFn: (id) => base44.entities.Interest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
  });

  const handleAddInterest = () => {
    if (!newInterest.interest_name.trim()) return;
    addInterestMutation.mutate({
      user_email: user.email,
      interest_name: newInterest.interest_name,
      description: newInterest.description,
      status: "pending"
    });
  };

  const myInterests = interests.filter(i => i.status === "approved");
  const pendingInterests = interests.filter(i => i.status === "pending");
  const rejectedInterests = interests.filter(i => i.status === "rejected");

  const InterestCard = ({ interest, showDelete = false }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card p-6 rounded-2xl group cursor-pointer"
      style={{ 
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md" 
              style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
              <Sparkles className="w-5 h-5" style={{ color: '#E5EDFF' }} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1" style={{ color: '#E5EDFF' }}>{interest.interest_name}</h4>
              {interest.status === "approved" && (
                <Badge className="text-xs font-semibold px-3 py-1" style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)' }}>
                  <CheckCircle className="w-3 h-3 mr-1.5" />
                  Approved
                </Badge>
              )}
              {interest.status === "pending" && (
                <Badge className="text-xs font-semibold px-3 py-1" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)' }}>
                  <Clock className="w-3 h-3 mr-1.5" />
                  Pending Review
                </Badge>
              )}
              {interest.status === "rejected" && (
                <Badge className="text-xs font-semibold px-3 py-1" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)' }}>
                  <XCircle className="w-3 h-3 mr-1.5" />
                  Rejected
                </Badge>
              )}
            </div>
          </div>
          {interest.description && (
            <p className="text-sm leading-relaxed ml-13" style={{ color: '#B6C4E0' }}>{interest.description}</p>
          )}
        </div>
        {showDelete && isOwnProfile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              deleteInterestMutation.mutate(interest.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
            style={{ color: '#EF4444' }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );

  const EmptyState = ({ message }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg" 
        style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
        <Sparkles className="w-10 h-10" style={{ color: '#667EEA' }} />
      </div>
      <p className="text-lg font-medium" style={{ color: '#B6C4E0' }}>{message}</p>
    </motion.div>
  );

  return (
    <>
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#E5EDFF' }}>Interests</h2>
            <p className="text-sm" style={{ color: '#7A8BA6' }}>Manage your interests and preferences</p>
          </div>
          {isOwnProfile && (
            <Button
              onClick={() => setShowAddDialog(true)}
              className="gap-2 px-6 py-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', color: '#fff' }}
            >
              <Plus className="w-4 h-4" />
              Add Interest
            </Button>
          )}
        </div>

        <Tabs defaultValue="my-interests" className="w-full">
          <TabsList className="glass-card mb-8 p-2 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <TabsTrigger value="my-interests" className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#667EEA] data-[state=active]:text-white" style={{ color: '#B6C4E0' }}>
              My Interests
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#667EEA] data-[state=active]:text-white" style={{ color: '#B6C4E0' }}>
              Pending
            </TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#667EEA] data-[state=active]:text-white" style={{ color: '#B6C4E0' }}>
              Rejected
            </TabsTrigger>
            <TabsTrigger value="available" className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#667EEA] data-[state=active]:text-white" style={{ color: '#B6C4E0' }}>
              Available
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-interests" className="mt-6">
            {myInterests.length === 0 ? (
              <EmptyState message="You haven't added any interests yet." />
            ) : (
              <>
                <div className="mb-4 px-1">
                  <p className="text-sm font-medium" style={{ color: '#7A8BA6' }}>
                    {myInterests.length} {myInterests.length === 1 ? 'Interest' : 'Interests'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {myInterests.map((interest, index) => (
                      <motion.div
                        key={interest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <InterestCard interest={interest} showDelete />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {pendingInterests.length === 0 ? (
              <EmptyState message="You have no pending interest requests." />
            ) : (
              <>
                <div className="mb-4 px-1">
                  <p className="text-sm font-medium" style={{ color: '#7A8BA6' }}>
                    {pendingInterests.length} Pending {pendingInterests.length === 1 ? 'Request' : 'Requests'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {pendingInterests.map((interest, index) => (
                      <motion.div
                        key={interest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <InterestCard interest={interest} showDelete />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            {rejectedInterests.length === 0 ? (
              <EmptyState message="You have no rejected interests." />
            ) : (
              <>
                <div className="mb-4 px-1">
                  <p className="text-sm font-medium" style={{ color: '#7A8BA6' }}>
                    {rejectedInterests.length} Rejected {rejectedInterests.length === 1 ? 'Interest' : 'Interests'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {rejectedInterests.map((interest, index) => (
                      <motion.div
                        key={interest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <InterestCard interest={interest} showDelete />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <div className="glass-card p-8 rounded-2xl" style={{ background: 'rgba(102, 126, 234, 0.08)', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#E5EDFF' }}>Suggested Interests</h3>
                <p className="text-sm" style={{ color: '#B6C4E0' }}>Click on any interest to add it to your profile</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {["Business", "Technology", "Finance", "Real Estate", "Marketing", "Sales", "Operations", "Investments", "Partnerships", "Acquisitions", "Franchising", "Consulting", "Strategy", "Innovation", "Leadership", "Growth"].map((interest, index) => (
                  <motion.div
                    key={interest}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-xl py-6 font-semibold transition-all"
                      style={{ 
                        borderColor: 'rgba(102, 126, 234, 0.3)', 
                        color: '#E5EDFF',
                        background: 'rgba(102, 126, 234, 0.05)'
                      }}
                      onClick={() => {
                        setNewInterest({ interest_name: interest, description: "" });
                        setShowAddDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {interest}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Interest Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent style={{ background: '#0F2744', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ color: '#E5EDFF' }}>Add New Interest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label style={{ color: '#B6C4E0' }}>Interest Name *</Label>
              <Input
                value={newInterest.interest_name}
                onChange={(e) => setNewInterest({ ...newInterest, interest_name: e.target.value })}
                placeholder="e.g., Business Development"
                className="glass-input mt-2"
                style={{ color: '#E5EDFF' }}
              />
            </div>
            <div>
              <Label style={{ color: '#B6C4E0' }}>Description (Optional)</Label>
              <Textarea
                value={newInterest.description}
                onChange={(e) => setNewInterest({ ...newInterest, description: e.target.value })}
                placeholder="Why are you interested in this?"
                className="glass-input mt-2"
                style={{ color: '#E5EDFF' }}
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowAddDialog(false)}
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#B6C4E0' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddInterest}
              disabled={addInterestMutation.isPending || !newInterest.interest_name.trim()}
              style={{ background: '#667EEA', color: '#fff' }}
            >
              {addInterestMutation.isPending ? 'Adding...' : 'Add Interest'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}