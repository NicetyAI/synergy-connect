import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Camera, Mail, MapPin, Calendar, Briefcase } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ProfileHeader({ user, isOwnProfile, currentUser }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleMediaUpload = async () => {
    if (!coverFile && !avatarFile) return;
    
    setUploading(true);
    try {
      const updates = {};
      
      if (coverFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: coverFile });
        updates.cover_image_url = file_url;
      }
      
      if (avatarFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: avatarFile });
        updates.avatar_url = file_url;
      }

      await base44.auth.updateMe(updates);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowEditDialog(false);
      setCoverFile(null);
      setAvatarFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="relative">
        {/* Cover Image */}
        <div 
          className="h-64 w-full relative overflow-hidden"
          style={{ 
            background: user.cover_image_url 
              ? `url(${user.cover_image_url})` 
              : 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl mx-auto px-8 relative">
          <div className="flex items-end gap-6 -mt-20">
            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-40 h-40 rounded-full flex items-center justify-center border-4 overflow-hidden"
                style={{ 
                  background: user.avatar_url ? 'transparent' : 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.18)'
                }}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-20 h-20" style={{ color: '#E5EDFF' }} />
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: '#E5EDFF' }}>
                    {user.full_name}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap text-sm" style={{ color: '#B6C4E0' }}>
                    {user.title && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{user.title}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDistanceToNow(new Date(user.created_date), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                {isOwnProfile && (
                  <Button
                    onClick={() => setShowEditDialog(true)}
                    className="gap-2"
                    style={{ background: '#3B82F6', color: '#fff' }}
                  >
                    <Camera className="w-4 h-4" />
                    Edit Media
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Media Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent style={{ background: '#0F2744', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#E5EDFF' }}>Edit Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label style={{ color: '#B6C4E0' }}>Cover Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0])}
                className="glass-input mt-2"
              />
            </div>
            <div>
              <Label style={{ color: '#B6C4E0' }}>Profile Picture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0])}
                className="glass-input mt-2"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowEditDialog(false)}
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#B6C4E0' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMediaUpload}
              disabled={uploading || (!coverFile && !avatarFile)}
              style={{ background: '#3B82F6', color: '#fff' }}
            >
              {uploading ? 'Uploading...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}