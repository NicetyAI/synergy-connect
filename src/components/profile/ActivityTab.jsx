import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MessageSquare, FileText, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ActivityTab({ userEmail }) {
  const { data: posts = [] } = useQuery({
    queryKey: ['userForumPosts', userEmail],
    queryFn: async () => {
      const allPosts = await base44.entities.ForumPost.list();
      return allPosts.filter(p => p.author_email === userEmail);
    },
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['userForumComments', userEmail],
    queryFn: async () => {
      const allComments = await base44.entities.ForumComment.list();
      return allComments.filter(c => c.author_email === userEmail);
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['forumCategories'],
    queryFn: () => base44.entities.ForumCategory.list(),
  });

  return (
    <div className="space-y-6">
      {/* Forum Posts */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6" style={{ color: '#3B82F6' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>
            Forum Posts ({posts.length})
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => {
              const category = categories.find(c => c.id === post.category_id);
              return (
                <Link key={post.id} to={createPageUrl('PostDetail') + `?id=${post.id}`}>
                  <div className="glass-card glass-card-hover p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 mt-1" style={{ color: '#3B82F6' }} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1" style={{ color: '#E5EDFF' }}>{post.title}</h3>
                        <p className="text-sm line-clamp-2 mb-2" style={{ color: '#B6C4E0' }}>{post.content}</p>
                        <div className="flex items-center gap-3 text-xs" style={{ color: '#7A8BA6' }}>
                          <span>{category?.name || 'General'}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</span>
                          <span>•</span>
                          <span>{post.views || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p style={{ color: '#7A8BA6' }}>No posts yet</p>
          </div>
        )}
      </div>

      {/* Forum Comments */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6" style={{ color: '#7C3AED' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>
            Forum Comments ({comments.length})
          </h2>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="glass-card p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 mt-1" style={{ color: '#7C3AED' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm mb-2" style={{ color: '#B6C4E0' }}>{comment.content}</p>
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#7A8BA6' }}>
                      <span>{formatDistanceToNow(new Date(comment.created_date), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p style={{ color: '#7A8BA6' }}>No comments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}