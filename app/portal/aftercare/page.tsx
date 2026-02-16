'use client';

import { useState, useEffect } from 'react';
import { usePortalAuth } from '@/lib/portal/useAuth';

interface Aftercare {
  id: string;
  sentAt: string;
  acknowledgedAt?: string;
  customNotes?: string;
  providerNotes?: string;
  instructions?: {
    treatmentType: string;
    title: string;
    summary?: string;
    instructions: Array<{ step: number; text: string }>;
    warnings?: string[];
    immediateCare?: string;
    first24Hours?: string;
    firstWeek?: string;
    emergencySigns?: string[];
  };
}

export default function AftercarePage() {
  const { user, loading: authLoading } = usePortalAuth();
  const [aftercares, setAftercares] = useState<Aftercare[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchAftercares();
  }, [user]);

  const fetchAftercares = async () => {
    try {
      const res = await fetch('/api/portal/aftercare');
      const data = await res.json();
      setAftercares(data.aftercares || []);
      if (data.aftercares?.length > 0) {
        setExpandedId(data.aftercares[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch aftercare:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await fetch('/api/portal/aftercare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aftercareId: id }),
      });
      fetchAftercares();
    } catch (err) {
      console.error('Failed to acknowledge:', err);
    }
  };

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin text-4xl">💗</div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">Aftercare Instructions</h1>
        <p className="text-[#111]/70 mt-1">Important care instructions for your treatments</p>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-medium text-red-700">Emergency Contact</p>
            <p className="text-sm text-red-600 mt-1">
              If you experience severe pain, difficulty breathing, or signs of infection, call us immediately or go to the nearest ER.
            </p>
            <a href="tel:+13215551234" className="inline-flex items-center gap-2 mt-2 text-red-700 font-medium hover:underline">
              📞 (321) 555-1234
            </a>
          </div>
        </div>
      </div>

      {/* Aftercare Cards */}
      {aftercares.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#111]/10">
          <span className="text-4xl">📋</span>
          <p className="mt-4 text-[#111]/70">No aftercare instructions yet</p>
          <p className="text-sm text-[#111]/50 mt-1">Instructions will appear here after your treatments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {aftercares.map((ac) => (
            <div key={ac.id} className="bg-white rounded-2xl border border-[#111]/10 overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === ac.id ? null : ac.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF2D8E]/10 rounded-xl flex items-center justify-center">
                    <span className="text-xl">
                      {ac.instructions?.treatmentType === 'botox' ? '💉' :
                       ac.instructions?.treatmentType === 'filler' ? '💋' :
                       ac.instructions?.treatmentType === 'laser' ? '✨' :
                       ac.instructions?.treatmentType === 'weight_loss' ? '⚖️' : '📋'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#111]">{ac.instructions?.title || 'Aftercare Instructions'}</p>
                    <p className="text-sm text-[#111]/50">Sent {new Date(ac.sentAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {ac.acknowledgedAt ? (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Read</span>
                  ) : (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Unread</span>
                  )}
                  <span className={`transform transition-transform ${expandedId === ac.id ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </button>

              {expandedId === ac.id && ac.instructions && (
                <div className="border-t border-[#111]/10 p-6 space-y-6">
                  {/* Summary */}
                  {ac.instructions.summary && (
                    <p className="text-[#111]/70">{ac.instructions.summary}</p>
                  )}

                  {/* Steps */}
                  <div>
                    <h3 className="font-medium text-[#111] mb-3">Key Instructions</h3>
                    <div className="space-y-2">
                      {ac.instructions.instructions.map((inst, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl">
                          <span className="w-6 h-6 bg-[#FF2D8E] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                            {inst.step}
                          </span>
                          <p className="text-[#111]/80 text-sm">{inst.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ac.instructions.immediateCare && (
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="font-medium text-blue-700 text-sm mb-2">⏰ Immediately After</p>
                        <p className="text-sm text-blue-600">{ac.instructions.immediateCare}</p>
                      </div>
                    )}
                    {ac.instructions.first24Hours && (
                      <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                        <p className="font-medium text-purple-700 text-sm mb-2">🌙 First 24 Hours</p>
                        <p className="text-sm text-purple-600">{ac.instructions.first24Hours}</p>
                      </div>
                    )}
                    {ac.instructions.firstWeek && (
                      <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                        <p className="font-medium text-green-700 text-sm mb-2">📅 First Week</p>
                        <p className="text-sm text-green-600">{ac.instructions.firstWeek}</p>
                      </div>
                    )}
                  </div>

                  {/* Warnings */}
                  {ac.instructions.warnings && ac.instructions.warnings.length > 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="font-medium text-amber-700 mb-2">⚠️ Important Warnings</p>
                      <ul className="space-y-1">
                        {ac.instructions.warnings.map((w, idx) => (
                          <li key={idx} className="text-sm text-amber-600 flex items-start gap-2">
                            <span>•</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Emergency Signs */}
                  {ac.instructions.emergencySigns && ac.instructions.emergencySigns.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="font-medium text-red-700 mb-2">🚨 Seek Medical Attention If</p>
                      <ul className="space-y-1">
                        {ac.instructions.emergencySigns.map((s, idx) => (
                          <li key={idx} className="text-sm text-red-600 flex items-start gap-2">
                            <span>•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Provider Notes */}
                  {ac.providerNotes && (
                    <div className="p-4 bg-[#FF2D8E]/5 border border-[#FF2D8E]/20 rounded-xl">
                      <p className="font-medium text-[#FF2D8E] mb-2">💗 Personal Notes From Your Provider</p>
                      <p className="text-sm text-[#111]/70">{ac.providerNotes}</p>
                    </div>
                  )}

                  {/* Acknowledge Button */}
                  {!ac.acknowledgedAt && (
                    <button
                      onClick={() => handleAcknowledge(ac.id)}
                      className="w-full bg-[#FF2D8E] text-white py-3 rounded-xl font-medium hover:bg-[#FF2D8E]/90 transition-colors"
                    >
                      ✓ I Have Read These Instructions
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
