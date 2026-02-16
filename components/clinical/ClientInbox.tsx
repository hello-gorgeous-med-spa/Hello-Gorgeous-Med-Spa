'use client';

// ============================================================
// CLIENT INBOX COMPONENT
// 2-Way SMS messaging directly from client profile
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  sent_by_name?: string;
  status: string;
  sent_at: string;
}

interface ClientInboxProps {
  clientId: string;
  clientName: string;
  clientPhone?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export function ClientInbox({ 
  clientId, 
  clientName, 
  clientPhone,
  onClose,
  isModal = false 
}: ClientInboxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/sms/conversations/${clientId}`);
      const data = await res.json();
      
      if (data.messages) {
        setMessages(data.messages);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchMessages();
    
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      direction: 'outbound',
      content: messageContent,
      sent_by_name: 'You',
      status: 'pending',
      sent_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const res = await fetch(`/api/sms/conversations/${clientId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send');
      }

      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(m => m.id === tempId ? { ...data.message, sent_by_name: 'You' } : m)
      );
    } catch (err: any) {
      // Mark as failed
      setMessages(prev => 
        prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m)
      );
      setError(err.message);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick replies
  const quickReplies = [
    "Thanks for reaching out! How can I help?",
    "Your appointment is confirmed.",
    "We'll see you soon!",
    "Please call us at (555) 123-4567 if you need immediate assistance.",
  ];

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const containerClass = isModal 
    ? "flex flex-col h-full" 
    : "flex flex-col h-[500px] bg-white rounded-xl border border-black overflow-hidden";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
            <span className="text-pink-600 font-semibold text-sm">
              {clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-black text-sm">{clientName}</h3>
            {clientPhone && (
              <p className="text-xs text-black">{clientPhone}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMessages}
            className="p-2 text-black hover:text-black hover:bg-white rounded-lg transition-colors"
            title="Refresh"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-black hover:text-black hover:bg-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="text-4xl mb-3">💬</span>
            <p className="text-black text-sm">No messages yet</p>
            <p className="text-black text-xs mt-1">Start a conversation with {clientName}</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    message.direction === 'outbound'
                      ? 'bg-pink-500 text-white rounded-br-md'
                      : 'bg-white text-black border border-black rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${
                    message.direction === 'outbound' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className={`text-[10px] ${
                      message.direction === 'outbound' ? 'text-pink-200' : 'text-black'
                    }`}>
                      {formatTime(message.sent_at)}
                    </span>
                    {message.direction === 'outbound' && (
                      <span className={`text-[10px] ${
                        message.status === 'delivered' ? 'text-pink-200' :
                        message.status === 'failed' ? 'text-red-300' :
                        'text-pink-300'
                      }`}>
                        {message.status === 'delivered' ? '✓✓' :
                         message.status === 'sent' ? '✓' :
                         message.status === 'failed' ? '!' :
                         '○'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Replies */}
      {messages.length === 0 && !loading && (
        <div className="px-4 py-2 border-t border-black bg-white">
          <p className="text-xs text-black mb-2">Quick replies:</p>
          <div className="flex flex-wrap gap-1">
            {quickReplies.slice(0, 3).map((reply, i) => (
              <button
                key={i}
                onClick={() => setNewMessage(reply)}
                className="text-xs px-2 py-1 bg-white text-black rounded-full hover:bg-white transition-colors truncate max-w-[150px]"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-black bg-white">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-black rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '100px' }}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-[10px] text-black mt-1 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default ClientInbox;
