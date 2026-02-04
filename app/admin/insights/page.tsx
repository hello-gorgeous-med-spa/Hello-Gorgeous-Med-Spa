'use client';

// ============================================================
// AI BUSINESS INSIGHTS - Square AI Style
// Natural language questions → instant charts & answers
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { Breadcrumb } from '@/components/ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chart?: ChartData | null;
  timestamp: Date;
}

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'metric' | 'table';
  title: string;
  data: any;
  labels?: string[];
}

interface InsightCard {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: string;
}

// Pre-built quick questions
const QUICK_QUESTIONS = [
  "How many appointments do I have today?",
  "Show me new vs returning clients this month",
  "What's my revenue this week?",
  "Who are my top 5 clients by spend?",
  "What's my busiest day of the week?",
  "Compare this month to last month",
  "What services are most popular?",
  "Show me no-show rate trends",
];

export default function AIInsightsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load initial insights
  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch('/api/ai/insights');
      const data = await res.json();
      if (data.insights) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'I couldn\'t process that request.',
        chart: data.chart || null,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">✨</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-500">Ask anything about your business</p>
        </div>
      </div>

      {/* Quick Insight Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loadingInsights ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))
        ) : (
          insights.slice(0, 4).map((insight) => (
            <div key={insight.id} className={`bg-gradient-to-br ${insight.color} rounded-xl p-4 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium opacity-90">{insight.title}</span>
                <span className="text-xl">{insight.icon}</span>
              </div>
              <p className="text-2xl font-bold">{insight.value}</p>
              {insight.change !== undefined && (
                <p className={`text-xs mt-1 ${insight.change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {insight.change >= 0 ? '↑' : '↓'} {Math.abs(insight.change)}% {insight.changeLabel}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Main Chat Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Chat Messages */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask me anything!</h3>
              <p className="text-gray-500 text-sm max-w-md mb-6">
                I can help you understand your business data. Try asking about revenue, appointments, clients, or trends.
              </p>
              
              {/* Quick Questions */}
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {QUICK_QUESTIONS.slice(0, 4).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Chart Visualization */}
                    {message.chart && (
                      <div className="mt-4">
                        <ChartRenderer chart={message.chart} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-gray-500">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your business..."
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* More Quick Questions */}
          {messages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_QUESTIONS.slice(4).map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickQuestion(q)}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Help Text */}
      <p className="text-center text-xs text-gray-400">
        AI Insights analyzes your real business data to answer questions and surface trends.
        <br />
        Powered by Hello Gorgeous OS
      </p>
    </div>
  );
}

// Chart Renderer Component
function ChartRenderer({ chart }: { chart: ChartData }) {
  if (chart.type === 'metric') {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{chart.title}</p>
        <p className="text-3xl font-bold text-gray-900">{chart.data.value}</p>
        {chart.data.subtitle && (
          <p className="text-sm text-gray-500 mt-1">{chart.data.subtitle}</p>
        )}
      </div>
    );
  }

  if (chart.type === 'bar') {
    const maxValue = Math.max(...chart.data.map((d: any) => d.value));
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">{chart.title}</p>
        <div className="space-y-2">
          {chart.data.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-20 truncate">{item.label}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 w-12 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (chart.type === 'table') {
    return (
      <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">{chart.title}</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {chart.labels?.map((label, i) => (
                <th key={i} className="text-left py-2 px-2 text-gray-600 font-medium">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.data.map((row: any, i: number) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                {Object.values(row).map((cell: any, j: number) => (
                  <td key={j} className="py-2 px-2 text-gray-900">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Fallback for other chart types
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-500">{chart.title}</p>
      <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(chart.data, null, 2)}</pre>
    </div>
  );
}
