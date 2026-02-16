'use client';

// ============================================================
// AI CONCIERGE CHAT WIDGET
// 24/7 AI assistant for answering questions
// ============================================================

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  'What services do you offer?',
  'How much does Botox cost?',
  'Do you offer financing?',
  'What are your hours?',
  'How do I prepare for filler?',
];

// Knowledge base responses (fallback when API not configured)
const KNOWLEDGE_BASE: Record<string, string> = {
  'services': `We offer a full range of med spa services including:

💉 **Injectables**: Botox, Dysport, Juvederm, Restylane, Sculptra, Kybella
💆 **Facials**: HydraFacial, Signature Facials, Chemical Peels
⚡ **Body**: CoolSculpting, Body Contouring
💊 **Wellness**: Semaglutide/Tirzepatide Weight Loss, Vitamin Injections, IV Therapy
🧬 **Skin**: Microneedling, PRP, Laser Treatments

Would you like details on any specific treatment?`,

  'botox': `**Botox at Hello Gorgeous**

💰 **Price**: $12/unit (competitive Aurora-Oswego pricing)
⏱️ **Time**: 15-30 minutes
📅 **Results**: 3-5 days to see, lasts 3-4 months
👩‍⚕️ **Provider**: Experienced injectors

**Common areas**: Forehead, frown lines, crow's feet, lip flip, bunny lines

**First time?** Book a free consultation and we'll create a personalized plan!

Ready to book? Click "Book Now" or call (630) 636-6193`,

  'financing': `**Yes! We offer flexible financing options:**

✅ **Cherry Financing** - Apply in minutes, instant approval
✅ **Care Credit** - 0% interest plans available  
✅ **Affirm** - Pay over time
✅ **Alle Rewards** - Earn points on Allergan products

Most clients are approved in under 2 minutes. No hard credit check for Cherry!

Want help applying? Our team can walk you through it.`,

  'hours': `**Hello Gorgeous Med Spa Hours**

📍 Oswego, IL

Monday: 10am - 6pm
Tuesday: 10am - 7pm
Wednesday: 10am - 6pm
Thursday: 10am - 7pm
Friday: 10am - 5pm
Saturday: 9am - 3pm
Sunday: Closed

📞 (630) 636-6193
💬 Text us anytime!`,

  'filler': `**Preparing for Dermal Filler Treatment**

**1 Week Before:**
❌ Avoid blood thinners (aspirin, ibuprofen, fish oil)
❌ No alcohol 48 hours before
❌ Avoid retinol/AHAs on treatment area

**Day of Treatment:**
✅ Come with a clean face (no makeup)
✅ Eat a light meal beforehand
✅ Bring a list of medications/supplements

**After Treatment:**
❄️ Ice to reduce swelling
🚫 No strenuous exercise for 24 hours
🚫 Avoid excessive heat/sun for 48 hours
💧 Stay hydrated!

Questions? We'll go over everything at your appointment!`,

  'default': `Thanks for reaching out! 💕

I'm here to help you learn about our services at Hello Gorgeous Med Spa in Oswego.

I can help with:
• Treatment info & pricing
• Booking questions
• Preparation instructions
• Financing options
• Hours & location

What would you like to know?`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('service') || lower.includes('offer') || lower.includes('treatment')) {
    return KNOWLEDGE_BASE['services'];
  }
  if (lower.includes('botox') || lower.includes('dysport') || lower.includes('unit')) {
    return KNOWLEDGE_BASE['botox'];
  }
  if (lower.includes('financ') || lower.includes('payment') || lower.includes('pay') || lower.includes('credit') || lower.includes('cherry') || lower.includes('affirm')) {
    return KNOWLEDGE_BASE['financing'];
  }
  if (lower.includes('hour') || lower.includes('open') || lower.includes('close') || lower.includes('when') || lower.includes('time')) {
    return KNOWLEDGE_BASE['hours'];
  }
  if (lower.includes('filler') || lower.includes('prepar') || lower.includes('before') || lower.includes('ready')) {
    return KNOWLEDGE_BASE['filler'];
  }
  if (lower.includes('cost') || lower.includes('price') || lower.includes('much')) {
    return `Our pricing varies by treatment. Here are some popular options:

💉 **Botox**: $12/unit
💋 **Lip Filler**: Starting at $650
✨ **Full Face Filler**: Custom quote
💆 **HydraFacial**: $175
💊 **Weight Loss**: Starting at $350/month

For a personalized quote, book a free consultation!`;
  }
  if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule')) {
    return `**Ready to book?**

You have a few options:

📱 **Online**: Click the "Book Now" button
📞 **Call**: (630) 636-6193
💬 **Text**: (630) 636-6193

**First time?** We recommend starting with a consultation so we can create a personalized treatment plan just for you.

What service are you interested in?`;
  }
  
  return KNOWLEDGE_BASE['default'];
}

export function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! 👋 I'm the Hello Gorgeous AI Concierge. I'm here 24/7 to answer your questions about our treatments, pricing, and more.

How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Get response (would use OpenAI API in production)
    const responseText = getAIResponse(text);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : ''}`}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <p className="text-white font-semibold">Hello Gorgeous AI</p>
                <p className="text-pink-100 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-[#FF2D8E] text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-black mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3 py-1.5 bg-white hover:bg-white rounded-full text-xs text-black"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-black p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-black rounded-full focus:outline-none focus:border-[#FF2D8E]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-[#FF2D8E] text-white rounded-full flex items-center justify-center hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ↑
              </button>
            </form>
            <p className="text-[10px] text-black text-center mt-2">
              AI assistant • For emergencies call (630) 636-6193
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default AIConcierge;
