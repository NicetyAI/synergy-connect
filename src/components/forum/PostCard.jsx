import React from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, User, FileText, ExternalLink, Flag, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ModerationMenu from "./ModerationMenu";

export default function PostCard({ post, category, likes, comments, hasLiked, currentUser }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (hasLiked) {
        const userLike = await base44.entities.ForumLike.filter({ 
          post_id: post.id, 
          user_email: currentUser.email 
        });
        if (userLike[0]) {
          await base44.entities.ForumLike.delete(userLike[0].id);
        }
      } else {
        await base44.entities.ForumLike.create({
          post_id: post.id,
          user_email: currentUser.email,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumLikes'] });
    },
  });

  const viewMutation = useMutation({
    mutationFn: () => base44.entities.ForumPost.update(post.id, { 
      views: (post.views || 0) + 1 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
    },
  });

  const handleCardClick = () => {
    viewMutation.mutate();
    navigate(createPageUrl('PostDetail') + `?id=${post.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.005 }}
      onClick={handleCardClick}
      className="p-6 cursor-pointer relative overflow-hidden rounded-xl"
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-start gap-5 relative z-10">
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ 
            background: '#D8A11F',
          }}
        >
          <User className="w-7 h-7" style={{ color: '#fff' }} />
        </div>

        <div className="flex-1 min-w-0 relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold hover:opacity-80 transition-opacity" style={{ color: '#000' }}>
                  {post.title}
                </h3>
                {post.flagged && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
                    <Flag className="w-3 h-3" />
                    <span className="text-xs font-medium">Flagged</span>
                  </div>
                )}
                {post.removed && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-xs font-medium">Removed</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm px-3 py-1 rounded-full" style={{ background: '#F3F4F6', color: '#000' }}>
                  {post.author_name || post.author_email.split('@')[0]}
                </span>
                <span className="text-sm" style={{ color: '#666' }}>in</span>
                <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ background: '#FEF3C7', color: '#92400E' }}>
                  {category?.name || 'General'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm px-3 py-1 rounded-full" style={{ background: '#F3F4F6', color: '#666' }}>
                {formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}
              </span>
              <ModerationMenu post={post} currentUser={currentUser} />
            </div>
          </div>

          {post.removed ? (
            <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p className="font-medium mb-1" style={{ color: '#EF4444' }}>This post has been removed</p>
              {post.removal_reason && (
                <p className="text-sm" style={{ color: '#666' }}>Reason: {post.removal_reason}</p>
              )}
            </div>
          ) : (
            <p className="mb-4 line-clamp-3 leading-relaxed" style={{ color: '#666' }}>
              {post.content}
            </p>
          )}

          {post.link_url && (
            <a
              href={post.link_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 mb-3 px-3 py-2 rounded-lg transition-all hover:opacity-80"
              style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3B82F6' }}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-medium truncate max-w-xs">{post.link_url}</span>
            </a>
          )}

          {post.file_urls && post.file_urls.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.file_urls.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:opacity-80"
                  style={{ background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)', color: '#7C3AED' }}
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Attachment {idx + 1}</span>
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-3 relative z-10" style={{ borderTop: '1px solid #E5E7EB' }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                likeMutation.mutate();
              }}
              className="gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
              style={{ 
                background: hasLiked ? '#D8A11F' : '#F3F4F6', 
                color: hasLiked ? '#fff' : '#000',
                border: '1px solid #E5E7EB'
              }}
            >
              <ThumbsUp className="w-4 h-4" fill={hasLiked ? '#fff' : 'none'} />
              <span className="font-medium">{likes}</span>
            </Button>

            <Button
              className="gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
              style={{ 
                background: '#F3F4F6', 
                color: '#000',
                border: '1px solid #E5E7EB'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">{comments}</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}