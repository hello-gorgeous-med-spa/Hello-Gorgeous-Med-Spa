'use client';

// ============================================================
// AI BUSINESS INSIGHTS - Square AI Style
// Natural language questions → instant charts & answers
// Admin Commands (Owner): website/business changes via AI, approve before execution
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { Breadcrumb } from '@/components/ui';
import { useAuth, RoleGate } from '@/lib/hgos/AuthContext';

type Tab = 'insights' | 'commands';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chart?: ChartData | null;
  timestamp: Date;
}

interface CommandProposal {
  action: string;
  location: string;
  old: string;
  new: string;
  summary: string;
  confidence: string;
}

interface CommandMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  proposal?: CommandProposal | null;
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

const COMMAND_EXAMPLES = [
  'Change homepage headline to Natural Results. Expert Care.',
  'Update Friday hours to 9–3',
  'Pause booking due to staffing',
  'Turn off the promo banner',
];

export default function AIInsightsPage() {
  const [tab, setTab] = useState<Tab>('insights');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Admin Commands (owner-only)
  const [cmdMessages, setCmdMessages] = useState<CommandMessage[]>([]);
  const [cmdInput, setCmdInput] = useState('');
  const [cmdLoading, setCmdLoading] = useState(false);
  const [pendingProposal, setPendingProposal] = useState<CommandProposal | null>(null);
  const cmdEndRef = useRef<HTMLDivElement>(null);
  const cmdInputRef = useRef<HTMLInputElement>(null);
  const [commandsView, setCommandsView] = useState<'chat' | 'activity'>('chat');
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; created_at: string; metadata?: { action?: string; approved_by_owner?: boolean; proposal?: { location: string; old: unknown; new: unknown }; changes?: { location: string; old: unknown; new: unknown } } }>>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
    cmdEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [cmdMessages, pendingProposal]);

  // Load initial insights
  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchActivity = async () => {
    setLoadingActivity(true);
    try {
      const res = await fetch('/api/ai/watchdog?source=ai_admin_commands&limit=50');
      const data = await res.json();
      setActivityLogs(data.logs || []);
    } catch {
      setActivityLogs([]);
    } finally {
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    if (tab === 'commands' && commandsView === 'activity') fetchActivity();
  }, [tab, commandsView]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim() || cmdLoading) return;
    setPendingProposal(null);
    const userMsg: CommandMessage = { id: `cmd-u-${Date.now()}`, role: 'user', content: cmdInput.trim(), timestamp: new Date() };
    setCmdMessages((prev) => [...prev, userMsg]);
    const sent = cmdInput.trim();
    setCmdInput('');
    setCmdLoading(true);
    try {
      const res = await fetch('/api/ai/admin-commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCmdMessages((prev) => [...prev, { id: `cmd-a-${Date.now()}`, role: 'assistant', content: data.error || 'Request failed', timestamp: new Date() }]);
        return;
      }
      if (data.kind === 'query') {
        setCmdMessages((prev) => [...prev, { id: `cmd-a-${Date.now()}`, role: 'assistant', content: data.response || '', timestamp: new Date() }]);
        return;
      }
      if (data.kind === 'command_proposal') {
        setCmdMessages((prev) => [...prev, {
          id: `cmd-a-${Date.now()}`,
          role: 'assistant',
          content: data.message || '',
          proposal: data.proposal || null,
          timestamp: new Date(),
        }]);
        setPendingProposal(data.proposal || null);
      }
    } catch (err) {
      console.error(err);
      setCmdMessages((prev) => [...prev, { id: `cmd-a-${Date.now()}`, role: 'assistant', content: 'Sorry, something went wrong. Please try again.', timestamp: new Date() }]);
    } finally {
      setCmdLoading(false);
      cmdInputRef.current?.focus();
    }
  };

  const handleApprove = async () => {
    if (!pendingProposal) return;
    setCmdLoading(true);
    try {
      const res = await fetch('/api/ai/admin-commands/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal: pendingProposal }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCmdMessages((prev) => [...prev, {
          id: `cmd-sys-${Date.now()}`,
          role: 'assistant',
          content: `✅ Change applied. ${data.message || ''}`,
          timestamp: new Date(),
        }]);
        setPendingProposal(null);
        fetchActivity();
      } else {
        setCmdMessages((prev) => [...prev, {
          id: `cmd-sys-${Date.now()}`,
          role: 'assistant',
          content: `❌ ${data.error || 'Failed to apply change.'}`,
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      setCmdMessages((prev) => [...prev, {
        id: `cmd-sys-${Date.now()}`,
        role: 'assistant',
        content: '❌ Something went wrong. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setCmdLoading(false);
      setPendingProposal(null);
    }
  };

  const handleEditProposal = () => {
    if (pendingProposal) setCmdInput(pendingProposal.new);
    setPendingProposal(null);
    cmdInputRef.current?.focus();
  };

  const handleCancelProposal = () => {
    setPendingProposal(null);
  };

  const lastExecution = activityLogs.find((log) => log.metadata?.approved_by_owner === true && log.metadata?.changes);
  const handleUndoLast = () => {
    if (!lastExecution?.metadata?.changes) return;
    const c = lastExecution.metadata.changes;
    setPendingProposal({
      action: 'update_site_content',
      location: c.location,
      old: String(c.new),
      new: String(c.old ?? ''),
      summary: `Revert ${c.location} to "${c.old ?? ''}"`,
      confidence: 'high',
    });
  };

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

      {/* Header + Tabs */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">✨</span>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-500">
            {tab === 'insights' ? 'Ask anything about your business' : 'Update website and business settings with AI (owner only)'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setTab('insights')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === 'insights' ? 'bg-white border border-b-0 border-gray-200 text-violet-600 -mb-px' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Insights
        </button>
        <RoleGate roles={['owner']}>
          <button
            type="button"
            onClick={() => setTab('commands')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === 'commands' ? 'bg-white border border-b-0 border-gray-200 text-violet-600 -mb-px' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Admin Commands (Owner)
          </button>
        </RoleGate>
      </div>

      {/* Insights tab */}
      {tab === 'insights' && (
      <>
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
      </>
      )}

      {/* Admin Commands tab (owner only) */}
      {tab === 'commands' && (
      <RoleGate roles={['owner']}>
        <div className="flex gap-2 mb-3">
          <button type="button" onClick={() => setCommandsView('chat')} className={`px-3 py-1.5 text-sm font-medium rounded-lg ${commandsView === 'chat' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Chat</button>
          <button type="button" onClick={() => setCommandsView('activity')} className={`px-3 py-1.5 text-sm font-medium rounded-lg ${commandsView === 'activity' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Activity</button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-[420px] overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {commandsView === 'activity' ? (
              loadingActivity ? (
                <p className="text-gray-500 text-sm">Loading activity…</p>
              ) : activityLogs.length === 0 ? (
                <p className="text-gray-500 text-sm">No admin command activity yet.</p>
              ) : (
                <ul className="space-y-3">
                  {activityLogs.map((log) => {
                    const meta = log.metadata || {};
                    const approved = meta.approved_by_owner === true;
                    const ch = meta.changes || meta.proposal;
                    const location = ch?.location ?? '—';
                    const oldVal = ch?.old != null ? String(ch.old) : '—';
                    const newVal = ch?.new != null ? String(ch.new) : '—';
                    const when = log.created_at ? new Date(log.created_at).toLocaleString() : '—';
                    const isLastExecution = lastExecution?.id === log.id;
                    return (
                      <li key={log.id} className="flex items-start justify-between gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500">{when}</p>
                          <p className="text-sm font-medium text-gray-900 mt-0.5">{approved ? 'Executed' : 'Proposed'}</p>
                          <p className="text-xs text-gray-600 mt-1">{location}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{oldVal} → {newVal}</p>
                        </div>
                        {isLastExecution && (
                          <button type="button" onClick={handleUndoLast} className="flex-shrink-0 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded hover:bg-amber-100">Undo last change</button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )
            ) : cmdMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <span className="text-3xl">⚙️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Commands</h3>
                <p className="text-gray-500 text-sm max-w-md mb-6">
                  Tell me what to change. I’ll propose the exact change for you to approve—nothing runs without your confirmation.
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {COMMAND_EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setCmdInput(ex); cmdInputRef.current?.focus(); }}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {cmdMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.proposal && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                          <span className="font-medium">{msg.proposal.location}</span> → {String(msg.proposal.new)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {cmdLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                      <div className="flex gap-2">
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={cmdEndRef} />
              </>
            )}
            {pendingProposal && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-medium text-amber-900 mb-2">Proposed change</p>
                <p className="text-sm text-amber-800 mb-3">{pendingProposal.summary}</p>
                <p className="text-xs text-amber-700 mb-3">Location: {pendingProposal.location} → &quot;{String(pendingProposal.new)}&quot;</p>
                <div className="flex gap-2">
                  <button type="button" onClick={handleApprove} disabled={cmdLoading} className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50">✅ Approve</button>
                  <button type="button" onClick={handleEditProposal} className="px-3 py-1.5 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300">✏️ Edit</button>
                  <button type="button" onClick={handleCancelProposal} className="px-3 py-1.5 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300">❌ Cancel</button>
                </div>
              </div>
            )}
          </div>
          {commandsView === 'chat' && (
          <form onSubmit={handleCommandSubmit} className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-3">
              <input
                ref={cmdInputRef}
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="e.g. Change homepage headline to …"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                disabled={cmdLoading}
              />
              <button type="submit" disabled={!cmdInput.trim() || cmdLoading} className="px-4 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 disabled:opacity-50">
                Send
              </button>
            </div>
          </form>
          )}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Every command is logged to AI Watchdog. Only you (owner) can see and use this tab.
        </p>
      </RoleGate>
      )}
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
