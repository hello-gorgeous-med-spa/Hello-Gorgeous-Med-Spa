"use client";

import { useEffect, useMemo, useState } from "react";

type UserKey = "dani" | "ryan";
type Task = { id: number; text: string; assignee: "dani" | "ryan" | "both"; done: boolean; created_at: string };
type Note = { id: number; client_id: string; client_name: string | null; note: string; created_by: string; created_at: string };

type Expense = { id: number; date: string; desc: string; amount: number; category: string; method: string };
type Bill = { id: number; name: string; amount: number; dueDay: number; category: string; freq: string };

export default function HubPage() {
  const [user, setUser] = useState<UserKey>("dani");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [assignee, setAssignee] = useState<"dani" | "ryan" | "both">("both");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hubGate, setHubGate] = useState(false);

  useEffect(() => {
    fetch("/api/hub/session", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => setHubGate(!!j.gate))
      .catch(() => setHubGate(false));
  }, []);

  async function loadAll(targetUser = user) {
    setLoading(true);
    try {
      const cred = { credentials: "include" as RequestCredentials };
      const [t, n, s] = await Promise.all([
        fetch(`/api/hub/tasks?user=${targetUser}`, cred).then((r) => r.json()),
        fetch(`/api/hub/notes?user=${targetUser}`, cred).then((r) => r.json()),
        fetch(`/api/hub/state?user=${targetUser}`, cred).then((r) => r.json()),
      ]);
      setTasks(t.tasks || []);
      setNotes(n.notes || []);
      setExpenses(s.state?.expenses || []);
      setBills(s.state?.bills || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll(user);
    const id = setInterval(() => loadAll(user), 15000);
    return () => clearInterval(id);
  }, [user]);

  const pending = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);
  const expensesTotal = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0), [expenses]);
  const billsTotal = useMemo(() => bills.reduce((sum, b) => sum + Number(b.amount || 0), 0), [bills]);

  async function addTask() {
    if (!taskInput.trim()) return;
    await fetch("/api/hub/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, text: taskInput.trim(), assignee, created_by: user }),
      credentials: "include",
    });
    setTaskInput("");
    await loadAll();
  }

  async function toggleTask(task: Task) {
    await fetch("/api/hub/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, id: task.id, done: !task.done }),
      credentials: "include",
    });
    await loadAll();
  }

  async function addNote() {
    if (!clientId.trim() || !noteText.trim()) return;
    await fetch("/api/hub/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, client_id: clientId.trim(), client_name: clientName.trim() || null, note: noteText.trim(), created_by: user }),
      credentials: "include",
    });
    setNoteText("");
    await loadAll();
  }

  async function saveState(nextExpenses: Expense[], nextBills: Bill[]) {
    setExpenses(nextExpenses);
    setBills(nextBills);
    await fetch("/api/hub/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, expenses: nextExpenses, bills: nextBills }),
      credentials: "include",
    });
  }

  function addSampleExpense() {
    const e: Expense = { id: Date.now(), date: new Date().toISOString().slice(0, 10), desc: "New expense", amount: 0, category: "Other", method: "Card" };
    saveState([e, ...expenses], bills);
  }

  function addSampleBill() {
    const b: Bill = { id: Date.now(), name: "New bill", amount: 0, dueDay: 1, category: "Other", freq: "Monthly" };
    saveState(expenses, [...bills, b]);
  }

  async function loadSquareSummary() {
    const json = await fetch("/api/hub/square-summary", { credentials: "include" }).then((r) => r.json());
    if (json.transactions) {
      await fetch("/api/hub/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, sq_data: json.transactions }),
        credentials: "include",
      });
      alert(`Loaded ${json.transactions.length} Square transactions.`);
    } else {
      alert(json.error || "Square summary unavailable.");
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Hello Gorgeous Command Center</h1>
          <p className="text-black/60 text-sm">Shared in Supabase · Live between Dani and Ryan</p>
          <p className="text-sm mt-1">
            <a href="/hub/classic" className="text-pink-600 underline">Classic UI</a>
            {hubGate ? (
              <>
                {" · "}
                <button
                  type="button"
                  className="text-black/50 underline"
                  onClick={async () => {
                    await fetch("/api/hub/auth", { method: "DELETE", credentials: "include" });
                    window.location.href = "/hub/login";
                  }}
                >
                  Sign out
                </button>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex gap-2">
          <button className={`px-3 py-2 rounded ${user === "dani" ? "bg-pink-600 text-white" : "bg-black/5"}`} onClick={() => setUser("dani")}>Dani view</button>
          <button className={`px-3 py-2 rounded ${user === "ryan" ? "bg-pink-600 text-white" : "bg-black/5"}`} onClick={() => setUser("ryan")}>Ryan view</button>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4"><div className="text-xs uppercase text-black/50">Pending tasks</div><div className="text-3xl font-bold">{pending}</div></div>
        <div className="border rounded-xl p-4"><div className="text-xs uppercase text-black/50">Expenses</div><div className="text-3xl font-bold text-red-600">${expensesTotal.toFixed(2)}</div></div>
        <div className="border rounded-xl p-4"><div className="text-xs uppercase text-black/50">Bills</div><div className="text-3xl font-bold text-red-600">${billsTotal.toFixed(2)}</div></div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Tasks</h2>
          <div className="flex gap-2 mb-3">
            <input className="border rounded px-3 py-2 flex-1" placeholder="New task" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
            <select className="border rounded px-2" value={assignee} onChange={(e) => setAssignee(e.target.value as any)}>
              <option value="both">Both</option><option value="dani">Dani</option><option value="ryan">Ryan</option>
            </select>
            <button className="bg-pink-600 text-white px-3 rounded" onClick={addTask}>Add</button>
          </div>
          <div className="space-y-2 max-h-72 overflow-auto">
            {tasks.map((t) => (
              <label key={t.id} className="flex items-center gap-2 border rounded p-2 text-sm">
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t)} />
                <span className={t.done ? "line-through text-black/40 flex-1" : "flex-1"}>{t.text}</span>
                <span className="text-xs text-black/50 uppercase">{t.assignee}</span>
              </label>
            ))}
            {!tasks.length && <p className="text-sm text-black/50">No tasks yet.</p>}
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Client notes</h2>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input className="border rounded px-3 py-2" placeholder="Client ID" value={clientId} onChange={(e) => setClientId(e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Client name (optional)" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <textarea className="border rounded px-3 py-2 w-full mb-2" rows={3} placeholder="Add note" value={noteText} onChange={(e) => setNoteText(e.target.value)} />
          <button className="bg-pink-600 text-white px-3 py-2 rounded" onClick={addNote}>Save note</button>
          <div className="space-y-2 max-h-56 overflow-auto mt-3">
            {notes.map((n) => (
              <div key={n.id} className="border rounded p-2 text-sm">
                <div className="text-xs text-black/50">{n.client_name || n.client_id} · {new Date(n.created_at).toLocaleString()}</div>
                <div>{n.note}</div>
              </div>
            ))}
            {!notes.length && <p className="text-sm text-black/50">No notes yet.</p>}
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Expenses (shared)</h2>
          <button className="border rounded px-3 py-1 text-sm" onClick={addSampleExpense}>+ Add expense row</button>
          <div className="space-y-2 mt-3 max-h-56 overflow-auto">
            {expenses.map((e) => (
              <div key={e.id} className="grid grid-cols-4 gap-2 text-sm border rounded p-2">
                <input className="border rounded px-2 py-1" value={e.date} onChange={(ev) => saveState(expenses.map((x) => x.id === e.id ? { ...x, date: ev.target.value } : x), bills)} />
                <input className="border rounded px-2 py-1" value={e.desc} onChange={(ev) => saveState(expenses.map((x) => x.id === e.id ? { ...x, desc: ev.target.value } : x), bills)} />
                <input className="border rounded px-2 py-1" value={String(e.amount)} onChange={(ev) => saveState(expenses.map((x) => x.id === e.id ? { ...x, amount: Number(ev.target.value || 0) } : x), bills)} />
                <button className="text-red-600" onClick={() => saveState(expenses.filter((x) => x.id !== e.id), bills)}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Bills (shared)</h2>
          <button className="border rounded px-3 py-1 text-sm" onClick={addSampleBill}>+ Add bill row</button>
          <div className="space-y-2 mt-3 max-h-56 overflow-auto">
            {bills.map((b) => (
              <div key={b.id} className="grid grid-cols-4 gap-2 text-sm border rounded p-2">
                <input className="border rounded px-2 py-1" value={b.name} onChange={(ev) => saveState(expenses, bills.map((x) => x.id === b.id ? { ...x, name: ev.target.value } : x))} />
                <input className="border rounded px-2 py-1" value={String(b.amount)} onChange={(ev) => saveState(expenses, bills.map((x) => x.id === b.id ? { ...x, amount: Number(ev.target.value || 0) } : x))} />
                <input className="border rounded px-2 py-1" value={String(b.dueDay)} onChange={(ev) => saveState(expenses, bills.map((x) => x.id === b.id ? { ...x, dueDay: Number(ev.target.value || 1) } : x))} />
                <button className="text-red-600" onClick={() => saveState(expenses, bills.filter((x) => x.id !== b.id))}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border rounded-xl p-4 space-y-3">
        <h2 className="font-semibold">Integrations</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <button className="border rounded px-3 py-2" onClick={() => window.location.href = "/api/auth/google?state=hub"}>Connect Google Business OAuth</button>
          <button className="border rounded px-3 py-2" onClick={loadSquareSummary}>Sync Square month-to-date</button>
          <span className="text-black/60">SMS: uses `TWILIO_*` via existing `/api/sms/campaign`</span>
          <span className="text-black/60">Email: uses `RESEND_API_KEY` via existing `/api/email-campaigns/send`</span>
          <span className="text-black/60">Meta: uses `META_PAGE_ACCESS_TOKEN` + IG/Page IDs via existing social routes</span>
        </div>
      </section>

      <p className="text-xs text-black/50">{loading ? "Syncing..." : "Auto-refresh every 15 seconds"}</p>
    </main>
  );
}
