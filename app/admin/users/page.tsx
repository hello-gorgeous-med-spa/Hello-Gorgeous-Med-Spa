"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Employee = {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  phone: string | null;
  is_active: boolean | null;
  last_login_at: string | null;
  created_at: string;
};

const ROLES = [
  { value: "staff", label: "Staff — front desk & ops" },
  { value: "provider", label: "Provider — clinical + charting" },
  { value: "admin", label: "Admin — full ops (owner only)" },
  { value: "readonly", label: "Read-only — view access" },
] as const;

export default function AdminUsersPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "staff",
    phone: "",
  });

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/employees");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load employees");
      setEmployees(data.employees || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          role: form.role,
          phone: form.phone || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create employee");

      setSuccess(
        `Created ${data.employee.email}. They can sign in at /admin/login with the password you set.`,
      );
      setForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "staff",
        phone: "",
      });
      setShowForm(false);
      await loadEmployees();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/settings" className="text-sm font-medium text-[#E6007E] hover:underline">
            ← Settings
          </Link>
          <h1 className="mt-2 text-2xl font-black text-black">Team logins</h1>
          <p className="mt-1 text-sm text-black/65">
            Employees sign in at{" "}
            <Link href="/admin/login" className="font-semibold text-[#E6007E] hover:underline">
              /admin/login
            </Link>{" "}
            to access the admin dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-[#FF2D8E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#E6007E]"
        >
          {showForm ? "Cancel" : "+ Add employee"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
        >
          <h2 className="text-lg font-bold">New employee account</h2>
          <p className="mt-1 text-sm text-black/60">
            Set a temporary password — ask them to change it after first login.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium">First name</span>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Last name</span>
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">Work email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
                placeholder="marissa@hellogorgeousmedspa.com"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Temporary password</span>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Role</span>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">Phone (optional)</span>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white hover:bg-[#FF2D8E] disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create login"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border-4 border-black bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#FFF0F7] text-xs font-bold uppercase tracking-wide text-black/55">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Last login</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-black/50">
                  Loading…
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-black/50">
                  No employee accounts yet. Add your first team member above.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.user_id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium">
                    {[emp.first_name, emp.last_name].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-4 py-3">{emp.email}</td>
                  <td className="px-4 py-3 capitalize">{emp.role}</td>
                  <td className="px-4 py-3 text-black/55">
                    {emp.last_login_at
                      ? new Date(emp.last_login_at).toLocaleString()
                      : "Never"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
