'use client';

// ============================================================
// PROVIDER MESSAGES - Patient Communications
// HIPAA-compliant messaging with patients
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

export default function ProviderMessagesPage() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'templates'>('inbox');

  // Demo message templates
  const templates = [
    {
      id: '1',
      name: 'Post-Botox Care',
      preview: 'Thank you for your visit today! Here are your post-treatment instructions...',
    },
    {
      id: '2',
      name: 'Post-Filler Care',
      preview: 'Thank you for choosing us for your filler treatment. Please follow these guidelines...',
    },
    {
      id: '3',
      name: 'Appointment Reminder',
      preview: 'This is a reminder about your upcoming appointment at Hello Gorgeous Med Spa...',
    },
    {
      id: '4',
      name: 'Follow-Up Check-In',
      preview: 'Hi! I wanted to check in and see how you\'re feeling after your treatment...',
    },
    {
      id: '5',
      name: 'Rebooking Invite',
      preview: 'It\'s been a while since your last visit! We\'d love to see you again...',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500">HIPAA-compliant patient communications</p>
        </div>
        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium">
          + New Message
        </button>
      </div>

      {/* HIPAA Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <p className="font-medium text-blue-800">HIPAA Compliance Reminder</p>
            <p className="text-sm text-blue-700">
              Never include specific treatment details, diagnoses, or PHI in SMS/email messages. 
              Use generic language and direct patients to call for clinical questions.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { id: 'inbox', label: 'Inbox', count: 3 },
            { id: 'sent', label: 'Sent', count: 0 },
            { id: 'templates', label: 'Templates', count: templates.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-pink-200 text-pink-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Inbox */}
          {activeTab === 'inbox' && (
            <div className="space-y-3">
              <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center font-bold text-pink-700">
                      JD
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Jane Doe</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                </div>
                <p className="text-gray-700 text-sm">
                  Hi! I have a question about my upcoming appointment...
                </p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                      MS
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Mary Smith</p>
                      <p className="text-sm text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Thank you for the great service! I'll be back soon.
                </p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                      RJ
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Robert Johnson</p>
                      <p className="text-sm text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Can I reschedule my appointment to next week?
                </p>
              </div>
            </div>
          )}

          {/* Sent */}
          {activeTab === 'sent' && (
            <div className="text-center py-12">
              <span className="text-4xl block mb-2">📤</span>
              <p className="text-gray-500">No sent messages yet</p>
              <p className="text-sm text-gray-400 mt-1">Messages you send will appear here</p>
            </div>
          )}

          {/* Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-3">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <button className="px-3 py-1 bg-pink-100 text-pink-600 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      Use Template
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{template.preview}</p>
                </div>
              ))}
              
              <button className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-pink-300 hover:text-pink-600 transition-colors">
                + Create New Template
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Send Options */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-center">
            <span className="text-2xl block mb-1">📱</span>
            <span className="text-sm font-medium text-green-700">Send SMS</span>
          </button>
          <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center">
            <span className="text-2xl block mb-1">📧</span>
            <span className="text-sm font-medium text-blue-700">Send Email</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-center">
            <span className="text-2xl block mb-1">⭐</span>
            <span className="text-sm font-medium text-purple-700">Request Review</span>
          </button>
          <button className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors text-center">
            <span className="text-2xl block mb-1">📋</span>
            <span className="text-sm font-medium text-amber-700">Send Consent</span>
          </button>
        </div>
      </div>
    </div>
  );
}
