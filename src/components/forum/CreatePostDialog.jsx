import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MessageSquare } from "lucide-react";

export default function CreatePostDialog({ open, onOpenChange, categories, currentUser }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: "",
  });
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (postData) => base44.entities.ForumPost.create(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
      setFormData({ title: "", content: "", category_id: "" });
      onOpenChange(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    createPostMutation.mutate({
      ...formData,
      author_email: currentUser.email,
      views: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" style={{ background: '#0F2744', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color: '#E5EDFF' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}>
              <MessageSquare className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title" style={{ color: '#B6C4E0' }}>Post Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="glass-input mt-1"
              style={{ color: '#E5EDFF' }}
              placeholder="What would you like to discuss?"
            />
          </div>

          <div>
            <Label htmlFor="category" style={{ color: '#B6C4E0' }}>Category *</Label>
            <Select 
              required 
              value={formData.category_id} 
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger className="glass-input mt-1" style={{ color: '#E5EDFF' }}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content" style={{ color: '#B6C4E0' }}>Content *</Label>
            <Textarea
              id="content"
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="glass-input mt-1 h-40"
              style={{ color: '#E5EDFF' }}
              placeholder="Share your thoughts, insights, or questions..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#B6C4E0', border: '1px solid rgba(255, 255, 255, 0.18)' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', color: '#fff' }}
              disabled={createPostMutation.isPending}
            >
              {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}