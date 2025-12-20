import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProfessionManagementTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", slug: "" });
  
  const queryClient = useQueryClient();

  // Fetch professions
  const { data: professions = [], isLoading } = useQuery({
    queryKey: ['professions'],
    queryFn: () => base44.entities.Profession.list(),
  });

  // Create profession
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Profession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professions'] });
      setIsCreateOpen(false);
      setFormData({ name: "", description: "", slug: "" });
    },
  });

  // Update profession
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Profession.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professions'] });
      setIsEditOpen(false);
      setSelectedProfession(null);
    },
  });

  // Delete profession
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Profession.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professions'] });
      setIsDeleteOpen(false);
      setSelectedProfession(null);
    },
  });

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleEdit = (profession) => {
    setSelectedProfession(profession);
    setFormData({
      name: profession.name,
      description: profession.description || "",
      slug: profession.slug
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    updateMutation.mutate({
      id: selectedProfession.id,
      data: formData
    });
  };

  const handleDelete = (profession) => {
    setSelectedProfession(profession);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedProfession.id);
  };

  // Auto-generate slug from name
  const handleNameChange = (name) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl text-center" style={{ background: '#fff', border: '2px solid #000' }}>
        <p style={{ color: '#666' }}>Loading professions...</p>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl"
        style={{ background: '#fff', border: '2px solid #000' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#000' }}>Professions</h2>
          <Button
            onClick={() => setIsCreateOpen(true)}
            style={{ background: '#3B82F6', color: '#fff' }}
            className="flex items-center gap-2"
          >
            Create New Profession
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '2px solid #000' }}>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#000' }}>Name</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#000' }}>Description</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#000' }}>Slug</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#000' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {professions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8" style={{ color: '#666' }}>
                    No professions found. Create one to get started.
                  </td>
                </tr>
              ) : (
                professions.map((profession, index) => (
                  <motion.tr
                    key={profession.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-gray-50 transition-colors"
                    style={{ borderBottom: '1px solid #ddd' }}
                  >
                    <td className="py-4 px-3 text-sm font-medium" style={{ color: '#000' }}>
                      {profession.name}
                    </td>
                    <td className="py-4 px-3 text-sm" style={{ color: '#666' }}>
                      {profession.description || 'N/A'}
                    </td>
                    <td className="py-4 px-3 text-sm" style={{ color: '#000' }}>
                      {profession.slug}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          style={{ background: '#3B82F6', color: '#fff' }}
                          onClick={() => handleEdit(profession)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          style={{ background: '#EF4444', color: '#fff' }}
                          onClick={() => handleDelete(profession)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent style={{
          background: '#fff',
          border: '2px solid #000',
          color: '#000'
        }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#000' }}>Create New Profession</DialogTitle>
            <DialogDescription style={{ color: '#666' }}>
              Add a new profession to the platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#000' }}>Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Mortgage Broker"
                style={{ border: '1px solid #000', color: '#000' }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#000' }}>Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description (optional)"
                style={{ border: '1px solid #000', color: '#000' }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#000' }}>Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated from name"
                style={{ border: '1px solid #000', color: '#000' }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              style={{ border: '1px solid #000', color: '#000' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending || !formData.name || !formData.slug}
              style={{ background: '#3B82F6', color: '#fff' }}
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent style={{
          background: '#fff',
          border: '2px solid #000',
          color: '#000'
        }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#000' }}>Edit Profession</DialogTitle>
            <DialogDescription style={{ color: '#666' }}>
              Update profession details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#000' }}>Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ border: '1px solid #000', color: '#000' }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#000' }}>Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ border: '1px solid #000', color: '#000' }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#000' }}>Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                style={{ border: '1px solid #000', color: '#000' }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              style={{ border: '1px solid #000', color: '#000' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              style={{ background: '#3B82F6', color: '#fff' }}
            >
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent style={{
          background: '#fff',
          border: '2px solid #000',
          color: '#000'
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#000' }}>Delete Profession</AlertDialogTitle>
            <AlertDialogDescription style={{ color: '#666' }}>
              Are you sure you want to delete "{selectedProfession?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{ border: '1px solid #000', color: '#000' }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              style={{ background: '#EF4444', color: '#fff' }}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}