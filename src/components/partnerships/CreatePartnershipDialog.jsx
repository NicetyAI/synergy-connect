import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreatePartnershipDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    partner_name: "",
    partner_email: "",
    industry: "",
    deal_size: "",
    stage: "outreach",
    start_date: "",
    notes: ""
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.Partnership.create({
        ...data,
        owner_email: user.email
      });
    },
    onSuccess: async (partnership) => {
      // Create activity log
      const user = await base44.auth.me();
      await base44.entities.PartnershipActivity.create({
        partnership_id: partnership.id,
        activity_type: "stage_change",
        title: "Partnership created",
        description: `Partnership created in ${partnership.stage} stage`,
        user_email: user.email,
        user_name: user.full_name
      });
      
      queryClient.invalidateQueries({ queryKey: ['partnerships'] });
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        partner_name: "",
        partner_email: "",
        industry: "",
        deal_size: "",
        stage: "outreach",
        start_date: "",
        notes: ""
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button style={{ background: '#D8A11F', color: '#fff' }}>
          <Plus className="w-4 h-4 mr-2" />
          New Partnership
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#fff' }}>
        <DialogHeader>
          <DialogTitle style={{ color: '#000' }}>Create New Partnership</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label style={{ color: '#000' }}>Partnership Title *</Label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Strategic Partnership with XYZ Corp"
              style={{ color: '#000' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label style={{ color: '#000' }}>Partner Name *</Label>
              <Input
                required
                value={formData.partner_name}
                onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                placeholder="Company or person name"
                style={{ color: '#000' }}
              />
            </div>
            <div>
              <Label style={{ color: '#000' }}>Partner Email</Label>
              <Input
                type="email"
                value={formData.partner_email}
                onChange={(e) => setFormData({ ...formData, partner_email: e.target.value })}
                placeholder="contact@partner.com"
                style={{ color: '#000' }}
              />
            </div>
          </div>

          <div>
            <Label style={{ color: '#000' }}>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the partnership opportunity..."
              rows={3}
              style={{ color: '#000' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label style={{ color: '#000' }}>Stage *</Label>
              <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                <SelectTrigger style={{ color: '#000' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outreach">Outreach</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="agreement">Agreement</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={{ color: '#000' }}>Industry</Label>
              <Input
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Tech, Healthcare"
                style={{ color: '#000' }}
              />
            </div>
            <div>
              <Label style={{ color: '#000' }}>Deal Size</Label>
              <Input
                value={formData.deal_size}
                onChange={(e) => setFormData({ ...formData, deal_size: e.target.value })}
                placeholder="e.g., $1M - $5M"
                style={{ color: '#000' }}
              />
            </div>
          </div>

          <div>
            <Label style={{ color: '#000' }}>Start Date</Label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              style={{ color: '#000' }}
            />
          </div>

          <div>
            <Label style={{ color: '#000' }}>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={2}
              style={{ color: '#000' }}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" style={{ background: '#D8A11F', color: '#fff' }}>
              Create Partnership
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}