import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tag, Edit, Bell, Bookmark } from "lucide-react";

export default function InterestTab({ user, isOwnProfile }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [interests, setInterests] = useState(user.interests || []);
  const [notificationSettings, setNotificationSettings] = useState({
    email: user.notification_email ?? true,
    forum: user.notification_forum ?? true,
    messages: user.notification_messages ?? true,
  });
  const queryClient = useQueryClient();

  const { data: savedNews = [] } = useQuery({
    queryKey: ['savedNews', user.email],
    queryFn: () => base44.entities.SavedNews.filter({ user_email: user.email }),
  });

  const updateInterestsMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowEditDialog(false);
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowSettingsDialog(false);
    },
  });

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSaveInterests = () => {
    updateInterestsMutation.mutate({ interests });
  };

  const handleSaveNotifications = () => {
    updateNotificationsMutation.mutate({
      notification_email: notificationSettings.email,
      notification_forum: notificationSettings.forum,
      notification_messages: notificationSettings.messages,
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Interests Section */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>Interests</h2>
            {isOwnProfile && (
              <Button
                onClick={() => setShowEditDialog(true)}
                variant="ghost"
                size="icon"
                style={{ color: '#3B82F6' }}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>

          {user.interests && user.interests.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {user.interests.map((interest, index) => (
                <div
                  key={index}
                  className="px-4 py-2 rounded-full flex items-center gap-2"
                  style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3B82F6' }}
                >
                  <Tag className="w-4 h-4" />
                  <span>{interest}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#7A8BA6' }}>No interests added yet</p>
          )}
        </div>

        {/* Notification Settings */}
        {isOwnProfile && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>Notification Settings</h2>
              <Button
                onClick={() => setShowSettingsDialog(true)}
                variant="ghost"
                size="icon"
                style={{ color: '#3B82F6' }}
              >
                <Bell className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: '#E5EDFF' }}>Email Notifications</p>
                  <p className="text-sm" style={{ color: '#7A8BA6' }}>Receive email updates</p>
                </div>
                <span style={{ color: user.notification_email ? '#22C55E' : '#7A8BA6' }}>
                  {user.notification_email ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: '#E5EDFF' }}>Forum Notifications</p>
                  <p className="text-sm" style={{ color: '#7A8BA6' }}>Get notified about forum activity</p>
                </div>
                <span style={{ color: user.notification_forum ? '#22C55E' : '#7A8BA6' }}>
                  {user.notification_forum ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: '#E5EDFF' }}>Message Notifications</p>
                  <p className="text-sm" style={{ color: '#7A8BA6' }}>Get notified about new messages</p>
                </div>
                <span style={{ color: user.notification_messages ? '#22C55E' : '#7A8BA6' }}>
                  {user.notification_messages ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Saved News */}
        {isOwnProfile && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bookmark className="w-6 h-6" style={{ color: '#3B82F6' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>Saved News Articles</h2>
            </div>

            {savedNews.length > 0 ? (
              <div className="space-y-4">
                {savedNews.map((article) => (
                  <a
                    key={article.id}
                    href={article.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block glass-card p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex gap-4">
                      {article.article_image && (
                        <img src={article.article_image} alt="" className="w-24 h-24 object-cover rounded-lg" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1" style={{ color: '#E5EDFF' }}>{article.article_title}</h3>
                        <p className="text-sm line-clamp-2 mb-2" style={{ color: '#B6C4E0' }}>{article.article_description}</p>
                        <p className="text-xs" style={{ color: '#7A8BA6' }}>{article.article_source}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: '#7A8BA6' }}>No saved articles yet</p>
            )}
          </div>
        )}
      </div>

      {/* Edit Interests Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent style={{ background: '#0F2744', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#E5EDFF' }}>Edit Interests</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label style={{ color: '#B6C4E0' }}>Add Interest</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                  className="glass-input"
                  style={{ color: '#E5EDFF' }}
                  placeholder="Type and press Enter"
                />
                <Button onClick={handleAddInterest} style={{ background: '#3B82F6', color: '#fff' }}>
                  Add
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <div
                  key={index}
                  className="px-3 py-1 rounded-full flex items-center gap-2"
                  style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}
                >
                  <span>{interest}</span>
                  <button onClick={() => handleRemoveInterest(interest)} className="hover:opacity-70">×</button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowEditDialog(false)} style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#B6C4E0' }}>
              Cancel
            </Button>
            <Button onClick={handleSaveInterests} disabled={updateInterestsMutation.isPending} style={{ background: '#3B82F6', color: '#fff' }}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent style={{ background: '#0F2744', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#E5EDFF' }}>Notification Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: '#E5EDFF' }}>Email Notifications</p>
                <p className="text-sm" style={{ color: '#7A8BA6' }}>Receive email updates</p>
              </div>
              <Switch
                checked={notificationSettings.email}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: '#E5EDFF' }}>Forum Notifications</p>
                <p className="text-sm" style={{ color: '#7A8BA6' }}>Get notified about forum activity</p>
              </div>
              <Switch
                checked={notificationSettings.forum}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, forum: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: '#E5EDFF' }}>Message Notifications</p>
                <p className="text-sm" style={{ color: '#7A8BA6' }}>Get notified about new messages</p>
              </div>
              <Switch
                checked={notificationSettings.messages}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, messages: checked })}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowSettingsDialog(false)} style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#B6C4E0' }}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotifications} disabled={updateNotificationsMutation.isPending} style={{ background: '#3B82F6', color: '#fff' }}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}