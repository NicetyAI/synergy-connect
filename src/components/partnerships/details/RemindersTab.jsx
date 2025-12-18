import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Bell, Trash2, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function RemindersTab({ partnership, reminders }) {
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reminder_date: "",
    reminder_type: "custom"
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.PartnershipReminder.create({
        ...data,
        partnership_id: partnership.id,
        recipient_email: user.email,
        reminder_date: new Date(data.reminder_date).toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnershipReminders'] });
      setAdding(false);
      setFormData({ title: "", description: "", reminder_date: "", reminder_type: "custom" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PartnershipReminder.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnershipReminders'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const reminderTypeLabels = {
    contract_renewal: "Contract Renewal",
    milestone_due: "Milestone Due",
    review_scheduled: "Review Scheduled",
    payment_due: "Payment Due",
    custom: "Custom"
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold" style={{ color: '#000' }}>Reminders</h3>
        <Button onClick={() => setAdding(!adding)} style={{ background: '#D8A11F', color: '#fff' }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
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
              placeholder="Reminder title"
              style={{ color: '#000' }}
            />
          </div>
          <div>
            <Label style={{ color: '#000' }}>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Reminder details..."
              rows={2}
              style={{ color: '#000' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label style={{ color: '#000' }}>Reminder Date *</Label>
              <Input
                type="datetime-local"
                required
                value={formData.reminder_date}
                onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
                style={{ color: '#000' }}
              />
            </div>
            <div>
              <Label style={{ color: '#000' }}>Type</Label>
              <Select value={formData.reminder_type} onValueChange={(value) => setFormData({ ...formData, reminder_type: value })}>
                <SelectTrigger style={{ color: '#000' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract_renewal">Contract Renewal</SelectItem>
                  <SelectItem value="milestone_due">Milestone Due</SelectItem>
                  <SelectItem value="review_scheduled">Review Scheduled</SelectItem>
                  <SelectItem value="payment_due">Payment Due</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" style={{ background: '#D8A11F', color: '#fff' }}>
              Add Reminder
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <p style={{ color: '#666' }}>No reminders set. Add one to stay on track.</p>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className="p-4 rounded-lg" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 mt-1" style={{ color: reminder.sent ? '#22C55E' : '#D8A11F' }} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold" style={{ color: '#000' }}>{reminder.title}</h4>
                      {reminder.description && (
                        <p className="text-sm mt-1" style={{ color: '#666' }}>{reminder.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(reminder.id)}
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
                      {reminderTypeLabels[reminder.reminder_type]}
                    </span>
                    <span className="text-xs" style={{ color: '#666' }}>
                      {format(new Date(reminder.reminder_date), 'MMM d, yyyy h:mm a')}
                    </span>
                    {reminder.sent && (
                      <span className="text-xs flex items-center gap-1" style={{ color: '#22C55E' }}>
                        <Check className="w-3 h-3" />
                        Sent
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}