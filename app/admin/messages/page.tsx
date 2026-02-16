// ============================================================
// 2-WAY MESSAGING - HIPAA-Compliant Patient Communications
// Better Conversations Create Stronger Connections
// ============================================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: string;
  status: 'delivered' | 'sent' | 'failed' | 'read';
}

interface Conversation {
  id: string;
  client_id: string;
  client_name: string;
  client_initials: string;
  client_phone: string;
  client_email?: string;
  client_photo?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  messages: Message[];
  client_info?: {
    address?: string;
    birthday?: string;
    emergency_contact?: string;
    emergency_phone?: string;
    last_visit?: string;
    membership?: string;
    membership_savings?: number;
    total_sales?: number;
  };
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [sending, setSending] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showClientInfo, setShowClientInfo] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations list (live)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingList(true);
      try {
        const res = await fetch('/api/sms/conversations');
        const data = await res.json();
        if (cancelled) return;
        const list = (data.conversations || []).map((c: any) => ({
          id: c.id,
          client_id: c.client_id,
          client_name: c.client_name || 'Unknown',
          client_initials: c.client_initials || '?',
          client_phone: c.client_phone || '',
          client_email: c.client_email,
          last_message: c.last_message || '',
          last_message_time: c.last_message_time || new Date().toISOString(),
          unread_count: c.unread_count || 0,
          messages: [],
          client_info: undefined,
        }));
        setConversations(list);
      } catch (e) {
        console.error('Fetch conversations error:', e);
        if (!cancelled) setConversations([]);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // When selecting a conversation, fetch messages (live)
  const loadMessagesFor = useCallback(async (conv: Conversation) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/sms/conversations/${conv.client_id}`);
      const data = await res.json();
      const raw = (data.messages || []) as Array<{ id: string; direction: string; content: string; sent_at: string; status: string }>;
      const messages: Message[] = raw.map((m) => ({
        id: m.id,
        direction: m.direction === 'inbound' ? 'inbound' : 'outbound',
        content: m.content || '',
        timestamp: m.sent_at || new Date().toISOString(),
        status: (m.status === 'delivered' || m.status === 'sent' || m.status === 'received' ? m.status : 'sent') as Message['status'],
      }));
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, messages } : c))
      );
      setSelectedConversation((prev) => (prev?.id === conv.id ? { ...prev, messages } : prev));
    } catch (e) {
      console.error('Fetch messages error:', e);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = !searchQuery || 
      conv.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.client_phone.includes(searchQuery);
    const matchesFilter = filter === 'all' || conv.unread_count > 0;
    return matchesSearch && matchesFilter;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);
  const totalRead = conversations.length - conversations.filter(c => c.unread_count > 0).length;

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Send message (live API)
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      direction: 'outbound',
      content,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? { ...c, messages: [...c.messages, newMsg], last_message: content, last_message_time: newMsg.timestamp }
          : c
      )
    );
    setSelectedConversation((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMsg], last_message: content, last_message_time: newMsg.timestamp } : null
    );

    try {
      const res = await fetch(`/api/sms/conversations/${selectedConversation.client_id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Send failed:', data);
        return;
      }
      if (data.message?.id) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConversation.id
              ? { ...c, messages: c.messages.map((m) => (m.id === newMsg.id ? { ...m, id: data.message.id, status: (data.message.status || 'sent') as Message['status'] } : m)) }
              : c
          )
        );
        setSelectedConversation((prev) =>
          prev
            ? { ...prev, messages: prev.messages.map((m) => (m.id === newMsg.id ? { ...m, id: data.message.id, status: (data.message.status || 'sent') as Message['status'] } : m)) }
            : null
        );
      }
    } catch (e) {
      console.error('Send error:', e);
    } finally {
      setSending(false);
    }
  };

  // Mark as read (API marks read on GET conversation; we clear locally)
  const markAsRead = (convId: string) => {
    setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, unread_count: 0 } : c)));
  };

  const onSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    markAsRead(conv.id);
    loadMessagesFor(conv);
  };

  return (
    <div className="h-[calc(100vh-56px)] flex bg-white">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-black flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-black">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-black">Messages</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-black">Your Number:</span>
              <span className="text-sm font-medium text-black">+1 (331) 717-7545</span>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search By Name"
              className="w-full px-4 py-2 pl-10 bg-white border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">🔍</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-black">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'text-pink-600 border-b-2 border-pink-500' 
                : 'text-black hover:text-black'
            }`}
          >
            Unread ({totalUnread})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              filter === 'unread' 
                ? 'text-pink-600 border-b-2 border-pink-500' 
                : 'text-black hover:text-black'
            }`}
          >
            <span className="text-blue-500">Read ({totalRead})</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="p-6 text-center text-black">Loading conversations…</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-black">
              <p className="font-medium text-black">No conversations yet</p>
              <p className="text-sm mt-1">When clients text your Telnyx number, threads will appear here.</p>
              <p className="text-xs mt-4"><Link href="/admin/sms" className="text-pink-600 hover:underline">SMS Campaigns</Link> for one-time blasts.</p>
            </div>
          ) : (
          <table className="w-full">
            <thead className="bg-white sticky top-0">
              <tr className="text-xs text-black">
                <th className="text-left px-4 py-2 font-medium">Client</th>
                <th className="text-left px-4 py-2 font-medium">Message</th>
                <th className="text-right px-4 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversations.map((conv) => (
                <tr
                  key={conv.id}
                  onClick={() => onSelectConversation(conv)}
                  className={`cursor-pointer border-b border-black hover:bg-white transition-colors ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                  } ${conv.unread_count > 0 ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {conv.client_initials}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${conv.unread_count > 0 ? 'text-black' : 'text-black'}`}>
                          {conv.client_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className={`text-sm truncate max-w-[150px] ${conv.unread_count > 0 ? 'text-black font-medium' : 'text-black'}`}>
                      {conv.last_message}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-xs text-black">{formatTime(conv.last_message_time)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Center - Conversation */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Conversation Header */}
          <div className="px-6 py-4 border-b border-black flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedConversation(null)}
                className="text-blue-500 hover:text-blue-600 font-medium lg:hidden"
              >
                ← Back
              </button>
              <h2 className="font-semibold text-black">{selectedConversation.client_name}</h2>
            </div>
            <button
              onClick={() => setShowClientInfo(!showClientInfo)}
              className="text-blue-500 hover:text-blue-600 font-medium text-sm"
            >
              Patient Info
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loadingMessages ? (
              <div className="flex justify-center py-8 text-black">Loading messages…</div>
            ) : (
            <>
            {/* Group messages by date */}
            {selectedConversation.messages.map((msg, idx) => {
              const showDate = idx === 0 || 
                formatMessageDate(msg.timestamp) !== formatMessageDate(selectedConversation.messages[idx - 1].timestamp);
              
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <span className="px-3 py-1 bg-white rounded-full text-xs text-black">
                        {formatMessageDate(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex items-end gap-3 ${msg.direction === 'outbound' ? 'justify-end' : ''}`}>
                    {msg.direction === 'inbound' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {selectedConversation.client_initials}
                      </div>
                    )}
                    
                    <div className={`max-w-md ${msg.direction === 'outbound' ? 'order-first' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-black">
                          {msg.direction === 'inbound' ? selectedConversation.client_name : 'You'}
                        </span>
                        <span className="text-xs text-black">{formatMessageTime(msg.timestamp)}</span>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.direction === 'outbound' 
                          ? 'bg-blue-500 text-white rounded-br-md' 
                          : 'bg-white text-black rounded-bl-md'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                    
                    {msg.direction === 'outbound' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        <span className="text-white text-sm font-bold">Y</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
            </>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-black">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message...."
                className="flex-1 px-4 py-3 bg-white border border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center max-w-sm px-6">
            <span className="text-6xl">💬</span>
            <h3 className="text-xl font-semibold text-black mt-4">2-Way Messages</h3>
            <p className="text-black mt-2">Click a client’s name in the list on the left to open your text thread with them. You can read and reply here.</p>
            <p className="text-black text-sm mt-4 flex items-center justify-center gap-2">
              <span className="inline-block border border-black rounded px-2 py-1">← Click a name</span>
              <span>to open</span>
            </p>
            <p className="text-black text-xs mt-6">Messages use your Telnyx number. For one-time blasts to many clients, use <Link href="/admin/sms" className="text-pink-600 hover:underline">SMS Campaigns</Link>.</p>
          </div>
        </div>
      )}

      {/* Right Sidebar - Client Info */}
      {selectedConversation && showClientInfo && (
        <div className="w-72 bg-white border-l border-black overflow-y-auto">
          <div className="p-4 border-b border-black">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-black">{selectedConversation.client_name}</h3>
              <Link
                href={`/admin/clients/${selectedConversation.client_id}`}
                className="text-black hover:text-black"
              >
                ↗
              </Link>
            </div>
          </div>

          {/* Client Photo/Avatar */}
          <div className="p-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
              {selectedConversation.client_initials}
            </div>
            <div className="flex items-center gap-2 text-black">
              <span>💬</span>
              <span>-</span>
            </div>
          </div>

          {/* Client Details */}
          <div className="px-4 space-y-4">
            {selectedConversation.client_info?.address && (
              <div className="flex items-start gap-3">
                <span className="text-black">📍</span>
                <div>
                  <p className="text-sm text-black">{selectedConversation.client_info.address}</p>
                </div>
              </div>
            )}

            {selectedConversation.client_info?.birthday && (
              <div className="flex items-center justify-between py-2 border-t border-black">
                <span className="text-sm text-black">Birthday:</span>
                <span className="text-sm text-black">{selectedConversation.client_info.birthday}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-2 border-t border-black">
              <span className="text-sm text-black">Emergency Contact Name:</span>
              <span className="text-sm text-black">-</span>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-black">
              <span className="text-sm text-black">Emergency Contact No:</span>
              <span className="text-sm text-black">-</span>
            </div>

            {selectedConversation.client_info?.last_visit && (
              <div className="flex items-center justify-between py-2 border-t border-black">
                <span className="text-sm text-black">Last Visit:</span>
                <span className="text-sm text-black">{selectedConversation.client_info.last_visit}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-2 border-t border-black">
              <span className="text-sm text-black">Membership Program:</span>
              <span className="text-sm text-black">{selectedConversation.client_info?.membership || 'Not Registered'}</span>
            </div>

            {selectedConversation.client_info?.membership_savings && (
              <div className="flex items-center justify-between py-2 border-t border-black">
                <span className="text-sm text-black">Membership Saving This Year:</span>
                <span className="text-sm text-black">${selectedConversation.client_info.membership_savings}</span>
              </div>
            )}

            {selectedConversation.client_info?.total_sales && (
              <div className="flex items-center justify-between py-2 border-t border-black">
                <span className="text-sm text-black">Total Sales Relationship:</span>
                <span className="text-sm font-semibold text-black">
                  ${selectedConversation.client_info.total_sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 mt-4 space-y-2">
            <Link
              href={`/admin/clients/${selectedConversation.client_id}`}
              className="w-full py-2 px-4 bg-pink-50 text-pink-700 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>👤</span> View Full Profile
            </Link>
            <Link
              href={`/admin/appointments/new?client=${selectedConversation.client_id}`}
              className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>📅</span> Schedule Appointment
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
