'use client';

// ============================================================
// PROVIDER MESSAGES PAGE
// Secure messaging with patients
// ============================================================

import { useState } from 'react';

const CONVERSATIONS = [
  {
    id: '1',
    clientName: 'Jennifer Martinez',
    lastMessage: 'Thank you! The results look amazing.',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: '2',
    clientName: 'Sarah Johnson',
    lastMessage: 'Can I use ice on my lips?',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: '3',
    clientName: 'Emily Chen',
    lastMessage: 'See you next week!',
    time: 'Jan 28',
    unread: false,
  },
];

const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'client',
    text: 'Hi! I had my Botox done yesterday and I have a small bruise on my forehead. Is this normal?',
    time: '9:15 AM',
  },
  {
    id: '2',
    sender: 'provider',
    text: 'Hi Jennifer! Yes, small bruises are completely normal and should fade within a few days. You can use arnica cream to help speed up healing.',
    time: '9:45 AM',
  },
  {
    id: '3',
    sender: 'client',
    text: 'Thank you! The results look amazing.',
    time: '10:30 AM',
  },
];

export default function ProviderMessagesPage() {
  const [selectedConvo, setSelectedConvo] = useState(CONVERSATIONS[0]);
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500">Secure communication with your patients</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-80 border-r border-gray-100 overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="divide-y divide-gray-100">
              {CONVERSATIONS.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setSelectedConvo(convo)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedConvo.id === convo.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold flex-shrink-0">
                      {convo.clientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">{convo.clientName}</p>
                        <span className="text-xs text-gray-400">{convo.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
                    </div>
                    {convo.unread && (
                      <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                  {selectedConvo.clientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedConvo.clientName}</p>
                  <p className="text-xs text-gray-500">Last seen today at 10:30 AM</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="text-xl">⋮</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {MOCK_MESSAGES.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      msg.sender === 'provider'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'provider' ? 'text-indigo-200' : 'text-gray-400'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500"
                />
                <button className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-full hover:bg-indigo-600">
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Messages are encrypted and HIPAA compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
