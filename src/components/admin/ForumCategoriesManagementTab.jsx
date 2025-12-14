import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, MessageSquare, Sparkles, TrendingUp, Users, Briefcase, Building2, Lightbulb, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Icon mapping for forum categories
const ICON_MAP = {
  'MessageSquare': MessageSquare,
  'Sparkles': Sparkles,
  'TrendingUp': TrendingUp,
  'Users': Users,
  'Briefcase': Briefcase,
  'Building2': Building2,
  'Lightbulb': Lightbulb,
  'Zap': Zap,
};

const AVAILABLE_ICONS = [
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Users', icon: Users },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Building2', icon: Building2 },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Zap', icon: Zap },
];

export default function ForumCategoriesManagementTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "MessageSquare"
  });

  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['forumCategories'],
    queryFn: () => base44.asServiceRole.entities.ForumCategory.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.asServiceRole.entities.ForumCategory.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumCategories'] });
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "", icon: "MessageSquare" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.asServiceRole.entities.ForumCategory.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumCategories'] });
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      setFormData({ name: "", description: "", icon: "MessageSquare" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.asServiceRole.entities.ForumCategory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumCategories'] });
    },
  });

  const handleCreate = () => {
    if (!formData.name) return;
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!formData.name || !selectedCategory) return;
    updateMutation.mutate({ id: selectedCategory.id, data: formData });
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      icon: category.icon || "MessageSquare"
    });
    setIsEditDialogOpen(true);
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center">
        <p style={{ color: '#7A8BA6' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #7C3AED 0%, #3B82F6 100%)' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>
            Forum Categories
          </h2>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)', color: '#E5EDFF' }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Category
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 rounded-2xl"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A8BA6' }} />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-input"
            style={{ color: '#E5EDFF' }}
          />
        </div>
      </motion.div>

      {/* Categories Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#B6C4E0' }}>
                  Icon
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#B6C4E0' }}>
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#B6C4E0' }}>
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#B6C4E0' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center" style={{ color: '#7A8BA6' }}>
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => {
                  const IconComponent = ICON_MAP[category.icon] || MessageSquare;
                  return (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                          <IconComponent className="w-5 h-5" style={{ color: '#3B82F6' }} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium" style={{ color: '#E5EDFF' }}>
                          {category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm" style={{ color: '#B6C4E0' }}>
                          {category.description || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(category)}
                            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)', color: '#E5EDFF' }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => deleteMutation.mutate(category.id)}
                            style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#fff' }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent 
          className="border-0 sm:max-w-md" 
          style={{ 
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#E5EDFF' 
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg" style={{ color: '#E5EDFF' }}>Create New Forum Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#B6C4E0' }}>
                Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => setFormData({ ...formData, icon: name })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.icon === name
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto" style={{ color: formData.icon === name ? '#3B82F6' : '#B6C4E0' }} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#B6C4E0' }}>
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
                className="glass-input"
                style={{ color: '#E5EDFF' }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#B6C4E0' }}>
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description"
                rows={4}
                className="glass-input resize-none"
                style={{ color: '#E5EDFF' }}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => setIsCreateDialogOpen(false)}
              variant="outline"
              className="glass-input"
              style={{ color: '#B6C4E0' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)', color: '#E5EDFF' }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent 
          className="border-0 sm:max-w-md" 
          style={{ 
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#E5EDFF' 
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg" style={{ color: '#E5EDFF' }}>Edit Forum Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#B6C4E0' }}>
                Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => setFormData({ ...formData, icon: name })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.icon === name
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto" style={{ color: formData.icon === name ? '#3B82F6' : '#B6C4E0' }} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#B6C4E0' }}>
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
                className="glass-input"
                style={{ color: '#E5EDFF' }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#B6C4E0' }}>
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description"
                rows={4}
                className="glass-input resize-none"
                style={{ color: '#E5EDFF' }}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => setIsEditDialogOpen(false)}
              variant="outline"
              className="glass-input"
              style={{ color: '#B6C4E0' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)', color: '#E5EDFF' }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}