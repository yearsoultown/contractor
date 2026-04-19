'use client';

import { useState, useEffect } from 'react';
import { X, Check, Trash2, Reply, MessageSquare } from 'lucide-react';
import api from '@/lib/api';

interface CommentReply {
  id: string;
  user_name: string;
  body: string;
  created_at: string;
}

interface Comment {
  id: string;
  user_name: string;
  anchor_text: string;
  body: string;
  is_resolved: boolean;
  replies: CommentReply[];
  created_at: string;
}

interface CommentsSidebarProps {
  docId: string;
  open: boolean;
  onClose: () => void;
}

export default function CommentsSidebar({ docId, open, onClose }: CommentsSidebarProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    if (!open || !docId) return;
    setLoading(true);
    api.get(`/documents/${docId}/comments`)
      .then(res => setComments(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, docId]);

  const handleResolve = async (id: string) => {
    try {
      await api.patch(`/comments/${id}/resolve`);
      setComments(prev => prev.map(c =>
        c.id === id ? { ...c, is_resolved: true } : c
      ));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch {}
  };

  const handleReply = async (threadId: string) => {
    if (!replyBody.trim()) return;
    try {
      const res = await api.post(`/documents/${docId}/comments`, {
        thread_id: threadId,
        body: replyBody.trim(),
      });
      setComments(prev => prev.map(c =>
        c.id === threadId
          ? { ...c, replies: [...(c.replies || []), res.data] }
          : c
      ));
      setReplyBody('');
      setReplyingTo(null);
    } catch {}
  };

  if (!open) return null;

  const visible = showResolved ? comments : comments.filter(c => !c.is_resolved);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Comments</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {comments.filter(c => !c.is_resolved).length}
          </span>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Filter */}
      <div className="px-4 py-2 border-b border-gray-100">
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {showResolved ? 'Hide resolved' : 'Show resolved'}
        </button>
      </div>

      {/* Comment list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No comments yet</p>
          </div>
        ) : (
          visible.map(comment => (
            <div key={comment.id} className={`rounded-xl border p-3 space-y-2 ${comment.is_resolved ? 'opacity-60 border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'}`}>
              {/* Quoted text */}
              {comment.anchor_text && (
                <div className="text-xs bg-yellow-50 border-l-2 border-yellow-400 pl-2 py-1 rounded-sm text-gray-600 italic">
                  "{comment.anchor_text}"
                </div>
              )}

              {/* Comment body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">{comment.user_name || 'Anonymous'}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.body}</p>
              </div>

              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div className="ml-3 space-y-2 border-l-2 border-gray-100 pl-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">{reply.user_name || 'Anonymous'}</span>
                        <span className="text-xs text-gray-400">{new Date(reply.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{reply.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply input */}
              {replyingTo === comment.id && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(comment.id)}
                    placeholder="Reply..."
                    className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Send
                  </button>
                </div>
              )}

              {/* Actions */}
              {!comment.is_resolved && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <Reply className="w-3 h-3" /> Reply
                  </button>
                  <button
                    onClick={() => handleResolve(comment.id)}
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700"
                  >
                    <Check className="w-3 h-3" /> Resolve
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}