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

// Mock conversations data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    client_id: 'c1',
    client_name: 'Lindsey Carter',
    client_initials: 'LC',
    client_phone: '+1 (630) 555-1234',
    client_email: 'lindsey.carter@email.com',
    last_message: "What's the downtime for a Moxi treatment?",
    last_message_time: new Date(Date.now() - 30 * 60000).toISOString(),
    unread_count: 1,
    messages: [
      { id: 'm1', direction: 'inbound', content: "Hi Sarah! Quick question is it normal to have swelling in my chin after getting filler?", timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), status: 'read' },
      { id: 'm2', direction: 'outbound', content: "Hey Lindsey! Yes it is very normal to have some swelling and tenderness, but if it persists more than a few days, please let me know.", timestamp: new Date(Date.now() - 1.5 * 60 * 60000).toISOString(), status: 'delivered' },
      { id: 'm3', direction: 'inbound', content: "Perfect, I'll keep you updated! Is there anything I should do to help?", timestamp: new Date(Date.now() - 1 * 60 * 60000).toISOString(), status: 'read' },
      { id: 'm4', direction: 'outbound', content: "You can take an antihistamine once a day for the swelling and an ibuprofen for the discomfort.", timestamp: new Date(Date.now() - 45 * 60000).toISOString(), status: 'delivered' },
      { id: 'm5', direction: 'inbound', content: "What's the downtime for a Moxi treatment?", timestamp: new Date(Date.now() - 30 * 60000).toISOString(), status: 'read' },
    ],
    client_info: {
      address: '123 Main Street, Ft. Worth, TX 86188',
      birthday: 'August 05, 1990',
      last_visit: 'July 01, 2025',
      membership: 'Not Registered',
      membership_savings: 120,
      total_sales: 66727.85,
    },
  },
  {
    id: '2',
    client_id: 'c2',
    client_name: 'Monica Reyes',
    client_initials: 'MR',
    client_phone: '+1 (312) 555-9876',
    last_message: "Do you carry SkinBetter products in office right now?",
    last_message_time: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
    unread_count: 0,
    messages: [
      { id: 'm1', direction: 'inbound', content: "Do you carry SkinBetter products in office right now?", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(), status: 'read' },
    ],
    client_info: {
      last_visit: 'Sept 01, 2025',
      total_sales: 2450,
    },
  },
  {
    id: '3',
    client_id: 'c3',
    client_name: 'Janelle Thompson',
    client_initials: 'JT',
    client_phone: '+1 (847) 555-4321',
    last_message: "Will I need numbing cream for lip filler, or is it quick?",
    last_message_time: new Date(Date.now() - 4 * 24 * 60 * 60000).toISOString(),
    unread_count: 0,
    messages: [
      { id: 'm1', direction: 'inbound', content: "Will I need numbing cream for lip filler, or is it quick?", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60000).toISOString(), status: 'read' },
      { id: 'm2', direction: 'outbound', content: "We always apply numbing cream before lip filler! You'll be very comfortable. The procedure takes about 20-30 minutes.", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60000 + 30 * 60000).toISOString(), status: 'delivered' },
    ],
    client_info: {
      last_visit: 'Aug 15, 2025',
      total_sales: 1850,
    },
  },
  {
    id: '4',
    client_id: 'c4',
    client_name: 'Chloe Martinez',
    client_initials: 'CM',
    client_phone: '+1 (708) 555-8765',
    last_message: "Can I add a Hydrafacial to my appointment on Friday?",
    last_message_time: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
    unread_count: 0,
    messages: [
      { id: 'm1', direction: 'inbound', content: "Can I add a Hydrafacial to my appointment on Friday?", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(), status: 'read' },
    ],
    client_info: {
      last_visit: 'Aug 10, 2025',
      total_sales: 3200,
    },
  },
  {
    id: '5',
    client_id: 'c5',
    client_name: 'Tara Nguyen',
    client_initials: 'TN',
    client_phone: '+1 (224) 555-2468',
    last_message: "Is it normal to feel a little swelling two days after filler?",
    last_message_time: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(),
    unread_count: 0,
    messages: [
      { id: 'm1', direction: 'inbound', content: "Is it normal to feel a little swelling two days after filler?", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(), status: 'read' },
    ],
    client_info: {
      last_visit: 'Aug 05, 2025',
      total_sales: 4100,
    },
  },
  {
    id: '6',
    client_id: 'c6',
    client_name: 'Brooke Simmons',
    client_initials: 'BS',
    client_phone: '+1 (331) 555-1357',
    last_message: "Hi Brooke, just a reminder to avoid retinol for 3 days before your peel tomorrow.",
    last_message_time: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(),
    unread_count: 0,
    messages: [
      { id: 'm1', direction: 'outbound', content: "Hi Brooke, just a reminder to avoid retinol for 3 days before your peel tomorrow.", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(), status: 'delivered' },
      { id: 'm2', direction: 'inbound', content: "Thank you for the reminder! I stopped using it 4 days ago 😊", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60000 + 2 * 60 * 60000).toISOString(), status: 'read' },
    ],
    client_info: {
      last_visit: 'Aug 01, 2025',
      total_sales: 2875,
    },
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [sending, setSending] = useState(false);
  const [showClientInfo, setShowClientInfo] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setSending(true);
    
    // Add message to conversation
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      direction: 'outbound',
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          last_message: newMessage,
          last_message_time: newMsg.timestamp,
        };
      }
      return conv;
    }));

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMsg],
      last_message: newMessage,
      last_message_time: newMsg.timestamp,
    } : null);

    setNewMessage('');
    
    // In production, send via API
    // await fetch('/api/sms/send', { ... })
    
    setTimeout(() => setSending(false), 500);
  };

  // Mark as read
  const markAsRead = (convId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return { ...conv, unread_count: 0 };
      }
      return conv;
    }));
  };

  return (
    <div className="h-[calc(100vh-56px)] flex bg-gray-50">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Your Number:</span>
              <span className="text-sm font-medium text-gray-700">+1 (331) 717-7545</span>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search By Name"
              className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'text-pink-600 border-b-2 border-pink-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Unread ({totalUnread})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              filter === 'unread' 
                ? 'text-pink-600 border-b-2 border-pink-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-blue-500">Read ({totalRead})</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-xs text-gray-500">
                <th className="text-left px-4 py-2 font-medium">Client</th>
                <th className="text-left px-4 py-2 font-medium">Message</th>
                <th className="text-right px-4 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversations.map((conv) => (
                <tr
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv);
                    markAsRead(conv.id);
                  }}
                  className={`cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                  } ${conv.unread_count > 0 ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {conv.client_initials}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${conv.unread_count > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                          {conv.client_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className={`text-sm truncate max-w-[150px] ${conv.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {conv.last_message}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-xs text-gray-400">{formatTime(conv.last_message_time)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Center - Conversation */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Conversation Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedConversation(null)}
                className="text-blue-500 hover:text-blue-600 font-medium lg:hidden"
              >
                ← Back
              </button>
              <h2 className="font-semibold text-gray-900">{selectedConversation.client_name}</h2>
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
            {/* Group messages by date */}
            {selectedConversation.messages.map((msg, idx) => {
              const showDate = idx === 0 || 
                formatMessageDate(msg.timestamp) !== formatMessageDate(selectedConversation.messages[idx - 1].timestamp);
              
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
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
                        <span className="text-xs text-gray-500">
                          {msg.direction === 'inbound' ? selectedConversation.client_name : 'Sarah Nguyen'}
                        </span>
                        <span className="text-xs text-gray-400">{formatMessageTime(msg.timestamp)}</span>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.direction === 'outbound' 
                          ? 'bg-blue-500 text-white rounded-br-md' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                    
                    {msg.direction === 'outbound' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        <span className="text-white text-sm font-bold">SN</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message...."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <span className="text-6xl">💬</span>
            <h3 className="text-xl font-semibold text-gray-900 mt-4">Select a conversation</h3>
            <p className="text-gray-500 mt-2">Choose a conversation from the list to view messages</p>
          </div>
        </div>
      )}

      {/* Right Sidebar - Client Info */}
      {selectedConversation && showClientInfo && (
        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{selectedConversation.client_name}</h3>
              <Link
                href={`/admin/clients/${selectedConversation.client_id}`}
                className="text-gray-400 hover:text-gray-600"
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
            <div className="flex items-center gap-2 text-gray-500">
              <span>💬</span>
              <span>-</span>
            </div>
          </div>

          {/* Client Details */}
          <div className="px-4 space-y-4">
            {selectedConversation.client_info?.address && (
              <div className="flex items-start gap-3">
                <span className="text-gray-400">📍</span>
                <div>
                  <p className="text-sm text-gray-900">{selectedConversation.client_info.address}</p>
                </div>
              </div>
            )}

            {selectedConversation.client_info?.birthday && (
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Birthday:</span>
                <span className="text-sm text-gray-900">{selectedConversation.client_info.birthday}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">Emergency Contact Name:</span>
              <span className="text-sm text-gray-400">-</span>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">Emergency Contact No:</span>
              <span className="text-sm text-gray-400">-</span>
            </div>

            {selectedConversation.client_info?.last_visit && (
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Last Visit:</span>
                <span className="text-sm text-gray-900">{selectedConversation.client_info.last_visit}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">Membership Program:</span>
              <span className="text-sm text-gray-900">{selectedConversation.client_info?.membership || 'Not Registered'}</span>
            </div>

            {selectedConversation.client_info?.membership_savings && (
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Membership Saving This Year:</span>
                <span className="text-sm text-gray-900">${selectedConversation.client_info.membership_savings}</span>
              </div>
            )}

            {selectedConversation.client_info?.total_sales && (
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Total Sales Relationship:</span>
                <span className="text-sm font-semibold text-gray-900">
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
