import React from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, User, FileText, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PostCard({ post, category, likes, comments, hasLiked, currentUser }) {
  const queryClient = useQueryClient();

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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={handleCardClick}
      className="glass-card glass-card-hover p-6 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)' }}
        >
          <User className="w-6 h-6" style={{ color: '#E5EDFF' }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1" style={{ color: '#E5EDFF' }}>
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#7A8BA6' }}>
                <span className="font-medium">{post.author_name || post.author_email.split('@')[0]}</span>
                <span>in</span>
                <span style={{ color: '#7C3AED' }}>{category?.name || 'General'}</span>
              </div>
            </div>
            <span className="text-sm" style={{ color: '#7A8BA6' }}>
              {formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}
            </span>
          </div>

          <p className="mb-3 line-clamp-2" style={{ color: '#B6C4E0' }}>
            {post.content}
          </p>

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

          <div className="flex items-center gap-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                likeMutation.mutate();
              }}
              variant="ghost"
              className="text-sm gap-2 px-3 py-1 h-auto"
              style={{ color: hasLiked ? '#3B82F6' : '#7A8BA6' }}
            >
              <ThumbsUp className="w-4 h-4" fill={hasLiked ? '#3B82F6' : 'none'} />
              Like ({likes})
            </Button>

            <Button
              variant="ghost"
              className="text-sm gap-2 px-3 py-1 h-auto"
              style={{ color: '#7A8BA6' }}
              onClick={(e) => e.stopPropagation()}
            >
              <MessageSquare className="w-4 h-4" />
              Comments ({comments})
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}