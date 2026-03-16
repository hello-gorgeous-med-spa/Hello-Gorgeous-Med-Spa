"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ChannelPost {
  id?: string;
  message: string;
  status: string;
  scheduled_at?: string;
  posted_at?: string;
}

interface BlogSocialItem {
  blog_slug: string;
  blog_title: string;
  channels: Record<string, ChannelPost>;
}

const CHANNEL_META: Record<string, { icon: string; label: string; color: string }> = {
  instagram: { icon: "📸", label: "Instagram", color: "#E91E8C" },
  facebook: { icon: "📘", label: "Facebook", color: "#1877F2" },
  google: { icon: "🏢", label: "Google Business", color: "#4285F4" },
};

const STATUS_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: "Draft", bg: "bg-yellow-500/20", text: "text-yellow-400" },
  approved: { label: "Approved", bg: "bg-blue-500/20", text: "text-blue-400" },
  posted: { label: "Posted", bg: "bg-green-500/20", text: "text-green-400" },
  failed: { label: "Failed", bg: "bg-red-500/20", text: "text-red-400" },
  not_generated: { label: "Not Generated", bg: "bg-white/10", text: "text-white/40" },
};

export default function BlogSocialPage() {
  const [items, setItems] = useState<BlogSocialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [approving, setApproving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/automation/blog-to-social");
      if (res.ok) {
        const data = await res.json();
        setItems(data.posts || []);
      }
    } catch (e) {
      console.error("Failed to load blog social data:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const generateAll = async () => {
    setGenerating(true);
    try {
      await fetch("/api/automation/blog-to-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generateAll: true }),
      });
      await loadData();
    } catch (e) {
      console.error("Generation failed:", e);
    }
    setGenerating(false);
  };

  const generateOne = async (slug: string) => {
    try {
      await fetch("/api/automation/blog-to-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      await loadData();
    } catch (e) {
      console.error("Generation failed:", e);
    }
  };

  const approveAll = async () => {
    setApproving(true);
    try {
      await fetch("/api/automation/blog-to-social", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve-all" }),
      });
      await loadData();
    } catch (e) {
      console.error("Approve all failed:", e);
    }
    setApproving(false);
  };

  const approveOne = async (id: string) => {
    try {
      await fetch("/api/automation/blog-to-social", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "approve" }),
      });
      await loadData();
    } catch (e) {
      console.error("Approve failed:", e);
    }
  };

  const saveEdit = async (id: string) => {
    try {
      await fetch("/api/automation/blog-to-social", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "edit", message: editMessage }),
      });
      setEditingId(null);
      await loadData();
    } catch (e) {
      console.error("Edit failed:", e);
    }
  };

  const totalDrafts = items.reduce((sum, item) =>
    sum + Object.values(item.channels).filter((c) => c.status === "draft").length, 0
  );
  const totalPosted = items.reduce((sum, item) =>
    sum + Object.values(item.channels).filter((c) => c.status === "posted").length, 0
  );
  const totalNotGenerated = items.filter((item) => Object.keys(item.channels).length === 0).length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Blog → Social Media</h1>
          <p className="text-sm text-black/60 mt-1">
            Auto-generate and approve social posts from your blog articles
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateAll}
            disabled={generating}
            className="px-4 py-2 bg-[#E91E8C] text-white font-semibold rounded-lg hover:bg-[#c90a68] transition-colors disabled:opacity-50 text-sm"
          >
            {generating ? "Generating..." : "Generate All Posts"}
          </button>
          {totalDrafts > 0 && (
            <button
              onClick={approveAll}
              disabled={approving}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
            >
              {approving ? "Approving..." : `Approve All Drafts (${totalDrafts})`}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-black/10 p-4 text-center">
          <div className="text-2xl font-bold text-black">{items.length}</div>
          <div className="text-xs text-black/50">Blog Articles</div>
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{totalDrafts}</div>
          <div className="text-xs text-black/50">Drafts Ready</div>
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totalPosted}</div>
          <div className="text-xs text-black/50">Posted</div>
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-4 text-center">
          <div className="text-2xl font-bold text-black/30">{totalNotGenerated}</div>
          <div className="text-xs text-black/50">Not Generated</div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-black/40">Loading blog articles...</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const channels = Object.entries(item.channels);
            const hasChannels = channels.length > 0;
            const isExpanded = expandedSlug === item.blog_slug;

            return (
              <div key={item.blog_slug} className="bg-white rounded-xl border border-black/10 overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => setExpandedSlug(isExpanded ? null : item.blog_slug)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-black/[0.02] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-black truncate">{item.blog_title}</div>
                    <div className="text-xs text-black/40 mt-1">
                      <Link href={`/blog/${item.blog_slug}`} className="text-[#E91E8C] hover:underline" onClick={(e) => e.stopPropagation()}>
                        View article
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    {hasChannels ? (
                      channels.map(([ch, post]) => {
                        const meta = CHANNEL_META[ch];
                        const badge = STATUS_BADGE[post.status] || STATUS_BADGE.not_generated;
                        return (
                          <span key={ch} className={`px-2 py-1 rounded-lg text-xs font-medium ${badge.bg} ${badge.text}`}>
                            {meta?.icon} {badge.label}
                          </span>
                        );
                      })
                    ) : (
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-black/5 text-black/40">
                        Not generated
                      </span>
                    )}
                    <svg className={`w-4 h-4 text-black/30 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-black/5 p-4">
                    {!hasChannels ? (
                      <div className="text-center py-6">
                        <p className="text-black/40 text-sm mb-3">No social posts generated for this article yet.</p>
                        <button
                          onClick={() => generateOne(item.blog_slug)}
                          className="px-4 py-2 bg-[#E91E8C] text-white font-semibold rounded-lg text-sm hover:bg-[#c90a68]"
                        >
                          Generate Posts
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {channels.map(([ch, post]) => {
                          const meta = CHANNEL_META[ch];
                          const badge = STATUS_BADGE[post.status] || STATUS_BADGE.not_generated;
                          const isEditing = editingId === post.id;

                          return (
                            <div key={ch} className="border border-black/10 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{meta?.icon}</span>
                                  <span className="font-semibold text-sm text-black">{meta?.label}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                    {badge.label}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  {post.status === "draft" && post.id && (
                                    <>
                                      <button
                                        onClick={() => { setEditingId(post.id!); setEditMessage(post.message); }}
                                        className="px-3 py-1 text-xs border border-black/20 rounded-lg hover:bg-black/5 text-black/70"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => approveOne(post.id!)}
                                        className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                                      >
                                        Approve
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {isEditing ? (
                                <div>
                                  <textarea
                                    value={editMessage}
                                    onChange={(e) => setEditMessage(e.target.value)}
                                    rows={6}
                                    className="w-full p-3 border border-black/20 rounded-lg text-sm text-black resize-none focus:outline-none focus:ring-2 focus:ring-[#E91E8C]"
                                  />
                                  <div className="flex gap-2 mt-2 justify-end">
                                    <button
                                      onClick={() => setEditingId(null)}
                                      className="px-3 py-1 text-xs border border-black/20 rounded-lg text-black/60"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => saveEdit(post.id!)}
                                      className="px-3 py-1 text-xs bg-[#E91E8C] text-white rounded-lg"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <pre className="text-sm text-black/70 whitespace-pre-wrap bg-black/[0.02] rounded-lg p-3 max-h-40 overflow-y-auto">
                                  {post.message}
                                </pre>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
