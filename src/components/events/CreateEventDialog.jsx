import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function CreateEventDialog({ open, onOpenChange, currentUser }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Networking",
    location: "",
    is_virtual: false,
    virtual_link: "",
    date: "",
    time: "",
    end_time: "",
    image_url: "",
    max_attendees: ""
  });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: (data) => base44.entities.Event.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        category: "Networking",
        location: "",
        is_virtual: false,
        virtual_link: "",
        date: "",
        time: "",
        end_time: "",
        image_url: "",
        max_attendees: ""
      });
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.date || !formData.time) return;
    
    createEventMutation.mutate({
      ...formData,
      organizer_email: currentUser.email,
      organizer_name: currentUser.full_name,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
      status: 'upcoming'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ background: '#0F2744', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ color: '#E5EDFF' }}>Create Event</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label style={{ color: '#B6C4E0' }}>Event Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Tech Networking Mixer"
              className="glass-input mt-2"
              style={{ color: '#E5EDFF' }}
            />
          </div>

          <div>
            <Label style={{ color: '#B6C4E0' }}>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your event..."
              className="glass-input mt-2"
              style={{ color: '#E5EDFF' }}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label style={{ color: '#B6C4E0' }}>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="glass-input mt-2" style={{ color: '#E5EDFF' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Conference">Conference</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Meetup">Meetup</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label style={{ color: '#B6C4E0' }}>Max Attendees</Label>
              <Input
                type="number"
                value={formData.max_attendees}
                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                placeholder="Optional"
                className="glass-input mt-2"
                style={{ color: '#E5EDFF' }}
              />
            </div>
          </div>

          <div>
            <Label style={{ color: '#B6C4E0' }}>Event Type</Label>
            <div className="flex gap-4 mt-2">
              <Button
                type="button"
                onClick={() => setFormData({ ...formData, is_virtual: false })}
                className="flex-1"
                style={!formData.is_virtual ? 
                  { background: '#667EEA', color: '#fff' } : 
                  { background: 'rgba(255, 255, 255, 0.1)', color: '#B6C4E0' }
                }
              >
                In-Person
              </Button>
              <Button
                type="button"
                onClick={() => setFormData({ ...formData, is_virtual: true })}
                className="flex-1"
                style={formData.is_virtual ? 
                  { background: '#667EEA', color: '#fff' } : 
                  { background: 'rgba(255, 255, 255, 0.1)', color: '#B6C4E0' }
                }
              >
                Virtual
              </Button>
            </div>
          </div>

          {formData.is_virtual ? (
            <div>
              <Label style={{ color: '#B6C4E0' }}>Virtual Link</Label>
              <Input
                value={formData.virtual_link}
                onChange={(e) => setFormData({ ...formData, virtual_link: e.target.value })}
                placeholder="https://zoom.us/..."
                className="glass-input mt-2"
                style={{ color: '#E5EDFF' }}
              />
            </div>
          ) : (
            <div>
              <Label style={{ color: '#B6C4E0' }}>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter venue address"
                className="glass-input mt-2"
                style={{ color: '#E5EDFF' }}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label style={{ color: '#B6C4E0' }}>Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="glass-input mt-2"
                style={{ color: '#E5EDFF' }}
              />
            </div>
            <div>
              <Label style={{ color: '#B6C4E0' }}>Start Time *</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="glass-input mt-2"
                style={{ color: '#E5EDFF' }}
              />
            </div>
            <div>
              <Label style={{ color: '#B6C4E0' }}>End Time</Label>
              <Input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="glass-input mt-2"
                style={{ color: '#E5EDFF' }}
              />
            </div>
          </div>

          <div>
            <Label style={{ color: '#B6C4E0' }}>Event Image</Label>
            <div className="mt-2">
              <label 
                htmlFor="event-image"
                className="flex items-center justify-center gap-3 p-6 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                style={{ 
                  background: 'rgba(102, 126, 234, 0.1)', 
                  border: '2px dashed rgba(102, 126, 234, 0.3)',
                  color: '#B6C4E0'
                }}
              >
                <Upload className="w-5 h-5" style={{ color: '#667EEA' }} />
                <span className="font-medium">
                  {uploading ? 'Uploading...' : formData.image_url ? 'Image uploaded ✓' : 'Upload event image'}
                </span>
              </label>
              <input
                id="event-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#B6C4E0' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !formData.date || !formData.time || createEventMutation.isPending}
            style={{ background: '#667EEA', color: '#fff' }}
          >
            {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}