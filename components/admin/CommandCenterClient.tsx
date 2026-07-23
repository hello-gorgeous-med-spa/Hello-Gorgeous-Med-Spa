"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  CC_CAT_LABEL,
  CC_CHECKLIST,
  CC_DUE_LABEL,
  CC_MSG_FROM,
  CC_MSG_TEMPLATES,
  CC_MSG_TO,
  CC_STAFF,
  CC_TIME_OFF_TYPES,
  formatCcDateRange,
  type CcRemindAt,
  type CcStaffMessage,
  type CcTask,
  type CcTaskCat,
  type CcTaskDue,
  type CcTaskStatus,
  type CcTimeOff,
  type CcTimeOffType,
} from "@/lib/command-center";
import { getSession } from "@/lib/hgos/auth";
import CommandCenterOverview from "@/components/admin/CommandCenterOverview";
import CommandCenterShell from "@/components/admin/CommandCenterShell";

type View = "overview" | "team" | "marketing";
type Filter = "all" | "open" | "on_it" | "done";

const PINK = "#FF2D8E";

function chipStyle(active: boolean): CSSProperties {
  return {
    padding: "7px 14px",
    borderRadius: 999,
    border: active ? `2px solid ${PINK}` : "2px solid rgba(0,0,0,0.12)",
    background: active ? PINK : "#fff",
    color: active ? "#fff" : "#333",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
  };
}

function statusCycle(s: CcTaskStatus): CcTaskStatus {
  if (s === "open") return "on_it";
  if (s === "on_it") return "done";
  return "open";
}

function statusLabel(s: CcTaskStatus) {
  if (s === "on_it") return "On it";
  if (s === "done") return "Done";
  return "Open";
}

export default function CommandCenterClient() {
  const [role, setRole] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [view, setView] = useState<View>("team");
  const [tasks, setTasks] = useState<CcTask[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [composer, setComposer] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [cat, setCat] = useState<CcTaskCat>("task");
  const [due, setDue] = useState<CcTaskDue>("today");
  const [assignedTo, setAssignedTo] = useState("Danielle");
  const [remindAt, setRemindAt] = useState<CcRemindAt>("none");
  const [reply, setReply] = useState("");
  const [toast, setToast] = useState("");
  const [staffMessages, setStaffMessages] = useState<CcStaffMessage[]>([]);
  const [msgFrom, setMsgFrom] = useState<string>("Danielle");
  const [msgTo, setMsgTo] = useState<string>("Everyone");
  const [msgTemplate, setMsgTemplate] = useState(CC_MSG_TEMPLATES[0].label);
  const [msgText, setMsgText] = useState("");
  const [timeOff, setTimeOff] = useState<CcTimeOff[]>([]);
  const [toWho, setToWho] = useState("Michelle");
  const [toType, setToType] = useState<CcTimeOffType>("Vacation");
  const [toStart, setToStart] = useState("");
  const [toEnd, setToEnd] = useState("");
  const [toNote, setToNote] = useState("");
  const ownerLanded = useRef(false);

  const isOwner = role === "owner" || role === "admin";

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2000);
  };

  const load = useCallback(async () => {
    setError("");
    try {
      const sess = await getSession();
      const r = sess?.user.role || null;
      setRole(r);
      const name =
        [sess?.user.firstName, sess?.user.lastName].filter(Boolean).join(" ") ||
        sess?.user.email ||
        "";
      setDisplayName(name);
      if ((r === "owner" || r === "admin") && !ownerLanded.current) {
        ownerLanded.current = true;
        setView("overview");
      } else if (r !== "owner" && r !== "admin") {
        setView((v) => (v === "overview" ? "team" : v));
      }

      const [tRes, cRes, mRes, oRes] = await Promise.all([
        fetch("/api/admin/command-center/tasks"),
        fetch("/api/admin/command-center/checklist"),
        fetch("/api/admin/command-center/messages"),
        fetch("/api/admin/command-center/time-off"),
      ]);
      if (!tRes.ok) {
        const j = await tRes.json().catch(() => ({}));
        throw new Error(j.error || "Could not load tasks");
      }
      const tJson = await tRes.json();
      setTasks(tJson.tasks || []);
      if (cRes.ok) {
        const cJson = await cRes.json();
        setChecks(cJson.checks || {});
      }
      if (mRes.ok) {
        const mJson = await mRes.json();
        setStaffMessages(mJson.messages || []);
      }
      if (oRes.ok) {
        const oJson = await oRes.json();
        setTimeOff(oJson.requests || []);
      }
      if (name) {
        const match = CC_MSG_FROM.find(
          (n) => name.toLowerCase().includes(n.toLowerCase()),
        );
        if (match) setMsgFrom(match);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const openCount = tasks.filter((t) => t.status !== "done").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const checkIds = CC_CHECKLIST.flatMap((s) => s.items.map((i) => i.id));
  const checkDone = checkIds.filter((id) => checks[id]).length;
  const checkPct = checkIds.length
    ? Math.round((checkDone / checkIds.length) * 100)
    : 0;

  async function createTask() {
    if (!title.trim()) return;
    const res = await fetch("/api/admin/command-center/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        detail: detail.trim(),
        cat,
        due,
        assignedTo,
        remindAt,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(j.error || "Could not create task");
      return;
    }
    setTasks((prev) => [j.task, ...prev]);
    setTitle("");
    setDetail("");
    setComposer(false);
    showToast("Task assigned");
  }

  async function patchTask(id: string, body: Record<string, unknown>) {
    const res = await fetch("/api/admin/command-center/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(j.error || "Update failed");
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === id ? j.task : t)));
  }

  async function sendReply(taskId: string) {
    if (!reply.trim()) return;
    const res = await fetch("/api/admin/command-center/tasks/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, body: reply.trim() }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(j.error || "Reply failed");
      return;
    }
    setReply("");
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, thread: [...t.thread, j.message], updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  }

  async function toggleCheck(itemId: string) {
    const done = !checks[itemId];
    setChecks((c) => ({ ...c, [itemId]: done }));
    const res = await fetch("/api/admin/command-center/checklist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, done }),
    });
    if (!res.ok) {
      setChecks((c) => ({ ...c, [itemId]: !done }));
      showToast("Checklist save failed — is the migration applied?");
    }
  }

  const quickAdd = (preset: { title: string; cat: CcTaskCat }) => {
    setTitle(preset.title);
    setCat(preset.cat);
    setComposer(true);
  };

  async function sendStaffMessage() {
    const text = msgText.trim();
    if (!text) return;
    const res = await fetch("/api/admin/command-center/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: msgFrom, to: msgTo, text }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(j.error || "Send failed");
      return;
    }
    setStaffMessages((prev) => [j.message, ...prev]);
    setMsgText("");
    setMsgTemplate(CC_MSG_TEMPLATES[0].label);
    showToast(`Sent to ${msgTo}`);
  }

  async function submitTimeOff() {
    if (!toWho || !toStart) {
      showToast("Pick who + start date");
      return;
    }
    const res = await fetch("/api/admin/command-center/time-off", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        who: toWho,
        type: toType,
        start: toStart,
        end: toEnd,
        note: toNote,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(j.error || "Request failed");
      return;
    }
    setTimeOff((prev) => [j.request, ...prev]);
    setToStart("");
    setToEnd("");
    setToNote("");
    showToast("Time-off requested");
  }

  async function decideTimeOff(id: string, status: "approved" | "denied") {
    const res = await fetch("/api/admin/command-center/time-off", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(j.error || "Update failed");
      return;
    }
    setTimeOff((prev) => prev.map((r) => (r.id === id ? j.request : r)));
  }

  const toPendingCount = timeOff.filter((r) => r.status === "pending").length;

  const typePill: Record<CcTimeOffType, string> = {
    Vacation: "bg-[#FFE0F0] text-[#C90A68]",
    Sick: "bg-[#e7efff] text-[#2D63A4]",
    Personal: "bg-[#fef3c7] text-[#b45309]",
    Other: "bg-[#f2f2f2] text-[#666]",
  };

  return (
    <CommandCenterShell
      view={view}
      onViewChange={setView}
      isOwner={isOwner}
      role={role}
      displayName={displayName}
    >
      {error && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}{" "}
          <span className="text-amber-700">
            (Apply migration <code>20260723100000_command_center_team_hub.sql</code> if
            tables are missing.)
          </span>
        </div>
      )}

        {isOwner && (
          <div style={{ display: view === "overview" ? "block" : "none" }}>
            <CommandCenterOverview visible={view === "overview"} />
          </div>
        )}

        {/* MARKETING stub */}
        {view === "marketing" && (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: PINK }}>
              Sales &amp; marketing
            </div>
            <h1
              className="text-[32px] font-extrabold tracking-tight mt-1"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              The marketing hub
            </h1>
            <p className="text-[#666] text-sm mt-1 mb-6">
              Campaigns, templates, and Laura&apos;s Desk come next — managed by{" "}
              <strong style={{ color: PINK }}>Laura Witt</strong>.
            </p>
            <div className="bg-white border-2 border-black rounded-2xl p-8 text-center shadow-[0_10px_30px_rgba(255,45,142,0.12)]">
              <div className="text-lg font-bold">Coming in the next slice</div>
              <div className="text-sm text-[#888] mt-2">
                Use Text Studio and Post to Social for live sends today.
              </div>
            </div>
          </div>
        )}

        {/* TEAM HUB */}
        {view === "team" && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: PINK }}>
                  Front desk board
                </div>
                <h1
                  className="text-[32px] font-extrabold tracking-tight mt-1"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  Let&apos;s get it done,{" "}
                  <span style={{ color: PINK }}>gorgeous</span>.
                </h1>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-[#888]">Open </span>
                  <strong>{openCount}</strong>
                </div>
                <div>
                  <span className="text-[#888]">Done </span>
                  <strong>{doneCount}</strong>
                </div>
                <div>
                  <span className="text-[#888]">Checklist </span>
                  <strong>{checkPct}%</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-4">
              {/* Tasks */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setComposer(true)}
                    className="rounded-full bg-black text-white px-4 py-2 text-sm font-bold"
                  >
                    + New task
                  </button>
                  {[
                    { title: "Call a client", cat: "call" as const },
                    { title: "Order supplies", cat: "order" as const },
                    { title: "Call in Rx", cat: "rx" as const },
                    { title: "Send a fax", cat: "fax" as const },
                  ].map((q) => (
                    <button
                      key={q.title}
                      type="button"
                      onClick={() => quickAdd(q)}
                      style={chipStyle(false)}
                    >
                      {q.title}
                    </button>
                  ))}
                </div>

                {composer && (
                  <div className="bg-white border-2 border-black rounded-2xl p-5 mb-4 shadow-[0_10px_30px_rgba(255,45,142,0.12)]">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Task title"
                      className="w-full border border-black/15 rounded-lg px-3 py-2.5 text-sm mb-2"
                    />
                    <textarea
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      placeholder="Notes (optional)"
                      rows={2}
                      className="w-full border border-black/15 rounded-lg px-3 py-2.5 text-sm mb-3"
                    />
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(Object.keys(CC_CAT_LABEL) as CcTaskCat[]).map((c) => (
                        <button key={c} type="button" onClick={() => setCat(c)} style={chipStyle(cat === c)}>
                          {CC_CAT_LABEL[c]}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(Object.keys(CC_DUE_LABEL) as CcTaskDue[]).map((d) => (
                        <button key={d} type="button" onClick={() => setDue(d)} style={chipStyle(due === d)}>
                          {CC_DUE_LABEL[d]}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <label className="text-xs font-bold uppercase tracking-wide text-[#888]">
                        Assign to
                      </label>
                      <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="border border-black/15 rounded-lg px-3 py-2 text-sm"
                      >
                        {CC_STAFF.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <select
                        value={remindAt}
                        onChange={(e) => setRemindAt(e.target.value as CcRemindAt)}
                        className="border border-black/15 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="none">No reminder</option>
                        <option value="9am">Remind 9 AM</option>
                        <option value="lunch">Before lunch</option>
                        <option value="2pm">2 PM</option>
                        <option value="eod">End of day</option>
                      </select>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setComposer(false)}
                        className="px-4 py-2 rounded-lg border-2 border-black font-bold text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => void createTask()}
                        className="px-4 py-2 rounded-lg font-bold text-sm text-white"
                        style={{ background: PINK }}
                      >
                        Assign to {assignedTo}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mb-3">
                  {(["all", "open", "on_it", "done"] as Filter[]).map((f) => (
                    <button key={f} type="button" onClick={() => setFilter(f)} style={chipStyle(filter === f)}>
                      {f === "on_it" ? "In progress" : f[0].toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className="text-sm text-[#888]">Loading…</div>
                ) : filtered.length === 0 ? (
                  <div className="bg-white border border-dashed border-black/20 rounded-2xl p-10 text-center text-[#888]">
                    No tasks yet — add one for the front desk.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filtered.map((t) => {
                      const open = expanded === t.id;
                      return (
                        <div
                          key={t.id}
                          className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden"
                        >
                          <button
                            type="button"
                            className="w-full text-left p-4 flex flex-wrap items-start gap-3"
                            onClick={() => setExpanded(open ? null : t.id)}
                          >
                            <span
                              className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-full"
                              style={{ background: "rgba(255,45,142,0.12)", color: "#C90A68" }}
                            >
                              {CC_CAT_LABEL[t.cat]}
                            </span>
                            <div className="flex-1 min-w-[160px]">
                              <div className="font-bold text-[15px]">{t.title}</div>
                              <div className="text-xs text-[#999] mt-0.5">
                                {t.assignedTo ? `→ ${t.assignedTo}` : "Unassigned"} ·{" "}
                                {CC_DUE_LABEL[t.due]}
                                {t.thread.length ? ` · ${t.thread.length} replies` : ""}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                void patchTask(t.id, { status: statusCycle(t.status) });
                              }}
                              className="px-3 py-1.5 rounded-lg border border-black text-xs font-bold"
                            >
                              {statusLabel(t.status)}
                            </button>
                          </button>
                          {open && (
                            <div className="px-4 pb-4 border-t border-black/5 pt-3">
                              {t.detail && (
                                <p className="text-sm text-[#555] mb-3">{t.detail}</p>
                              )}
                              <div className="flex flex-col gap-2 mb-3 max-h-48 overflow-y-auto">
                                {t.thread.map((m) => (
                                  <div
                                    key={m.id}
                                    className="rounded-xl px-3 py-2 text-sm"
                                    style={{
                                      background: "rgba(255,45,142,0.08)",
                                      alignSelf: "stretch",
                                    }}
                                  >
                                    <span className="font-bold text-xs" style={{ color: PINK }}>
                                      {m.author}
                                    </span>
                                    <div>{m.body}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  value={reply}
                                  onChange={(e) => setReply(e.target.value)}
                                  placeholder="Reply…"
                                  className="flex-1 border border-black/15 rounded-lg px-3 py-2 text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") void sendReply(t.id);
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => void sendReply(t.id)}
                                  className="px-3 py-2 rounded-lg text-white text-sm font-bold"
                                  style={{ background: PINK }}
                                >
                                  Send
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Checklist */}
              <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[0_10px_30px_rgba(255,45,142,0.12)] h-fit">
                <div className="flex justify-between items-baseline mb-2">
                  <h2
                    className="text-[18px] font-bold"
                    style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                  >
                    Daily operations
                  </h2>
                  <span className="text-sm font-bold" style={{ color: PINK }}>
                    {checkPct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#FFE0F0] mb-4 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${checkPct}%`, background: PINK }}
                  />
                </div>
                <p className="text-xs text-[#999] mb-4">Resets each morning (Chicago date).</p>
                {CC_CHECKLIST.map((sec) => (
                  <div key={sec.id} className="mb-5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#888] mb-2">
                      {sec.label}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {sec.items.map((item) => {
                        const done = !!checks[item.id];
                        return (
                          <label
                            key={item.id}
                            className="flex items-start gap-2.5 cursor-pointer py-1.5"
                          >
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={() => void toggleCheck(item.id)}
                              className="mt-0.5 w-4 h-4 accent-[#FF2D8E]"
                            />
                            <span
                              className="text-sm"
                              style={{
                                textDecoration: done ? "line-through" : "none",
                                color: done ? "#aaa" : "#222",
                              }}
                            >
                              {item.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consent forms — today (shell; Square schedule wires next) */}
            <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[0_8px_26px_rgba(0,0,0,0.06)] mt-[18px]">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h2
                  className="text-[19px] font-bold m-0"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  Consent forms — today
                </h2>
                <span className="text-[12.5px] font-bold text-[#C90A68]">0/0 signed &amp; ready</span>
              </div>
              <p className="mt-1 mb-3 text-[12.5px] text-[#999]">
                Every client needs a signed consent before treatment — we screen like a medical
                practice.
              </p>
              <div className="h-2 rounded-full bg-[#FFE0F0] overflow-hidden mb-[18px]">
                <div className="h-full rounded-full w-0" style={{ background: PINK }} />
              </div>
              <div className="border border-dashed border-black/20 rounded-xl px-4 py-[26px] text-center text-[13px] text-[#aaa]">
                No clients on today&apos;s schedule yet.
              </div>
            </div>

            {/* Staff messages */}
            <div className="bg-white border border-black/10 rounded-[18px] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] mt-[18px]">
              <h2
                className="text-[19px] font-bold m-0 mb-1"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Staff messages
              </h2>
              <p className="m-0 mb-4 text-[12.5px] text-[#999]">
                Send a quick note to one teammate or the whole team — pick a template or write your
                own.
              </p>

              <div className="flex gap-3 flex-wrap mb-3">
                <label className="flex-1 min-w-[140px]">
                  <div className="text-[11px] tracking-wider uppercase text-[#999] font-bold mb-1.5">
                    From
                  </div>
                  <select
                    value={msgFrom}
                    onChange={(e) => setMsgFrom(e.target.value)}
                    className="w-full border border-black/15 rounded-[10px] px-3 py-2.5 text-sm bg-white cursor-pointer"
                  >
                    {CC_MSG_FROM.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex-1 min-w-[140px]">
                  <div className="text-[11px] tracking-wider uppercase text-[#999] font-bold mb-1.5">
                    To
                  </div>
                  <select
                    value={msgTo}
                    onChange={(e) => setMsgTo(e.target.value)}
                    className="w-full border border-black/15 rounded-[10px] px-3 py-2.5 text-sm bg-white cursor-pointer"
                  >
                    {CC_MSG_TO.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex-[1.4] min-w-[190px]">
                  <div className="text-[11px] tracking-wider uppercase text-[#999] font-bold mb-1.5">
                    Template
                  </div>
                  <select
                    value={msgTemplate}
                    onChange={(e) => {
                      const label = e.target.value;
                      setMsgTemplate(label);
                      const t = CC_MSG_TEMPLATES.find((x) => x.label === label);
                      setMsgText(t?.text || "");
                    }}
                    className="w-full border border-black/15 rounded-[10px] px-3 py-2.5 text-sm bg-white cursor-pointer"
                  >
                    {CC_MSG_TEMPLATES.map((o) => (
                      <option key={o.label} value={o.label}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <textarea
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                rows={3}
                placeholder="Write your message..."
                className="w-full border border-black/15 rounded-[10px] px-3.5 py-3 text-sm leading-relaxed resize-y"
              />
              <div className="flex justify-end mt-2.5">
                <button
                  type="button"
                  onClick={() => void sendStaffMessage()}
                  className="text-white border-none rounded-[10px] px-6 py-2.5 text-sm font-bold cursor-pointer"
                  style={{ background: PINK }}
                >
                  Send to {msgTo}
                </button>
              </div>

              <div className="border-t border-black/10 mt-[18px] pt-4">
                <div className="text-[11px] tracking-widest uppercase text-[#aaa] font-bold mb-3">
                  Recent messages
                </div>
                <div className="flex flex-col gap-3">
                  {staffMessages.length === 0 && (
                    <div className="border border-dashed border-black/20 rounded-xl px-4 py-[22px] text-center text-[13px] text-[#aaa]">
                      No messages yet.
                    </div>
                  )}
                  {staffMessages.map((m) => (
                    <div key={m.id} className="flex gap-2.5 items-start">
                      <div className="w-[34px] h-[34px] rounded-full bg-black text-white flex items-center justify-center text-[13px] font-bold shrink-0">
                        {(m.from || "?").slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px]">
                          <strong>{m.from}</strong>{" "}
                          <span className="font-bold" style={{ color: PINK }}>
                            →
                          </span>{" "}
                          <strong>{m.to}</strong>{" "}
                          <span className="text-[#bbb]">· {m.time}</span>
                        </div>
                        <div className="text-[13.5px] text-[#333] mt-1 bg-[#faf7f8] rounded-[10px] px-3.5 py-2.5">
                          {m.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Time-off requests */}
            <div className="bg-white border border-black/10 rounded-[18px] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] mt-[18px]">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h2
                  className="text-[19px] font-bold m-0"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  Time-off requests
                </h2>
                <span className="text-xs text-[#999]">
                  {toPendingCount} pending owner approval
                </span>
              </div>
              <p className="mt-1 mb-3.5 text-[12.5px] text-[#999]">
                Everyone can see requests — the owner approves or denies.
              </p>

              <div className="flex gap-3 flex-wrap items-end border border-black/10 rounded-xl p-3.5 mb-4 bg-[#fafafa]">
                <div>
                  <div className="text-[10.5px] tracking-wider uppercase text-[#999] font-bold mb-1.5">
                    Who
                  </div>
                  <select
                    value={toWho}
                    onChange={(e) => setToWho(e.target.value)}
                    className="border border-black/15 rounded-[9px] px-3 py-2 text-[13px] bg-white cursor-pointer"
                  >
                    {CC_STAFF.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-[10.5px] tracking-wider uppercase text-[#999] font-bold mb-1.5">
                    Type
                  </div>
                  <select
                    value={toType}
                    onChange={(e) => setToType(e.target.value as CcTimeOffType)}
                    className="border border-black/15 rounded-[9px] px-3 py-2 text-[13px] bg-white cursor-pointer"
                  >
                    {CC_TIME_OFF_TYPES.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-[10.5px] tracking-wider uppercase text-[#999] font-bold mb-1.5">
                    From
                  </div>
                  <input
                    type="date"
                    value={toStart}
                    onChange={(e) => setToStart(e.target.value)}
                    className="border border-black/15 rounded-[9px] px-2.5 py-2 text-[13px]"
                  />
                </div>
                <div>
                  <div className="text-[10.5px] tracking-wider uppercase text-[#999] font-bold mb-1.5">
                    To
                  </div>
                  <input
                    type="date"
                    value={toEnd}
                    onChange={(e) => setToEnd(e.target.value)}
                    className="border border-black/15 rounded-[9px] px-2.5 py-2 text-[13px]"
                  />
                </div>
                <input
                  value={toNote}
                  onChange={(e) => setToNote(e.target.value)}
                  placeholder="Reason (optional)"
                  className="flex-1 min-w-[150px] border border-black/15 rounded-[9px] px-3 py-2 text-[13px]"
                />
                <button
                  type="button"
                  onClick={() => void submitTimeOff()}
                  className="text-white border-none rounded-[9px] px-5 py-2.5 text-[13px] font-bold cursor-pointer"
                  style={{ background: PINK }}
                >
                  Request
                </button>
              </div>

              {timeOff.length === 0 && (
                <div className="border border-dashed border-black/20 rounded-xl px-4 py-[26px] text-center text-[13px] text-[#aaa]">
                  No time-off requests yet.
                </div>
              )}
              <div className="flex flex-col gap-2.5">
                {timeOff.map((r) => {
                  const statusLabel =
                    r.status === "approved"
                      ? "Approved ✓"
                      : r.status === "denied"
                        ? "Denied"
                        : "Pending";
                  const statusClass =
                    r.status === "approved"
                      ? "bg-green-600/10 text-[#16a34a]"
                      : r.status === "denied"
                        ? "bg-[#fde8ef] text-[#9b0b52]"
                        : "bg-[#111] text-white";
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between gap-3 flex-wrap border border-black/10 rounded-xl px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-bold">
                          {r.who}{" "}
                          <span
                            className={`text-[10.5px] font-bold rounded-full px-2 py-0.5 ml-1.5 ${typePill[r.type]}`}
                          >
                            {r.type}
                          </span>
                        </div>
                        <div className="text-[12.5px] text-[#666] mt-0.5">
                          {formatCcDateRange(r.start, r.end)}
                        </div>
                        {r.note ? (
                          <div className="text-xs text-[#aaa] mt-0.5">{r.note}</div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`text-xs font-bold rounded-full px-3 py-1 whitespace-nowrap ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                        {isOwner && r.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => void decideTimeOff(r.id, "approved")}
                              className="bg-[#16a34a] text-white border-none rounded-lg px-3.5 py-2 text-[12.5px] font-bold cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => void decideTimeOff(r.id, "denied")}
                              className="bg-white text-[#111] border-2 border-black rounded-lg px-3 py-1.5 text-[12.5px] font-bold cursor-pointer"
                            >
                              Deny
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </CommandCenterShell>
  );
}
