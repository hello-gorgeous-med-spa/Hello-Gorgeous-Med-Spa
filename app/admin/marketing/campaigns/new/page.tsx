'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CampaignChannel,
  BlockType,
  ContentBlock,
  EmailTheme,
  EMAIL_THEMES,
  DEFAULT_BLOCKS,
  AUDIENCE_SEGMENTS,
  CAMPAIGN_TEMPLATES,
  generateEmailHTML,
  validateSMS,
} from '@/lib/hgos/marketing-campaigns';

export default function NewCampaignPage() {
  const [step, setStep] = useState<'channel' | 'template' | 'audience' | 'content' | 'review'>('channel');
  const [channel, setChannel] = useState<CampaignChannel | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState('all-clients');
  
  // Email content state
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [theme, setTheme] = useState<EmailTheme>(EMAIL_THEMES[0]);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  
  // SMS content state
  const [smsContent, setSmsContent] = useState('');
  
  // Audience estimates (mock for now)
  const audienceEstimates = { email: 2334, sms: 1736, total: 2684 };
  
  const smsValidation = validateSMS(smsContent);

  // Add block to email
  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      ...DEFAULT_BLOCKS[type],
      type,
      content: { ...DEFAULT_BLOCKS[type]?.content },
    };
    setBlocks([...blocks, newBlock]);
  };

  // Update block content
  const updateBlock = (id: string, content: Record<string, any>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...content } } : b));
  };

  // Remove block
  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  // Move block
  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  // Load template
  const loadTemplate = (templateId: string) => {
    const template = CAMPAIGN_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject || '');
      setPreviewText(template.previewText || '');
      if (template.content) {
        setTheme(template.content.theme);
        setBlocks(template.content.blocks);
      }
      if (template.smsContent) {
        setSmsContent(template.smsContent);
      }
    }
    setSelectedTemplate(templateId);
    setStep('audience');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/marketing" className="text-gray-500 hover:text-gray-700">
              ← Back
            </Link>
            <h1 className="text-lg font-semibold">Create Campaign</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Save Draft
            </button>
            <button 
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600"
              onClick={() => setStep('review')}
            >
              Continue →
            </button>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="flex items-center gap-2">
            {['channel', 'template', 'audience', 'content', 'review'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s ? 'bg-pink-500 text-white' : 
                    ['channel', 'template', 'audience', 'content', 'review'].indexOf(step) > i 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                {i < 4 && <div className="w-12 h-0.5 bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step 1: Channel Selection */}
        {step === 'channel' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a channel</h2>
            <p className="text-gray-500 mb-8">Choose how you want to reach your clients</p>
            
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-4 mb-6">
              <p className="font-medium">✨ Unlimited emails & SMS included - FREE</p>
              <p className="text-sm text-pink-100">No per-message fees like other platforms!</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => { setChannel('multichannel'); setStep('template'); }}
                className="w-full p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-500 text-left transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📣</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">Multichannel</h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Recommended</span>
                    </div>
                    <p className="text-sm text-gray-500">Maximize reach with both email and text message</p>
                    <p className="text-sm text-pink-600 font-medium mt-1">Reach {audienceEstimates.total.toLocaleString()} clients</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setChannel('email'); setStep('template'); }}
                className="w-full p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-500 text-left transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-sm text-gray-500">Send promotional emails to your clients</p>
                    <p className="text-sm text-pink-600 font-medium mt-1">Reach {audienceEstimates.email.toLocaleString()} clients</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setChannel('sms'); setStep('template'); }}
                className="w-full p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-500 text-left transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Text Message</h3>
                    <p className="text-sm text-gray-500">Send promotional text messages to your clients</p>
                    <p className="text-sm text-pink-600 font-medium mt-1">Reach {audienceEstimates.sms.toLocaleString()} clients</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 'template' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a template</h2>
            <p className="text-gray-500 mb-8">Start with a pre-built template or create from scratch</p>

            <button
              onClick={() => setStep('audience')}
              className="w-full p-6 bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-pink-500 text-center mb-6 transition-colors"
            >
              <span className="text-2xl">✨</span>
              <p className="font-semibold text-gray-900 mt-2">Start from Scratch</p>
              <p className="text-sm text-gray-500">Build your own custom campaign</p>
            </button>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CAMPAIGN_TEMPLATES
                .filter(t => channel === 'multichannel' || t.channel === channel || t.channel === 'multichannel')
                .map(template => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template.id)}
                    className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-500 text-left transition-colors"
                  >
                    <span className="text-2xl">
                      {template.category === 'Promotions' && '🎉'}
                      {template.category === 'Announcements' && '📢'}
                      {template.category === 'Retention' && '💕'}
                      {template.category === 'Automated' && '⚡'}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.description}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {template.category}
                    </span>
                  </button>
                ))}
            </div>

            <button 
              onClick={() => setStep('channel')}
              className="mt-6 text-gray-500 hover:text-gray-700"
            >
              ← Back to channel selection
            </button>
          </div>
        )}

        {/* Step 3: Audience Selection */}
        {step === 'audience' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select your audience</h2>
            <p className="text-gray-500 mb-8">Who should receive this campaign?</p>

            <div className="space-y-3">
              {AUDIENCE_SEGMENTS.map(segment => (
                <button
                  key={segment.id}
                  onClick={() => setSelectedSegment(segment.id)}
                  className={`w-full p-4 bg-white rounded-xl border-2 text-left transition-colors ${
                    selectedSegment === segment.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{segment.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{segment.name}</h3>
                      <p className="text-sm text-gray-500">{segment.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setStep('template')}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
              <button 
                onClick={() => setStep('content')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600"
              >
                Continue to Content →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Content Builder */}
        {step === 'content' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar - Block Types */}
            <div className="col-span-3 bg-white rounded-xl p-4 h-fit sticky top-32">
              <h3 className="font-semibold text-gray-900 mb-4">Add content</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(DEFAULT_BLOCKS).map((type) => (
                  <button
                    key={type}
                    onClick={() => addBlock(type as BlockType)}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-center transition-colors"
                  >
                    <span className="text-xl block mb-1">
                      {type === 'title' && '📝'}
                      {type === 'paragraph' && '¶'}
                      {type === 'image' && '🖼️'}
                      {type === 'button' && '🔘'}
                      {type === 'divider' && '—'}
                      {type === 'social' && '🔗'}
                      {type === 'deal' && '💰'}
                      {type === 'spacer' && '↕️'}
                    </span>
                    <span className="text-xs text-gray-600 capitalize">{type}</span>
                  </button>
                ))}
              </div>

              {/* Themes */}
              <h3 className="font-semibold text-gray-900 mt-6 mb-4">Themes</h3>
              <div className="space-y-2">
                {EMAIL_THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`w-full p-2 rounded-lg text-left text-sm flex items-center gap-2 ${
                      theme.id === t.id ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})` }}
                    />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Preview */}
            <div className="col-span-6">
              {(channel === 'email' || channel === 'multichannel') && (
                <>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">Preview Text</label>
                    <input
                      type="text"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="This appears after the subject in inbox..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div 
                    className="bg-white rounded-xl overflow-hidden border-2 border-gray-200"
                    style={{ backgroundColor: theme.backgroundColor }}
                  >
                    {/* Email Preview Header */}
                    <div className="bg-gray-100 px-4 py-2 text-sm text-gray-500 border-b">
                      Preview
                    </div>
                    
                    {/* Email Content */}
                    <div className="p-6 max-w-lg mx-auto bg-white my-4 rounded shadow-sm">
                      {blocks.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                          <p className="text-lg mb-2">Add content blocks from the left panel</p>
                          <p className="text-sm">Click on Title, Paragraph, Image, etc. to build your email</p>
                        </div>
                      ) : (
                        blocks.map((block, index) => (
                          <div 
                            key={block.id} 
                            className="group relative hover:outline hover:outline-2 hover:outline-pink-300 rounded p-2 -m-2 mb-4"
                          >
                            {/* Block Controls */}
                            <div className="absolute -right-2 top-0 hidden group-hover:flex flex-col gap-1 bg-white shadow-lg rounded-lg p-1 z-10">
                              <button onClick={() => moveBlock(block.id, 'up')} className="p-1 hover:bg-gray-100 rounded text-xs">↑</button>
                              <button onClick={() => moveBlock(block.id, 'down')} className="p-1 hover:bg-gray-100 rounded text-xs">↓</button>
                              <button onClick={() => removeBlock(block.id)} className="p-1 hover:bg-red-100 text-red-500 rounded text-xs">✕</button>
                            </div>
                            
                            {/* Block Preview */}
                            {block.type === 'title' && (
                              <input
                                type="text"
                                value={block.content.text}
                                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                                className={`w-full bg-transparent border-none focus:outline-none ${
                                  block.content.level === 'h1' ? 'text-3xl font-bold' : 'text-xl font-semibold'
                                }`}
                                style={{ color: theme.primaryColor, textAlign: block.content.alignment }}
                              />
                            )}
                            {block.type === 'paragraph' && (
                              <textarea
                                value={block.content.text}
                                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                                className="w-full bg-transparent border-none focus:outline-none resize-none"
                                style={{ color: theme.textColor, textAlign: block.content.alignment }}
                                rows={3}
                              />
                            )}
                            {block.type === 'button' && (
                              <div style={{ textAlign: block.content.alignment }}>
                                <span
                                  className="inline-block px-6 py-3 rounded-lg text-white font-semibold"
                                  style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
                                >
                                  {block.content.text}
                                </span>
                              </div>
                            )}
                            {block.type === 'divider' && (
                              <hr style={{ borderStyle: block.content.style, width: block.content.width, margin: '0 auto' }} />
                            )}
                            {block.type === 'deal' && (
                              <div 
                                className="rounded-xl p-4 text-center"
                                style={{ backgroundColor: theme.backgroundColor, border: `2px solid ${theme.primaryColor}` }}
                              >
                                <h3 className="font-bold text-lg" style={{ color: theme.primaryColor }}>{block.content.title}</h3>
                                <p className="text-sm text-gray-600">{block.content.description}</p>
                                <p className="text-2xl font-bold mt-2" style={{ color: theme.primaryColor }}>
                                  {block.content.originalPrice > 0 && (
                                    <span className="text-gray-400 line-through text-lg mr-2">${block.content.originalPrice}</span>
                                  )}
                                  ${block.content.salePrice}
                                </p>
                              </div>
                            )}
                            {block.type === 'image' && (
                              <div className="text-center">
                                {block.content.src ? (
                                  <img src={block.content.src} alt={block.content.alt} className="max-w-full mx-auto rounded" />
                                ) : (
                                  <div className="bg-gray-100 rounded-lg p-8">
                                    <input
                                      type="text"
                                      placeholder="Paste image URL..."
                                      value={block.content.src}
                                      onChange={(e) => updateBlock(block.id, { src: e.target.value })}
                                      className="w-full px-3 py-2 border rounded text-sm"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                            {block.type === 'spacer' && (
                              <div style={{ height: block.content.height }} className="bg-gray-50 rounded" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-4 py-3 text-center text-xs text-gray-500">
                      {theme.footerText}
                    </div>
                  </div>
                </>
              )}

              {/* SMS Preview */}
              {(channel === 'sms' || channel === 'multichannel') && (
                <div className={channel === 'multichannel' ? 'mt-6' : ''}>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {channel === 'multichannel' ? 'SMS Version' : 'Text Message'}
                  </h3>
                  <div className="bg-white rounded-xl p-4">
                    <textarea
                      value={smsContent}
                      onChange={(e) => setSmsContent(e.target.value)}
                      placeholder="Type your SMS message... Use {firstName} for personalization"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span className={smsValidation.valid ? 'text-gray-500' : 'text-red-500'}>
                        {smsContent.length}/160 characters ({smsValidation.segments} segment{smsValidation.segments !== 1 ? 's' : ''})
                      </span>
                      {!smsValidation.valid && (
                        <span className="text-red-500">{smsValidation.message}</span>
                      )}
                    </div>

                    {/* Phone Preview */}
                    <div className="mt-4 bg-gray-900 rounded-3xl p-4 max-w-xs mx-auto">
                      <div className="bg-green-500 rounded-2xl p-3 text-white text-sm">
                        {smsContent || 'Your message preview will appear here...'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Panel */}
            <div className="col-span-3 space-y-4">
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Campaign Summary</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Channel</dt>
                    <dd className="font-medium capitalize">{channel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Audience</dt>
                    <dd className="font-medium">{AUDIENCE_SEGMENTS.find(s => s.id === selectedSegment)?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Est. Recipients</dt>
                    <dd className="font-medium text-pink-600">
                      {channel === 'email' ? audienceEstimates.email.toLocaleString() :
                       channel === 'sms' ? audienceEstimates.sms.toLocaleString() :
                       audienceEstimates.total.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">💰 Cost Savings</h3>
                <p className="text-sm text-green-700">
                  This campaign would cost ~$50-100+ on other platforms. 
                  <strong className="block mt-1">You pay: $0</strong>
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep('audience')}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-lg"
                >
                  ← Back
                </button>
                <button 
                  onClick={() => setStep('review')}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600"
                >
                  Review →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Send */}
        {step === 'review' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Send</h2>
            <p className="text-gray-500 mb-8">Double-check everything before sending</p>

            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-500">Campaign Type</span>
                <span className="font-medium capitalize">{channel}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-500">Subject</span>
                <span className="font-medium">{subject || 'Not set'}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-500">Audience</span>
                <span className="font-medium">{AUDIENCE_SEGMENTS.find(s => s.id === selectedSegment)?.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-500">Recipients</span>
                <span className="font-medium text-pink-600">
                  {channel === 'email' ? audienceEstimates.email.toLocaleString() :
                   channel === 'sms' ? audienceEstimates.sms.toLocaleString() :
                   audienceEstimates.total.toLocaleString()} clients
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-500">Estimated Cost</span>
                <span className="font-bold text-green-600">FREE ✓</span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => setStep('content')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                ← Edit Content
              </button>
              <button className="flex-1 px-6 py-3 border border-pink-500 text-pink-600 rounded-lg hover:bg-pink-50">
                Schedule for Later
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600">
                Send Now 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
