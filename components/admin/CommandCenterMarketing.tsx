"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CC_LAURA_HOURS_GOAL,
  CC_LAURA_PRODUCTIVITY_LINKS,
  CC_LAURA_TASK_CATEGORIES,
  CC_LAURA_WEEK_CHECKS,
  CC_LAURA_WEEKLY_RATE,
  type CcLauraHour,
  type CcLauraTask,
  type CcLauraTaskCategory,
} from "@/lib/command-center";
import Link from "next/link";

const PINK = "#FF2D8E";

type MktSub = "campaigns" | "templates" | "resources" | "laura";

type UploadRow = {
  id: string;
  name: string;
  size: string;
  url?: string;
  mine?: boolean;
};

type Props = {
  isOwner: boolean;
  onToast: (msg: string) => void;
};

function fmtSize(b: number): string {
  if (b > 1048576) return `${(b / 1048576).toFixed(1)} MB`;
  if (b > 1024) return `${Math.round(b / 1024)} KB`;
  return `${b} B`;
}

export default function CommandCenterMarketing({ isOwner, onToast }: Props) {
  const [mktSub, setMktSub] = useState<MktSub>("campaigns");
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [lauraModal, setLauraModal] = useState(false);
  const [lauraCode, setLauraCode] = useState("");
  const [lauraErr, setLauraErr] = useState(false);
  const [lauraErrMsg, setLauraErrMsg] = useState("");
  const [lauraUnlocked, setLauraUnlocked] = useState(isOwner);
  const [hours, setHours] = useState<CcLauraHour[]>([]);
  const [weekChecks, setWeekChecks] = useState<Record<string, boolean>>({});
  const [invoiceSubmitted, setInvoiceSubmitted] = useState(false);
  const [newHrTask, setNewHrTask] = useState("");
  const [newHrHrs, setNewHrHrs] = useState("");
  const [tasks, setTasks] = useState<CcLauraTask[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskOrg, setTaskOrg] = useState("");
  const [taskCategory, setTaskCategory] = useState<CcLauraTaskCategory>("meeting");
  const [taskWhen, setTaskWhen] = useState("");
  const [taskWhere, setTaskWhere] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [outcomeDraft, setOutcomeDraft] = useState<Record<string, string>>({});

  const loadLaura = useCallback(async () => {
    const res = await fetch("/api/admin/command-center/laura");
    if (!res.ok) return;
    const j = await res.json();
    setLauraUnlocked(!!j.unlocked);
    if (j.unlocked) {
      setHours(j.hours || []);
      setWeekChecks(j.checks || {});
      setInvoiceSubmitted(!!j.invoiceSubmitted);
      setTasks(j.tasks || []);
    }
  }, []);

  useEffect(() => {
    if (mktSub === "laura") void loadLaura();
  }, [mktSub, loadLaura]);

  useEffect(() => {
    if (isOwner) setLauraUnlocked(true);
  }, [isOwner]);

  const nav: { id: MktSub; label: string }[] = [
    { id: "campaigns", label: "Campaigns" },
    { id: "templates", label: "Templates" },
    { id: "resources", label: "Resources" },
    { id: "laura", label: "🔒 Laura’s Desk" },
  ];

  const hoursTotal = useMemo(
    () => hours.reduce((a, h) => a + Number(h.hrs || 0), 0),
    [hours],
  );
  const hoursPct = Math.min(100, Math.round((hoursTotal / CC_LAURA_HOURS_GOAL) * 100));

  async function unlockLaura() {
    setLauraErr(false);
    setLauraErrMsg("");
    const res = await fetch("/api/admin/command-center/laura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unlock", code: lauraCode.trim() }),
      credentials: "same-origin",
    });
    if (!res.ok) {
      if (res.status === 401) {
        setLauraErrMsg("Session expired — sign in again at /login, then retry.");
      } else if (res.status === 403) {
        setLauraErr(true);
      } else {
        const j = await res.json().catch(() => ({}));
        setLauraErrMsg(
          typeof j.error === "string" ? j.error : "Could not unlock — try again.",
        );
      }
      return;
    }
    setLauraModal(false);
    setLauraCode("");
    setLauraUnlocked(true);
    await loadLaura();
  }

  async function addHours() {
    const task = newHrTask.trim();
    const hrs = parseFloat(newHrHrs);
    if (!task || !hrs) return;
    const res = await fetch("/api/admin/command-center/laura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "hours", task, hrs }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      onToast(j.error || "Could not log hours");
      return;
    }
    setHours((prev) => [...prev, j.hour]);
    setNewHrTask("");
    setNewHrHrs("");
  }

  async function toggleWeek(id: string) {
    const next = { ...weekChecks, [id]: !weekChecks[id] };
    setWeekChecks(next);
    const res = await fetch("/api/admin/command-center/laura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "week", checks: next }),
    });
    if (!res.ok) setWeekChecks(weekChecks);
  }

  async function submitInvoice() {
    if (invoiceSubmitted) return;
    const res = await fetch("/api/admin/command-center/laura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "week", invoiceSubmitted: true, checks: weekChecks }),
    });
    if (!res.ok) {
      onToast("Invoice submit failed");
      return;
    }
    setInvoiceSubmitted(true);
    onToast("Weekly plan + invoice submitted");
  }

  async function createTask() {
    const title = taskTitle.trim();
    if (!title) return;
    const res = await fetch("/api/admin/command-center/laura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "task_create",
        title,
        orgName: taskOrg.trim(),
        category: taskCategory,
        scheduledLocal: taskWhen || undefined,
        locationOrLink: taskWhere.trim(),
        notes: taskNotes.trim(),
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      onToast(j.error || "Could not schedule meeting");
      return;
    }
    setTasks((prev) => [...prev, j.task]);
    setTaskTitle("");
    setTaskOrg("");
    setTaskWhen("");
    setTaskWhere("");
    setTaskNotes("");
    onToast("Meeting / task scheduled");
  }

  async function updateTaskStatus(id: string, status: CcLauraTask["status"], outcome?: string) {
    const res = await fetch("/api/admin/command-center/laura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "task_update",
        id,
        status,
        outcome: outcome ?? outcomeDraft[id] ?? "",
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      onToast(j.error || "Update failed");
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === id ? j.task : t)));
  }

  async function deleteTask(id: string) {
    const res = await fetch("/api/admin/command-center/laura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "task_delete", id }),
    });
    if (!res.ok) {
      onToast("Could not delete");
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function formatTaskWhen(iso: string | null) {
    if (!iso) return "No date set";
    try {
      return new Date(iso).toLocaleString("en-US", {
        timeZone: "America/Chicago",
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  const categoryLabel = (id: string) =>
    CC_LAURA_TASK_CATEGORIES.find((c) => c.id === id)?.label || id;

  const upcomingTasks = useMemo(
    () => tasks.filter((t) => t.status === "scheduled"),
    [tasks],
  );
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === "completed").slice(-12).reverse(),
    [tasks],
  );

  function onFilePick(files: FileList | null) {
    if (!files?.length) return;
    const added: UploadRow[] = Array.from(files).map((f, i) => ({
      id: `u${Date.now()}${i}`,
      name: f.name,
      size: fmtSize(f.size),
      url: URL.createObjectURL(f),
      mine: true,
    }));
    setUploads((prev) => [...added, ...prev]);
    onToast(
      `${files.length} file${files.length > 1 ? "s" : ""} uploaded to shared assets`,
    );
  }

  function downloadRes(r: UploadRow) {
    const a = document.createElement("a");
    if (r.url) {
      a.href = r.url;
      a.download = r.name;
    } else {
      const blob = new Blob(
        [
          `Hello Gorgeous Med Spa — ${r.name}\n\nSample marketing asset placeholder. Replace with the real file once connected to your library.`,
        ],
        { type: "text/plain" },
      );
      a.href = URL.createObjectURL(blob);
      a.download = `${r.name.replace(/[^a-z0-9]+/gi, "_")}.txt`;
    }
    document.body.appendChild(a);
    a.click();
    a.remove();
    onToast(`Downloading “${r.name}”`);
  }

  return (
    <div>
      <div className="mb-[18px]">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: PINK }}>
          Sales &amp; Marketing
        </div>
        <h1
          className="text-[30px] font-extrabold tracking-tight mt-1"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          The marketing hub
        </h1>
        <p className="mt-1 text-sm text-[#666]">
          Campaigns, templates &amp; assets for the whole team — managed by{" "}
          <strong>Laura Witt</strong>.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {nav.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setMktSub(n.id)}
            className="text-[13px] font-bold px-4 py-2 rounded-full border cursor-pointer"
            style={{
              background: mktSub === n.id ? "#000" : "#fff",
              color: mktSub === n.id ? "#fff" : "#666",
              borderColor: mktSub === n.id ? "#000" : "rgba(0,0,0,0.14)",
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      {mktSub === "campaigns" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 border border-dashed border-black/20 rounded-xl px-4 py-[30px] text-center text-[13px] text-[#aaa]">
            No campaigns yet.
          </div>
        </div>
      )}

      {mktSub === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="md:col-span-2 border border-dashed border-black/20 rounded-xl px-4 py-[30px] text-center text-[13px] text-[#aaa]">
            No templates yet.
          </div>
        </div>
      )}

      {mktSub === "resources" && (
        <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-1.5">
            <h2
              className="text-[18px] font-bold m-0"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Shared assets
            </h2>
            <label className="bg-black text-white rounded-[9px] px-4 py-2.5 text-[13px] font-bold cursor-pointer inline-flex items-center gap-1.5">
              ↑ Upload
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  onFilePick(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <p className="m-0 mb-3.5 text-[12.5px] text-[#999]">
            Download and use across your own social pages — keep it on-brand.
          </p>
          <div className="flex flex-col gap-2.5">
            {uploads.length === 0 && (
              <div className="border border-dashed border-black/20 rounded-xl px-4 py-[26px] text-center text-[13px] text-[#aaa]">
                No shared assets yet — use <strong>Upload</strong> to add the first.
              </div>
            )}
            {uploads.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 border border-black/10 rounded-[11px] px-3.5 py-3"
              >
                <div>
                  <div className="text-[13.5px] font-bold">
                    {r.name}{" "}
                    {r.mine ? (
                      <span className="text-[10px] font-bold text-white rounded-full px-2 py-0.5 ml-1" style={{ background: PINK }}>
                        Yours
                      </span>
                    ) : null}
                  </div>
                  <div className="text-[11.5px] text-[#aaa]">{r.size}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToast("Link copied")}
                    className="bg-white text-black border-2 border-black rounded-lg px-3 py-1.5 text-xs font-bold"
                  >
                    Copy link
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadRes(r)}
                    className="text-white border-none rounded-lg px-3 py-1.5 text-xs font-bold"
                    style={{ background: PINK }}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mktSub === "laura" && !lauraUnlocked && (
        <div className="bg-black text-white rounded-[18px] px-7 py-11 text-center shadow-[0_10px_30px_rgba(255,45,142,0.2)]">
          <div className="text-4xl">🔒</div>
          <div
            className="text-2xl font-extrabold mt-2 mb-1.5"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Laura&apos;s Desk
          </div>
          <p className="mx-auto mb-[18px] text-[13.5px] text-white/70 max-w-[420px]">
            Private accountability &amp; reporting — access for Laura and the owner only.
          </p>
          <button
            type="button"
            onClick={() => {
              setLauraModal(true);
              setLauraErr(false);
              setLauraErrMsg("");
              setLauraCode("");
            }}
            className="text-white border-none rounded-[10px] px-6 py-3 text-sm font-bold cursor-pointer"
            style={{ background: PINK }}
          >
            Enter access code
          </button>
        </div>
      )}

      {mktSub === "laura" && lauraUnlocked && (
        <div className="flex flex-col gap-4">
          {/* Productivity toolkit — existing HG tools */}
          <div className="bg-white border-2 border-black rounded-2xl px-5 py-5">
            <h2
              className="text-[18px] font-bold m-0"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Productivity toolkit
            </h2>
            <p className="m-0 mt-1 mb-4 text-[12.5px] text-[#888]">
              Use these every week — then log the work as hours + meetings above so Danielle can see
              the pipeline.
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {CC_LAURA_PRODUCTIVITY_LINKS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-[12px] border border-black/10 bg-[#FFF5F9]/50 px-3.5 py-3 hover:border-[#FF2D8E]/50 transition-colors"
                >
                  <div className="text-[13px] font-bold text-[#111]">{tool.label} →</div>
                  <div className="text-[11px] text-[#888] mt-0.5 leading-snug">{tool.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Meetings & outreach calendar */}
          <div className="bg-white border-2 border-black rounded-2xl px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h2
                  className="text-[18px] font-bold m-0"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  Meetings &amp; outreach
                </h2>
                <p className="m-0 mt-1 text-[12.5px] text-[#888]">
                  Schedule Chamber, business meetings, and follow-ups — Danielle sees what&apos;s on
                  the book and what got done.
                </p>
              </div>
              <div className="text-[12px] font-bold text-[#C90A68]">
                {upcomingTasks.length} upcoming · {completedTasks.length} completed recently
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 mb-3">
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Meeting title *"
                className="border border-black/15 rounded-[9px] px-3 py-2 text-[13px]"
              />
              <input
                value={taskOrg}
                onChange={(e) => setTaskOrg(e.target.value)}
                placeholder="Org / business (e.g. Oswego Chamber)"
                className="border border-black/15 rounded-[9px] px-3 py-2 text-[13px]"
              />
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value as CcLauraTaskCategory)}
                className="border border-black/15 rounded-[9px] px-3 py-2 text-[13px] bg-white"
              >
                {CC_LAURA_TASK_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={taskWhen}
                onChange={(e) => setTaskWhen(e.target.value)}
                className="border border-black/15 rounded-[9px] px-3 py-2 text-[13px]"
              />
              <input
                value={taskWhere}
                onChange={(e) => setTaskWhere(e.target.value)}
                placeholder="Location or Zoom link"
                className="border border-black/15 rounded-[9px] px-3 py-2 text-[13px]"
              />
              <input
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                placeholder="Notes / goal"
                className="border border-black/15 rounded-[9px] px-3 py-2 text-[13px]"
              />
            </div>
            <button
              type="button"
              onClick={() => void createTask()}
              className="text-white border-none rounded-[9px] px-4 py-2.5 text-[13px] font-bold"
              style={{ background: PINK }}
            >
              + Schedule meeting / task
            </button>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-2">
                  Upcoming
                </p>
                {upcomingTasks.length === 0 ? (
                  <div className="border border-dashed border-black/20 rounded-[10px] px-3.5 py-6 text-center text-[12.5px] text-[#aaa]">
                    Nothing scheduled — add Chamber or business meetings above.
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {upcomingTasks.map((t) => (
                      <li
                        key={t.id}
                        className="border border-black/10 rounded-[10px] px-3 py-3 bg-[#FFF5F9]/40"
                      >
                        <div className="flex justify-between gap-2 items-start">
                          <div className="min-w-0">
                            <div className="text-[13px] font-bold">{t.title}</div>
                            <div className="text-[11px] text-[#888]">
                              {categoryLabel(t.category)}
                              {t.orgName ? ` · ${t.orgName}` : ""}
                            </div>
                            <div className="text-[12px] font-semibold text-[#C90A68] mt-0.5">
                              {formatTaskWhen(t.scheduledAt)}
                            </div>
                            {t.locationOrLink ? (
                              <div className="text-[11px] text-[#666] mt-0.5 truncate">
                                {t.locationOrLink}
                              </div>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => void deleteTask(t.id)}
                            className="text-[11px] text-[#999] hover:text-red-600 shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          value={outcomeDraft[t.id] || ""}
                          onChange={(e) =>
                            setOutcomeDraft((prev) => ({ ...prev, [t.id]: e.target.value }))
                          }
                          placeholder="Outcome / next step after meeting"
                          className="mt-2 w-full border border-black/10 rounded-lg px-2.5 py-1.5 text-[12px]"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => void updateTaskStatus(t.id, "completed")}
                            className="rounded-lg bg-black text-white text-[11px] font-bold px-3 py-1.5"
                          >
                            Mark done
                          </button>
                          <button
                            type="button"
                            onClick={() => void updateTaskStatus(t.id, "cancelled")}
                            className="rounded-lg border border-black/15 text-[11px] font-bold px-3 py-1.5"
                          >
                            Cancelled
                          </button>
                          <button
                            type="button"
                            onClick={() => void updateTaskStatus(t.id, "no_show")}
                            className="rounded-lg border border-black/15 text-[11px] font-bold px-3 py-1.5"
                          >
                            No-show
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-2">
                  Completed (accountability)
                </p>
                {completedTasks.length === 0 ? (
                  <div className="border border-dashed border-black/20 rounded-[10px] px-3.5 py-6 text-center text-[12.5px] text-[#aaa]">
                    Completed meetings show here with outcomes.
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {completedTasks.map((t) => (
                      <li key={t.id} className="border border-black/10 rounded-[10px] px-3 py-2.5">
                        <div className="text-[13px] font-semibold">{t.title}</div>
                        <div className="text-[11px] text-[#888]">
                          {categoryLabel(t.category)}
                          {t.orgName ? ` · ${t.orgName}` : ""} · {formatTaskWhen(t.scheduledAt)}
                        </div>
                        {t.outcome ? (
                          <p className="m-0 mt-1.5 text-[12px] text-[#333]">{t.outcome}</p>
                        ) : (
                          <p className="m-0 mt-1.5 text-[11px] text-[#aaa] italic">No outcome noted</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
          <div className="flex flex-col gap-4">
            <div
              className="text-white rounded-2xl px-5 py-5"
              style={{ background: "linear-gradient(150deg,#000,#3a0a24)" }}
            >
              <div className="text-[11px] tracking-widest uppercase font-bold" style={{ color: PINK }}>
                Agreement
              </div>
              <div
                className="text-[22px] font-extrabold mt-1.5 mb-0.5"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                $25/hr × 10 hrs/week = ${CC_LAURA_WEEKLY_RATE}
              </div>
              <div className="text-[12.5px] text-white/65">
                Tracked weekly — hours, meetings, and checklist — not just word of mouth.
              </div>
            </div>

            <div className="bg-white border-2 border-black rounded-2xl px-5 py-5">
              <div className="flex justify-between items-baseline">
                <h2
                  className="text-[18px] font-bold m-0"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  Hours this week
                </h2>
                <span className="text-[13px] font-extrabold text-[#C90A68]">
                  {hoursTotal} / {CC_LAURA_HOURS_GOAL} hrs
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#FFE0F0] overflow-hidden my-3">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${hoursPct}%`, background: PINK }}
                />
              </div>
              <div className="flex flex-col gap-2 mb-3.5">
                {hours.length === 0 && (
                  <div className="border border-dashed border-black/20 rounded-[10px] px-3.5 py-5 text-center text-[12.5px] text-[#aaa]">
                    No hours logged this week.
                  </div>
                )}
                {hours.map((h) => (
                  <div
                    key={h.id}
                    className="flex justify-between gap-2.5 border border-black/10 rounded-[10px] px-3 py-2.5"
                  >
                    <div>
                      <div className="text-[13px] font-semibold">{h.task}</div>
                      <div className="text-[11px] text-[#aaa]">{h.date}</div>
                    </div>
                    <div className="text-[13px] font-extrabold whitespace-nowrap">{h.hrs} h</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <input
                  value={newHrTask}
                  onChange={(e) => setNewHrTask(e.target.value)}
                  placeholder="What did you work on?"
                  className="flex-1 min-w-[150px] border border-black/15 rounded-[9px] px-3 py-2 text-[13px]"
                />
                <input
                  value={newHrHrs}
                  onChange={(e) => setNewHrHrs(e.target.value)}
                  placeholder="Hrs"
                  type="number"
                  className="w-[66px] border border-black/15 rounded-[9px] px-2.5 py-2 text-[13px]"
                />
                <button
                  type="button"
                  onClick={() => void addHours()}
                  className="text-white border-none rounded-[9px] px-4 py-2 text-[13px] font-bold"
                  style={{ background: PINK }}
                >
                  Log
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white border border-black/10 rounded-2xl px-5 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <h2
                className="text-[18px] font-bold m-0 mb-1"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Monday invoice
              </h2>
              <p className="m-0 mb-3 text-[12.5px] text-[#999]">
                Submit your weekly plan + invoice every Monday.
              </p>
              <div className="flex justify-between items-center rounded-xl px-4 py-3.5 mb-3 bg-[#FFF5F9]">
                <div>
                  <div className="text-xs text-[#888]">This week</div>
                  <div
                    className="text-2xl font-extrabold text-[#C90A68]"
                    style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                  >
                    $250.00
                  </div>
                </div>
                <span
                  className={`text-xs font-bold rounded-full px-3 py-1 ${
                    invoiceSubmitted
                      ? "bg-green-600/10 text-[#16a34a]"
                      : "bg-[#111] text-white"
                  }`}
                >
                  {invoiceSubmitted ? "Submitted ✓" : "Due Monday"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => void submitInvoice()}
                disabled={invoiceSubmitted}
                className={`w-full border-none rounded-[10px] py-3 text-sm font-bold ${
                  invoiceSubmitted ? "bg-[#eee] text-[#999]" : "bg-black text-white cursor-pointer"
                }`}
              >
                {invoiceSubmitted ? "Invoice sent" : "Submit weekly plan + invoice"}
              </button>
            </div>

            <div className="bg-white border border-black/10 rounded-2xl px-5 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <h2
                className="text-[18px] font-bold m-0 mb-3"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                This week&apos;s accountability
              </h2>
              <div className="flex flex-col gap-1.5">
                {CC_LAURA_WEEK_CHECKS.map((w) => {
                  const on = !!weekChecks[w.id];
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => void toggleWeek(w.id)}
                      className="flex items-center gap-2.5 w-full text-left rounded-[10px] px-3 py-2.5 border cursor-pointer"
                      style={{
                        background: on ? "#FFF5F9" : "#fff",
                        borderColor: on ? "#FFC1E2" : "rgba(0,0,0,0.09)",
                      }}
                    >
                      <span
                        className="w-[19px] h-[19px] shrink-0 rounded-[5px] flex items-center justify-center text-[11px] font-extrabold text-white border-2"
                        style={{
                          background: on ? PINK : "transparent",
                          borderColor: on ? PINK : "rgba(0,0,0,0.25)",
                        }}
                      >
                        {on ? "✓" : ""}
                      </span>
                      <span
                        className="text-[13px] font-semibold"
                        style={{
                          color: on ? "#999" : "#222",
                          textDecoration: on ? "line-through" : "none",
                        }}
                      >
                        {w.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {lauraModal && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-[100] p-5">
          <div className="bg-white rounded-[20px] p-7 w-[340px] max-w-full shadow-[0_30px_80px_rgba(0,0,0,0.4)] text-center">
            <div className="text-3xl">🔒</div>
            <div
              className="text-[22px] font-extrabold mt-1.5 mb-1"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Laura&apos;s Desk
            </div>
            <p className="m-0 mb-4 text-[13px] text-[#888]">
              Enter the access code — Laura &amp; owner only.
            </p>
            <input
              value={lauraCode}
              onChange={(e) => {
                setLauraCode(e.target.value);
                setLauraErr(false);
                setLauraErrMsg("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void unlockLaura();
                }
              }}
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Access code"
              className="w-full text-center tracking-[0.3em] text-lg border-2 border-black rounded-xl px-3 py-3 mb-2.5"
              autoFocus
            />
            {(lauraErr || lauraErrMsg) && (
              <div className="text-[#dc2626] text-[12.5px] font-bold mb-2.5">
                {lauraErrMsg || "Incorrect code — try again."}
              </div>
            )}
            <div className="flex gap-2.5 mt-1.5">
              <button
                type="button"
                onClick={() => setLauraModal(false)}
                className="flex-1 bg-white text-black border-2 border-black rounded-[10px] py-3 text-sm font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void unlockLaura()}
                className="flex-1 text-white border-none rounded-[10px] py-3 text-sm font-bold"
                style={{ background: PINK }}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
