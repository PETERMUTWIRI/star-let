'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaPaperPlane } from 'react-icons/fa';

interface Comment {
  id: number;
  content: string;
  author: string | null;
  createdAt: string;
}

interface CommentSectionProps {
  postId?: string;
  videoId?: string;
  musicId?: string;
}

export default function CommentSection({ postId, videoId, musicId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId, videoId, musicId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (postId) params.append('postId', postId.toString());
      if (videoId) params.append('videoId', videoId.toString());
      if (musicId) params.append('musicId', musicId.toString());

      const response = await fetch(`/api/comments?${params}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          author: author.trim() || null,
          email: email.trim() || null,
          postId,
          videoId,
          musicId,
        }),
      });

      if (response.ok) {
        setNewComment('');
        setAuthor('');
        setEmail('');
        fetchComments(); // Refresh comments
      } else {
        console.error('Error posting comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <h3 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div className="relative">
          <textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none resize-none"
            required
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="absolute bottom-3 right-3 p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaPaperPlane className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center text-slate-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-slate-400">No comments yet. Be the first to share your thoughts!</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white">
                    {comment.author || 'Anonymous'}
                  </span>
                  <span className="text-sm text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}