import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, UserPlus, Search, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddMemberDialog({ open, onOpenChange, group }) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ['searchMembersForGroup'],
    queryFn: async () => {
      const response = await base44.functions.invoke('searchMembers', {});
      return response.data?.members || [];
    },
    enabled: open,
  });

  const addMemberMutation = useMutation({
    mutationFn: async (email) => {
      const updatedMembers = [...group.members, email];
      await base44.entities.GroupChat.update(group.id, { members: updatedMembers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-chats'] });
    },
  });

  const availableUsers = allUsers.filter(
    (u) => !group.members.includes(u.email) && 
           (u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
            u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ background: '#F2F1F5', border: '1px solid #000' }} className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle style={{ color: '#000' }}>Add Members</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#666' }} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-10"
            style={{ color: '#000', background: '#fff', border: '1px solid #000' }}
          />
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#D8A11F' }} />
            </div>
          ) : availableUsers.length > 0 ? (
            availableUsers.map((user) => (
              <div
                key={user.email}
                className="flex items-center gap-3 p-2 rounded-lg"
                style={{ background: '#fff' }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#D8A11F' }}>
                  <User className="w-4 h-4" style={{ color: '#fff' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#000' }}>{user.full_name}</p>
                  <p className="text-xs truncate" style={{ color: '#666' }}>{user.email}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => addMemberMutation.mutate(user.email)}
                  disabled={addMemberMutation.isPending}
                  className="rounded-lg gap-1 text-xs"
                  style={{ background: '#D8A11F', color: '#fff' }}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-center py-4" style={{ color: '#666' }}>
              {search ? 'No matching users found.' : 'No more users to add.'}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}