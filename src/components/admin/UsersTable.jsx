import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit2, Trash2, User, ChevronLeft, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export default function UsersTable({ users }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => base44.entities.User.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      setUserToDelete(null);
    },
  });

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(search) ||
      user.business_name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phone_number?.toLowerCase().includes(search) ||
      user.state?.toLowerCase().includes(search) ||
      user.country?.toLowerCase().includes(search) ||
      user.address?.toLowerCase().includes(search) ||
      user.first_name?.toLowerCase().includes(search) ||
      user.last_name?.toLowerCase().includes(search)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>Users</h2>
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#7A8BA6' }} />
            <Input
              placeholder="Search by username, business name, email, phone number, state, country, address..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 glass-input"
              style={{ color: '#E5EDFF' }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>Photo</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>Username</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>Business Name</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>First Name</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>Last Name</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>Email</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>Phone Number</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>Country</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>State</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>Address</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>Biography</th>
                <th className="text-left py-4 px-3 text-sm font-semibold" style={{ color: '#B6C4E0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-white/5 transition-colors"
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <td className="py-4 px-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' }}>
                      <User className="w-5 h-5" style={{ color: '#fff' }} />
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm font-medium" style={{ color: '#E5EDFF' }}>
                    {user.username || 'N/A'}
                  </td>
                  <td className="py-4 px-3 text-sm" style={{ color: '#B6C4E0' }}>
                    {user.business_name || 'N/A'}
                  </td>
                  <td className="py-4 px-3 text-sm" style={{ color: '#B6C4E0' }}>
                    {user.first_name || 'N/A'}
                  </td>
                  <td className="py-4 px-3 text-sm" style={{ color: '#B6C4E0' }}>
                    {user.last_name || 'N/A'}
                  </td>
                  <td className="py-4 px-3 text-sm" style={{ color: '#B6C4E0' }}>
                    {user.email}
                  </td>
                  <td className="py-4 px-3 text-sm" style={{ color: '#B6C4E0' }}>
                    {user.phone_number || 'N/A'}
                  </td>
                  <td className="py-4 px-3 text-sm" style={{ color: '#B6C4E0' }}>
                    {user.country || 'N/A'}
                  </td>
                  <td className="py-4 px-3 text-sm" style={{ color: '#B6C4E0' }}>
                    {user.state || 'N/A'}
                  </td>
                  <td className="py-4 px-3 text-sm max-w-xs truncate" style={{ color: '#B6C4E0' }}>
                    {user.address || 'N/A'}
                  </td>
                  <td className="py-4 px-3 text-sm max-w-xs truncate" style={{ color: '#B6C4E0' }}>
                    {user.overview || 'N/A'}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-blue-500/20"
                        style={{ color: '#3B82F6' }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-red-500/20"
                        style={{ color: '#EF4444' }}
                        onClick={() => setUserToDelete(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p className="text-sm" style={{ color: '#7A8BA6' }}>
            Page {currentPage} of {totalPages} ({filteredUsers.length} users)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="glass-input"
              style={{ color: '#E5EDFF' }}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="glass-input"
              style={{ color: '#E5EDFF' }}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent style={{
          background: 'rgba(15, 39, 68, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#E5EDFF'
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#E5EDFF' }}>Delete User</AlertDialogTitle>
            <AlertDialogDescription style={{ color: '#B6C4E0' }}>
              Are you sure you want to delete {userToDelete?.email}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="glass-input"
              style={{ color: '#E5EDFF' }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserMutation.mutate(userToDelete.id)}
              disabled={deleteUserMutation.isPending}
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#fff' }}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}