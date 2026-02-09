'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SMS_TEMPLATES } from '@/lib/hgos/sms-marketing';

export default function SMSCampaignPage() {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [recipients, setRecipients] = useState<'all' | 'custom'>('all');
  const [customNumbers, setCustomNumbers] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [charCount, setCharCount] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState<any>(null);
  const [clientCount, setClientCount] = useState(0);

  // Fetch actual client count with SMS opt-in
  useEffect(() => {
    async function fetchClientCount() {
      try {
        const res = await fetch('/api/sms/stats');
        if (res.ok) {
          const data = await res.json();
          setClientCount(data.smsOptInCount || 0);
        }
      } catch (err) {
        console.error('Error fetching SMS stats:', err);
      }
    }
    fetchClientCount();
  }, []);

  // Update character count
  useEffect(() => {
    const optOutText = '\n\nReply STOP to unsubscribe.';
    const hasOptOut = ['reply stop', 'text stop', 'opt out', 'unsubscribe'].some(
      phrase => message.toLowerCase().includes(phrase)
    );
    const finalLength = hasOptOut ? message.length : message.length + optOutText.length;
    setCharCount(finalLength);
  }, [message]);

  // Get cost estimate
  useEffect(() => {
    const count = recipients === 'all' ? clientCount : customNumbers.split('\n').filter(n => n.trim()).length;
    if (count > 0) {
      setEstimatedCost({
        recipients: count,
        smsCost: `$${(count * 0.004).toFixed(2)}`,
        estimatedMinutes: Math.ceil(count / 2),
        estimatedHours: (count / 2 / 60).toFixed(1),
      });
    }
  }, [recipients, customNumbers, clientCount]);

  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = SMS_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setMessage(template.message);
      setSelectedTemplate(templateId);
    }
  };

  // Send campaign
  const sendCampaign = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const payload: any = {
        message,
        mediaUrl: mediaUrl || undefined,
      };

      if (recipients === 'all') {
        payload.sendToAll = true;
      } else {
        payload.recipients = customNumbers
          .split('\n')
          .map(n => n.trim())
          .filter(n => n);
      }

      const response = await fetch('/api/sms/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResult(data);

    } catch (error) {
      setResult({ error: 'Failed to send campaign' });
    } finally {
      setSending(false);
    }
  };

  // Send test SMS
  const sendTest = async () => {
    const testNumber = prompt('Enter your phone number to receive a test:');
    if (!testNumber) return;

    setSending(true);
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testNumber,
          message,
          mediaUrl: mediaUrl || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Test message sent! Check your phone.');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to send test');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SMS Campaigns</h1>
        <p className="text-gray-600 mt-1">Send text message campaigns to your clients</p>
      </div>

      {/* Cost Savings Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">You're Saving BIG on SMS</h2>
            <p className="text-green-100 mt-1">
              Fresha: $150 per blast → <strong>You: ~${estimatedCost?.smsCost || '12'}</strong>
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              ~${estimatedCost ? (150 - parseFloat(estimatedCost.smsCost.replace('$', ''))).toFixed(0) : '138'}
            </div>
            <div className="text-green-100 text-sm">saved per campaign</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Message Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Templates */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Templates</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SMS_TEMPLATES.slice(0, 9).map(template => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template.id)}
                  className={`p-3 text-left rounded-lg border text-sm transition-colors ${
                    selectedTemplate === template.id
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <div className="font-medium truncate">{template.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{template.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Message</h3>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setSelectedTemplate('');
              }}
              placeholder="Type your message here... Use {{firstName}} for personalization."
              className="w-full h-40 px-4 py-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <div className="flex justify-between mt-2 text-sm">
              <span className={charCount > 160 ? 'text-amber-600' : 'text-gray-500'}>
                {charCount} characters {charCount > 160 && `(${Math.ceil(charCount / 160)} segments)`}
              </span>
              <span className="text-gray-500">
                {!message.toLowerCase().includes('stop') && '+ "Reply STOP to unsubscribe" will be added'}
              </span>
            </div>

            {/* MMS Image URL */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional - for MMS)
              </label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/promo-image.jpg"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                MMS costs $0.015/msg vs $0.004 for SMS
              </p>
            </div>
          </div>

          {/* Recipients */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recipients</h3>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setRecipients('all')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  recipients === 'all'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div className="font-semibold">All Clients</div>
                <div className="text-sm text-gray-500">~{clientCount.toLocaleString()} clients with SMS opt-in</div>
              </button>
              <button
                onClick={() => setRecipients('custom')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  recipients === 'custom'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div className="font-semibold">Custom List</div>
                <div className="text-sm text-gray-500">Enter phone numbers manually</div>
              </button>
            </div>

            {recipients === 'custom' && (
              <textarea
                value={customNumbers}
                onChange={(e) => setCustomNumbers(e.target.value)}
                placeholder="Enter phone numbers, one per line:&#10;6301234567&#10;3125559999&#10;..."
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg resize-none"
              />
            )}

            {clientCount === 0 && (
              <p className="mt-4 text-sm text-gray-500">
                This count is live from your database. To add clients with SMS opt-in,{' '}
                <Link href="/admin/marketing/contacts#import" className="text-pink-600 hover:underline">
                  import contacts with phone numbers
                </Link>
                {' '}in Contact Collection, or ensure existing clients have a phone and SMS marketing enabled.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - Preview & Send */}
        <div className="space-y-6">
          {/* Phone Preview */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="bg-gray-900 rounded-3xl p-4 max-w-[280px] mx-auto">
              <div className="bg-gray-800 rounded-2xl p-3">
                <div className="text-center text-gray-400 text-xs mb-2">
                  +1 (331) 717-7545
                </div>
                <div className="bg-green-600 text-white rounded-2xl rounded-bl-md p-3 text-sm">
                  {message || 'Your message will appear here...'}
                  {!message.toLowerCase().includes('stop') && message && (
                    <div className="mt-2 pt-2 border-t border-green-500 text-xs opacity-75">
                      Reply STOP to unsubscribe.
                    </div>
                  )}
                </div>
                {mediaUrl && (
                  <div className="mt-2 bg-gray-700 rounded-lg p-2 text-center text-gray-400 text-xs">
                    📷 Image attached
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cost Estimate */}
          {estimatedCost && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cost Estimate</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipients</span>
                  <span className="font-medium">{estimatedCost.recipients.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost (SMS)</span>
                  <span className="font-medium text-green-600">{estimatedCost.smsCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Time</span>
                  <span className="font-medium">
                    {estimatedCost.estimatedMinutes < 60 
                      ? `${estimatedCost.estimatedMinutes} min`
                      : `${estimatedCost.estimatedHours} hrs`
                    }
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">vs Fresha</span>
                    <span className="font-medium text-green-600">
                      Save ${(150 - parseFloat(estimatedCost.smsCost.replace('$', ''))).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rate Limit Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-medium text-amber-800 mb-1">⚡ Local Number Rate</h4>
            <p className="text-sm text-amber-700">
              2 messages/minute with local number. Large campaigns run in background.
              <Link href="#" className="underline ml-1">Upgrade to 10DLC</Link> for 60+ msg/sec.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={sendTest}
              disabled={!message || sending}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50"
            >
              📱 Send Test to Myself
            </button>
            <button
              onClick={sendCampaign}
              disabled={!message || sending}
              className="w-full py-4 px-4 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Sending...
                </span>
              ) : (
                `🚀 Send Campaign (${estimatedCost?.smsCost || '$0.00'})`
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className={`rounded-xl p-4 ${result.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              {result.error ? (
                <div className="text-red-800">
                  <strong>Error:</strong> {result.error}
                </div>
              ) : (
                <div className="text-green-800">
                  <strong>🎉 Campaign Started!</strong>
                  <div className="text-sm mt-2 space-y-1">
                    <p>Sending to {result.totalRecipients} recipients</p>
                    <p>Estimated time: {result.estimatedMinutes} minutes</p>
                    <p>Cost: {result.estimatedCost}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
