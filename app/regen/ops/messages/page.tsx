'use client';

import { useState } from 'react';

interface Message {
  id: string;
  patient: { name: string; email: string };
  preview: string;
  unread: boolean;
  time: string;
}

const SAMPLE_MESSAGES: Message[] = [
  { id: 'MSG-001', patient: { name: 'Sarah Mitchell', email: 'sarah.m@email.com' }, preview: 'When will my order ship? I placed it 3 days ago...', unread: true, time: '10 min ago' },
  { id: 'MSG-002', patient: { name: 'Michael Rodriguez', email: 'mrodriguez@email.com' }, preview: 'Can I get a refill on my Tirzepatide?', unread: true, time: '2 hours ago' },
  { id: 'MSG-003', patient: { name: 'Jennifer Lee', email: 'jlee@email.com' }, preview: 'Thank you for the quick response!', unread: false, time: '1 day ago' },
  { id: 'MSG-004', patient: { name: 'David Kim', email: 'dkim@email.com' }, preview: 'I have a question about the dosing instructions...', unread: false, time: '2 days ago' },
];

export default function MessagesPage() {
  const [messages] = useState(SAMPLE_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState('');

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-white/50">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedMessage?.id === msg.id
                  ? 'bg-teal-500/20 border border-teal-500/30'
                  : msg.unread
                  ? 'bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {msg.patient.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${msg.unread ? 'text-white' : 'text-white/70'}`}>
                      {msg.patient.name}
                    </p>
                    <span className="text-white/40 text-xs">{msg.time}</span>
                  </div>
                  <p className="text-white/50 text-sm truncate">{msg.preview}</p>
                </div>
                {msg.unread && (
                  <div className="w-2 h-2 bg-pink-500 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message View */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white/5 rounded-2xl border border-white/10 h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {selectedMessage.patient.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{selectedMessage.patient.name}</p>
                    <p className="text-white/50 text-sm">{selectedMessage.patient.email}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 min-h-[300px]">
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 bg-white/10 rounded-2xl rounded-tl-none">
                    <p className="text-white">{selectedMessage.preview}</p>
                    <p className="text-white/40 text-xs mt-2">{selectedMessage.time}</p>
                  </div>
                </div>
              </div>

              {/* Reply */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-400 hover:to-teal-500 transition-all">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl border border-white/10 h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-6xl mb-4">💬</p>
                <p className="text-white/50">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
