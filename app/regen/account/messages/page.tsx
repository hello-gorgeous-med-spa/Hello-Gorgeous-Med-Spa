'use client';

import { useState } from 'react';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

export default function MessagesPage() {
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: BRAND.cream }}>Messages</h1>
        <p style={{ color: BRAND.gray }}>Communicate securely with your care team.</p>
      </div>

      {/* Message Area */}
      <div 
        className="rounded-xl overflow-hidden"
        style={{ 
          backgroundColor: BRAND.darkCard,
          border: `1px solid ${BRAND.teal}20`,
        }}
      >
        {/* Messages Header */}
        <div 
          className="p-4 border-b flex items-center gap-4"
          style={{ borderColor: `${BRAND.teal}20` }}
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: BRAND.teal }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: BRAND.cream }}>REGEN RX Care Team</h3>
            <p className="text-sm" style={{ color: BRAND.gray }}>Typically responds within 24 hours</p>
          </div>
        </div>

        {/* Messages Body - Empty State */}
        <div className="p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${BRAND.teal}10` }}
          >
            <svg className="w-8 h-8" style={{ color: BRAND.teal }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: BRAND.cream }}>Start a conversation</h3>
          <p className="max-w-sm" style={{ color: BRAND.gray }}>
            Have questions about your treatment or need support? Send a message to your care team below.
          </p>
        </div>

        {/* Message Input */}
        <div 
          className="p-4 border-t"
          style={{ borderColor: `${BRAND.teal}20` }}
        >
          <div className="flex gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={3}
              className="flex-1 p-4 rounded-xl resize-none text-sm focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: BRAND.dark,
                color: BRAND.cream,
                border: `1px solid ${BRAND.teal}30`,
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs" style={{ color: BRAND.gray }}>
              Messages are HIPAA compliant and secure.
            </p>
            <button
              disabled={!message.trim()}
              className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Quick Topics */}
      <div>
        <h3 className="font-semibold mb-4" style={{ color: BRAND.cream }}>Common Questions</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Dosing instructions',
            'Side effects',
            'Refill request',
            'Update shipping address',
            'Cancel subscription',
            'General question',
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => setMessage(`Hi, I have a question about: ${topic}`)}
              className="p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
              style={{ 
                backgroundColor: BRAND.darkCard,
                border: `1px solid ${BRAND.teal}20`,
                color: BRAND.cream,
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div 
        className="p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ 
          backgroundColor: BRAND.darkCard,
          border: `1px solid ${BRAND.teal}20`,
        }}
      >
        <div>
          <h3 className="font-semibold mb-1" style={{ color: BRAND.cream }}>Prefer to call?</h3>
          <p className="text-sm" style={{ color: BRAND.gray }}>
            We&apos;re available Monday–Friday, 9am–5pm CT.
          </p>
        </div>
        <a
          href="tel:+16306366193"
          className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 whitespace-nowrap"
          style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
        >
          (630) 636-6193
        </a>
      </div>
    </div>
  );
}
