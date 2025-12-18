import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CheckCircle, Circle, Clock, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function MilestonesTab({ partnership, milestones }) {
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium"
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      const milestone = await base44.entities.PartnershipMilestone.create({
        ...data,
        partnership_id: partnership.id,
        assigned_to: user.email
      });
      await base44.entities.PartnershipActivity.create({
        partnership_id: partnership.id,
        activity_type: "milestone_completed",
        title: "Milestone added",
        description: `New milestone: ${data.title}`,
        user_email: user.email,
        user_name: user.full_name
      });
      return milestone;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnershipMilestones'] });
      setAdding(false);
      setFormData({ title: "", description: "", due_date: "", priority: "medium" });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async (milestone) => {
      const user = await base44.auth.me();
      const updated = await base44.entities.PartnershipMilestone.update(milestone.id, {
        completed: !milestone.completed,
        completed_date: !milestone.completed ? new Date().toISOString() : null
      });
      await base44.entities.PartnershipActivity.create({
        partnership_id: partnership.id,
        activity_type: "milestone_completed",
        title: milestone.completed ? "Milestone reopened" : "Milestone completed",
        description: milestone.title,
        user_email: user.email,
        user_name: user.full_name
      });
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnershipMilestones'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PartnershipMilestone.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnershipMilestones'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const priorityColors = {
    low: { bg: '#DBEAFE', text: '#1E40AF' },
    medium: { bg: '#FEF3C7', text: '#92400E' },
    high: { bg: '#FED7AA', text: '#9A3412' },
    critical: { bg: '#FEE2E2', text: '#991B1B' }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold" style={{ color: '#000' }}>Milestones</h3>
        <Button onClick={() => setAdding(!adding)} style={{ background: '#D8A11F', color: '#fff' }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {adding && (
        <form onSubmit={handleSubmit} className="p-4 rounded-lg space-y-4" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
          <div>
            <Label style={{ color: '#000' }}>Title *</Label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Milestone title"
              style={{ color: '#000' }}
            />
          </div>
          <div>
            <Label style={{ color: '#000' }}>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Milestone details..."
              rows={2}
              style={{ color: '#000' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label style={{ color: '#000' }}>Due Date *</Label>
              <Input
                type="date"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                style={{ color: '#000' }}
              />
            </div>
            <div>
              <Label style={{ color: '#000' }}>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger style={{ color: '#000' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" style={{ background: '#D8A11F', color: '#fff' }}>
              Add Milestone
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {milestones.length === 0 ? (
          <p style={{ color: '#666' }}>No milestones yet. Add one to track progress.</p>
        ) : (
          milestones.map((milestone) => {
            const priorityColor = priorityColors[milestone.priority];
            const isOverdue = !milestone.completed && new Date(milestone.due_date) < new Date();
            
            return (
              <div key={milestone.id} className="p-4 rounded-lg" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleMutation.mutate(milestone)}
                    className="mt-1"
                  >
                    {milestone.completed ? (
                      <CheckCircle className="w-5 h-5" style={{ color: '#22C55E' }} />
                    ) : (
                      <Circle className="w-5 h-5" style={{ color: '#9CA3AF' }} />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className={`font-semibold ${milestone.completed ? 'line-through' : ''}`} style={{ color: '#000' }}>
                          {milestone.title}
                        </h4>
                        {milestone.description && (
                          <p className="text-sm mt-1" style={{ color: '#666' }}>{milestone.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(milestone.id)}
                      >
                        <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: priorityColor.bg, color: priorityColor.text }}>
                        {milestone.priority}
                      </span>
                      <div className="flex items-center gap-1 text-xs" style={{ color: isOverdue ? '#EF4444' : '#666' }}>
                        <Clock className="w-3 h-3" />
                        <span>Due: {format(new Date(milestone.due_date), 'MMM d, yyyy')}</span>
                      </div>
                      {milestone.completed && milestone.completed_date && (
                        <span className="text-xs" style={{ color: '#22C55E' }}>
                          ✓ Completed {format(new Date(milestone.completed_date), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}