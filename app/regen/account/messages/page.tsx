'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRegenAuth } from '@/components/regen/RegenAuthProvider';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

interface Message {
  id: string;
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound';
  read: boolean;
  sender_name?: string;
  created_at: string;
  thread_id?: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function MessagesPage() {
  const { user } = useRegenAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  // Compose form
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const fetchMessages = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/regen/patient/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/regen/patient/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject: subject || 'New Message',
          content: content.trim(),
        }),
      });

      if (res.ok) {
        setSubject('');
        setContent('');
        setShowCompose(false);
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedMessage) return;

    setSending(true);
    try {
      const res = await fetch('/api/regen/patient/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject: `Re: ${selectedMessage.subject}`,
          content: replyContent.trim(),
          thread_id: selectedMessage.thread_id || selectedMessage.id,
        }),
      });

      if (res.ok) {
        setReplyContent('');
        setSelectedMessage(null);
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setSending(false);
    }
  };

  const unreadCount = messages.filter(m => m.direction === 'inbound' && !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: BRAND.cream }}>
            Messages
            {unreadCount > 0 && (
              <span 
                className="px-2 py-1 rounded-full text-sm font-bold"
                style={{ backgroundColor: BRAND.pink, color: 'white' }}
              >
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ color: BRAND.gray }}>Secure messaging with your care team.</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: BRAND.pink, color: 'white' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Message
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-12 rounded-xl text-center" style={{ backgroundColor: BRAND.darkCard }}>
          <div className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full mx-auto" />
        </div>
      )}

      {/* Messages List */}
      {!loading && messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className="w-full text-left rounded-xl p-4 transition-all hover:scale-[1.01]"
              style={{ 
                backgroundColor: BRAND.darkCard,
                border: `1px solid ${msg.direction === 'inbound' && !msg.read ? BRAND.pink : BRAND.teal}30`,
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{ 
                    backgroundColor: msg.direction === 'inbound' ? `${BRAND.teal}20` : `${BRAND.pink}20`,
                    color: msg.direction === 'inbound' ? BRAND.teal : BRAND.pink,
                  }}
                >
                  {msg.direction === 'inbound' ? 'RK' : 'Me'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold truncate" style={{ color: BRAND.cream }}>
                      {msg.direction === 'inbound' ? 'Ryan Kent, FNP-BC' : 'You'}
                    </span>
                    {msg.direction === 'inbound' && !msg.read && (
                      <span 
                        className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{ backgroundColor: BRAND.pink, color: 'white' }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <p className="font-medium truncate mb-1" style={{ color: BRAND.cream }}>
                    {msg.subject}
                  </p>
                  <p className="text-sm truncate" style={{ color: BRAND.gray }}>
                    {msg.content}
                  </p>
                </div>
                <span className="text-xs whitespace-nowrap" style={{ color: BRAND.gray }}>
                  {timeAgo(msg.created_at)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && messages.length === 0 && (
        <div 
          className="p-12 rounded-xl text-center"
          style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
            style={{ backgroundColor: `${BRAND.teal}10` }}
          >
            💬
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>No messages yet</h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: BRAND.gray }}>
            Have a question for your provider? Send them a secure message.
          </p>
          <button
            onClick={() => setShowCompose(true)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Send a Message
          </button>
        </div>
      )}

      {/* Response Time Notice */}
      <div 
        className="p-4 rounded-xl flex items-start gap-3"
        style={{ backgroundColor: `${BRAND.teal}10`, border: `1px solid ${BRAND.teal}30` }}
      >
        <span className="text-xl">ℹ️</span>
        <div>
          <p className="font-medium" style={{ color: BRAND.teal }}>Typical response time: 24-48 hours</p>
          <p className="text-sm" style={{ color: BRAND.gray }}>
            For urgent matters, please call us at (630) 636-6193.
          </p>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div 
            className="w-full max-w-lg rounded-2xl overflow-hidden"
            style={{ backgroundColor: '#111111', border: `1px solid ${BRAND.teal}30` }}
          >
            <div 
              className="p-4 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${BRAND.teal}20` }}
            >
              <h2 className="text-lg font-bold" style={{ color: BRAND.cream }}>New Message</h2>
              <button onClick={() => setShowCompose(false)} className="text-2xl" style={{ color: BRAND.gray }}>×</button>
            </div>
            <form onSubmit={sendMessage} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's this about?"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: BRAND.darkCard, 
                    border: `1px solid ${BRAND.teal}30`,
                    color: BRAND.cream,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>Message</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your message..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none"
                  style={{ 
                    backgroundColor: BRAND.darkCard, 
                    border: `1px solid ${BRAND.teal}30`,
                    color: BRAND.cream,
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="flex-1 px-4 py-3 rounded-lg font-medium"
                  style={{ backgroundColor: BRAND.darkCard, color: BRAND.gray }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || sending}
                  className="flex-1 px-4 py-3 rounded-lg font-semibold disabled:opacity-50"
                  style={{ backgroundColor: BRAND.teal, color: 'white' }}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div 
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl"
            style={{ backgroundColor: '#111111', border: `1px solid ${BRAND.teal}30` }}
          >
            <div 
              className="p-4 flex items-center justify-between sticky top-0"
              style={{ backgroundColor: '#111111', borderBottom: `1px solid ${BRAND.teal}20` }}
            >
              <h2 className="text-lg font-bold" style={{ color: BRAND.cream }}>{selectedMessage.subject}</h2>
              <button onClick={() => setSelectedMessage(null)} className="text-2xl" style={{ color: BRAND.gray }}>×</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ 
                    backgroundColor: selectedMessage.direction === 'inbound' ? `${BRAND.teal}20` : `${BRAND.pink}20`,
                    color: selectedMessage.direction === 'inbound' ? BRAND.teal : BRAND.pink,
                  }}
                >
                  {selectedMessage.direction === 'inbound' ? 'RK' : 'Me'}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: BRAND.cream }}>
                    {selectedMessage.direction === 'inbound' ? 'Ryan Kent, FNP-BC' : 'You'}
                  </p>
                  <p className="text-sm" style={{ color: BRAND.gray }}>{timeAgo(selectedMessage.created_at)}</p>
                </div>
              </div>
              <div 
                className="p-4 rounded-lg whitespace-pre-wrap"
                style={{ backgroundColor: BRAND.darkCard, color: BRAND.cream }}
              >
                {selectedMessage.content}
              </div>
              
              {/* Reply form */}
              <form onSubmit={sendReply} className="space-y-3 pt-4" style={{ borderTop: `1px solid ${BRAND.teal}20` }}>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none"
                  style={{ 
                    backgroundColor: BRAND.darkCard, 
                    border: `1px solid ${BRAND.teal}30`,
                    color: BRAND.cream,
                  }}
                />
                <button
                  type="submit"
                  disabled={!replyContent.trim() || sending}
                  className="w-full px-4 py-3 rounded-lg font-semibold disabled:opacity-50"
                  style={{ backgroundColor: BRAND.teal, color: 'white' }}
                >
                  {sending ? 'Sending...' : 'Send Reply'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
