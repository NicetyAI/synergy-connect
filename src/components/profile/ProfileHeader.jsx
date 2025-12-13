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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {/* Cover Image with Gradient Overlay */}
        <div 
          className="h-80 w-full relative overflow-hidden"
          style={{ 
            background: user.cover_image_url 
              ? `url(${user.cover_image_url})` 
              : 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(10, 22, 40, 0.8) 100%)' }} />
          
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-20" 
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }} />
          <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full opacity-20" 
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }} />
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl mx-auto px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-24">
            {/* Avatar */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div 
                className="w-48 h-48 rounded-3xl flex items-center justify-center border-4 overflow-hidden shadow-2xl"
                style={{ 
                  background: user.avatar_url ? 'transparent' : 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-24 h-24" style={{ color: '#E5EDFF' }} />
                )}
              </div>
              
              {/* Status Badge */}
              <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#fff', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)' }}>
                Active
              </div>
            </motion.div>

            {/* User Info */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 pb-6"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-3" style={{ color: '#E5EDFF', textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
                    {user.full_name || user.email.split('@')[0]}
                  </h1>
                  
                  {user.bio && (
                    <p className="text-lg mb-4 max-w-2xl" style={{ color: '#B6C4E0' }}>
                      {user.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 flex-wrap">
                    {user.title && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(102, 126, 234, 0.15)', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
                        <Briefcase className="w-4 h-4" style={{ color: '#667EEA' }} />
                        <span className="text-sm font-medium" style={{ color: '#E5EDFF' }}>{user.title}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                        <MapPin className="w-4 h-4" style={{ color: '#7C3AED' }} />
                        <span className="text-sm font-medium" style={{ color: '#E5EDFF' }}>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                      <Calendar className="w-4 h-4" style={{ color: '#3B82F6' }} />
                      <span className="text-sm font-medium" style={{ color: '#E5EDFF' }}>Joined {formatDistanceToNow(new Date(user.created_date), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                {isOwnProfile && (
                  <Button
                    onClick={() => setShowEditDialog(true)}
                    className="gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', color: '#fff' }}
                  >
                    <Camera className="w-4 h-4" />
                    Edit Media
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

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