'use client';

// ============================================================
// OWNER'S MANUAL - Downloadable System Guide
// Full documentation for operating HGOS
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

export default function OwnerManualPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: '🏠 Overview', icon: '📊' },
    { id: 'clients', title: '👥 Clients', icon: '👥' },
    { id: 'appointments', title: '📅 Appointments', icon: '📅' },
    { id: 'services', title: '💅 Services', icon: '💅' },
    { id: 'providers', title: '👩‍⚕️ Providers', icon: '👩‍⚕️' },
    { id: 'users', title: '🔐 Users & Roles', icon: '🔐' },
    { id: 'marketing', title: '📣 Marketing', icon: '📣' },
    { id: 'content', title: '📝 Content (CMS)', icon: '📝' },
    { id: 'analytics', title: '📊 Analytics', icon: '📈' },
    { id: 'audit', title: '🔍 Audit Logs', icon: '🔍' },
    { id: 'settings', title: '⚙️ Settings', icon: '⚙️' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.open('/docs/HGOS-Owner-Manual.md', '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Owner's Manual</h1>
          <p className="text-gray-600">Complete guide to operating your Hello Gorgeous system</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            📥 Download MD
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors"
          >
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <nav className="w-64 flex-shrink-0 print:hidden">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-[#FF2D8E] text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-xl border border-gray-200 p-8 print:border-0 print:p-0">
          {/* Print Header */}
          <div className="hidden print:block mb-8 text-center border-b pb-6">
            <h1 className="text-3xl font-bold">Hello Gorgeous Operating System</h1>
            <p className="text-xl text-gray-600 mt-2">Owner's Manual</p>
            <p className="text-sm text-gray-400 mt-4">Version 2.0 | February 2025</p>
          </div>

          {/* Overview Section */}
          <section id="overview" className={activeSection === 'overview' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔐</span> Your Owner Access
            </h2>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800">
                <strong>Protected Account:</strong> Your owner account (danielle@hellogorgeousmedspa.com) cannot be 
                deleted, demoted, or deactivated. This protection is built into the database.
              </p>
            </div>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">Quick Access URLs</h3>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Page</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">URL</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 px-4 py-2">Admin Dashboard</td><td className="border border-gray-200 px-4 py-2 font-mono text-sm">/admin</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Clients</td><td className="border border-gray-200 px-4 py-2 font-mono text-sm">/admin/clients</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Appointments</td><td className="border border-gray-200 px-4 py-2 font-mono text-sm">/admin/appointments</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Services</td><td className="border border-gray-200 px-4 py-2 font-mono text-sm">/admin/services</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Users & Roles</td><td className="border border-gray-200 px-4 py-2 font-mono text-sm">/admin/users</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Settings</td><td className="border border-gray-200 px-4 py-2 font-mono text-sm">/admin/settings</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Audit Logs</td><td className="border border-gray-200 px-4 py-2 font-mono text-sm">/admin/audit-logs</td></tr>
              </tbody>
            </table>
          </section>

          {/* Clients Section */}
          <section id="clients" className={activeSection === 'clients' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:mt-8">
              <span className="text-2xl">👥</span> Client Management
            </h2>
            
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> Admin → Clients → All Clients
            </p>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">What You Can Do</h3>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Action</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">How To</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 px-4 py-2">Add New Client</td><td className="border border-gray-200 px-4 py-2">Click "+ Add Client" button</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Edit Client</td><td className="border border-gray-200 px-4 py-2">Click on client row → Edit</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">View History</td><td className="border border-gray-200 px-4 py-2">Click client → see appointments, payments</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Merge Duplicates</td><td className="border border-gray-200 px-4 py-2">Select clients → "Merge" (Owner only)</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Export Data</td><td className="border border-gray-200 px-4 py-2">Click "Export CSV" button</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Delete Client</td><td className="border border-gray-200 px-4 py-2">Click "Deactivate" (soft delete, recoverable)</td></tr>
              </tbody>
            </table>
          </section>

          {/* Appointments Section */}
          <section id="appointments" className={activeSection === 'appointments' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:mt-8">
              <span className="text-2xl">📅</span> Appointment Management
            </h2>
            
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> Admin → Clients → Appointments
            </p>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">Appointment Actions</h3>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Action</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">How To</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 px-4 py-2">Book New</td><td className="border border-gray-200 px-4 py-2">Click "+ New Appointment"</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Reschedule</td><td className="border border-gray-200 px-4 py-2">Click appointment → "Reschedule"</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Cancel</td><td className="border border-gray-200 px-4 py-2">Click appointment → "Cancel"</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Mark No-Show</td><td className="border border-gray-200 px-4 py-2">Click appointment → "No Show"</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Check In</td><td className="border border-gray-200 px-4 py-2">Click appointment → "Check In"</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Complete</td><td className="border border-gray-200 px-4 py-2">Click appointment → "Complete"</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Apply Discount</td><td className="border border-gray-200 px-4 py-2">Click appointment → "Apply Discount"</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Process Refund</td><td className="border border-gray-200 px-4 py-2">Click appointment → "Refund" (Owner/Admin)</td></tr>
              </tbody>
            </table>
          </section>

          {/* Services Section */}
          <section id="services" className={activeSection === 'services' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:mt-8">
              <span className="text-2xl">💅</span> Services & Pricing
            </h2>
            
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> Admin → Services → Services & Pricing
            </p>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">Managing Services</h3>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Action</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">How To</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 px-4 py-2">Add Service</td><td className="border border-gray-200 px-4 py-2">Click "+ Add Service"</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Edit Price</td><td className="border border-gray-200 px-4 py-2">Click service → Edit → Change price</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Custom Price Display</td><td className="border border-gray-200 px-4 py-2">Use "Price Display" field (e.g., "$12/unit")</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Set Duration</td><td className="border border-gray-200 px-4 py-2">Edit → Change duration in minutes</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Assign Providers</td><td className="border border-gray-200 px-4 py-2">Edit → Select providers</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Hide Service</td><td className="border border-gray-200 px-4 py-2">Toggle "Active" off</td></tr>
              </tbody>
            </table>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">Price Display Examples</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">$350</code> - Fixed price</li>
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">$12/unit</code> - Per-unit pricing (Botox)</li>
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">From $500</code> - Starting price</li>
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">$200-$800</code> - Price range</li>
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">Call for pricing</code> - Consultation required</li>
            </ul>
          </section>

          {/* Providers Section */}
          <section id="providers" className={activeSection === 'providers' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:mt-8">
              <span className="text-2xl">👩‍⚕️</span> Provider Management
            </h2>
            
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> Admin → Content → Providers
            </p>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">Provider Media</h3>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Action</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">How To</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 px-4 py-2">Upload Video</td><td className="border border-gray-200 px-4 py-2">Click "+ Upload Media" → Select "Video"</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Upload Before/After</td><td className="border border-gray-200 px-4 py-2">Click "+ Upload Media" → Select "Before/After"</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Mark Featured</td><td className="border border-gray-200 px-4 py-2">Click ⭐ star icon</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Hide/Show</td><td className="border border-gray-200 px-4 py-2">Click 👁 eye icon</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Delete</td><td className="border border-gray-200 px-4 py-2">Click 🗑 trash icon</td></tr>
              </tbody>
            </table>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800">
                <strong>⚠️ Compliance:</strong> Before/after photos require checking "Client Consent Confirmed" 
                before they can be published.
              </p>
            </div>
          </section>

          {/* Users Section */}
          <section id="users" className={activeSection === 'users' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:mt-8">
              <span className="text-2xl">🔐</span> Users & Role Management
            </h2>
            
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> Admin → Settings → Users & Access
            </p>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">User Roles</h3>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Role</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Access Level</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-amber-50"><td className="border border-gray-200 px-4 py-2 font-bold">Owner</td><td className="border border-gray-200 px-4 py-2">FULL ACCESS - Cannot be changed/deleted</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Admin</td><td className="border border-gray-200 px-4 py-2">Dashboard, clients, appointments, marketing, reports</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Provider</td><td className="border border-gray-200 px-4 py-2">Own appointments, charts, POS checkout</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Staff</td><td className="border border-gray-200 px-4 py-2">Front desk, check-in, basic POS</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Read-Only</td><td className="border border-gray-200 px-4 py-2">View only (for accountants/auditors)</td></tr>
              </tbody>
            </table>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">User Actions (Owner Only)</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li><strong>Add User:</strong> Click "+ Add User" button</li>
              <li><strong>Change Role:</strong> Click ✏️ next to role badge</li>
              <li><strong>Deactivate:</strong> Click "Deactivate" button</li>
              <li><strong>Reactivate:</strong> Click "Reactivate" button</li>
              <li><strong>Reset 2FA:</strong> Click "Reset 2FA" button</li>
              <li><strong>Unlock Account:</strong> Click "Unlock" after failed logins</li>
            </ul>
          </section>

          {/* Marketing Section */}
          <section id="marketing" className={activeSection === 'marketing' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:mt-8">
              <span className="text-2xl">📣</span> Marketing
            </h2>
            
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> Admin → Marketing
            </p>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">Email/SMS Campaigns</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li>Create campaigns with target audience</li>
              <li>Schedule send time</li>
              <li>Track open/click rates</li>
              <li>View campaign performance</li>
            </ul>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">Automation Flows</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Welcome sequence for new clients</li>
              <li>Appointment reminders (24hr, 1hr)</li>
              <li>Birthday messages</li>
              <li>Re-engagement campaigns</li>
              <li>Post-treatment follow-ups</li>
            </ul>
          </section>

          {/* Content Section */}
          <section id="content" className={activeSection === 'content' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:mt-8">
              <span className="text-2xl">📝</span> Content Management (CMS)
            </h2>
            
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> Admin → Content → Site Content
            </p>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">What You Can Edit</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li>Homepage headlines and text</li>
              <li>Service page descriptions</li>
              <li>FAQ content</li>
              <li>Banner messages</li>
              <li>Promotional text</li>
            </ul>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                <strong>✓ No Code Deploy Needed:</strong> All content changes go live immediately after saving!
              </p>
            </div>
          </section>

          {/* Analytics Section */}
          <section id="analytics" className={activeSection === 'analytics' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:mt-8">
              <span className="text-2xl">📊</span> Analytics
            </h2>
            
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> Admin → Analytics
            </p>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">Dashboard Metrics</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li><strong>Revenue:</strong> Today, this week, this month, last month</li>
              <li><strong>Appointments:</strong> Booked, completed, no-shows, cancelled</li>
              <li><strong>Clients:</strong> New vs returning, retention rate</li>
              <li><strong>Waitlist:</strong> Total entries, qualified leads, conversion rate</li>
            </ul>
          </section>

          {/* Audit Section */}
          <section id="audit" className={activeSection === 'audit' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:mt-8">
              <span className="text-2xl">🔍</span> Audit Logs (Owner Only)
            </h2>
            
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> Admin → Audit & Security → Audit Logs
            </p>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">What's Tracked</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
              <li>All login attempts (success and failure)</li>
              <li>User role changes</li>
              <li>Client record changes</li>
              <li>Appointment modifications</li>
              <li>Settings changes</li>
              <li>Media uploads/deletions</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>💡 Tip:</strong> Click any audit entry to see the "before" and "after" values for 
                complete change tracking.
              </p>
            </div>
          </section>

          {/* Settings Section */}
          <section id="settings" className={activeSection === 'settings' ? '' : 'hidden print:block'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:mt-8">
              <span className="text-2xl">⚙️</span> Business Settings
            </h2>
            
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> Admin → Settings → Business Settings
            </p>

            <h3 className="font-semibold text-gray-900 mt-6 mb-3">Configurable Settings</h3>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Setting</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 px-4 py-2">Business Name</td><td className="border border-gray-200 px-4 py-2">Hello Gorgeous Med Spa</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Phone</td><td className="border border-gray-200 px-4 py-2">(630) 636-6193</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Address</td><td className="border border-gray-200 px-4 py-2">74 W. Washington St, Oswego, IL</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Timezone</td><td className="border border-gray-200 px-4 py-2">America/Chicago (Central)</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Business Hours</td><td className="border border-gray-200 px-4 py-2">Set open/close per day</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Online Booking</td><td className="border border-gray-200 px-4 py-2">Enable/disable online scheduling</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Require Deposit</td><td className="border border-gray-200 px-4 py-2">Collect deposits for bookings</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Cancellation Window</td><td className="border border-gray-200 px-4 py-2">Hours before (default: 24)</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">Cancellation Fee</td><td className="border border-gray-200 px-4 py-2">Percentage (default: 50%)</td></tr>
              </tbody>
            </table>
          </section>

          {/* Print Footer */}
          <div className="hidden print:block mt-12 pt-6 border-t text-center text-gray-500 text-sm">
            <p>Hello Gorgeous Operating System - Owner's Manual</p>
            <p>Version 2.0 | February 2025</p>
            <p className="mt-2">💗 Hello Gorgeous Med Spa - Your Business, Your Control</p>
          </div>
        </main>
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-6 print:hidden">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/clients" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-pink-300 transition-colors">
            <span className="text-2xl block mb-2">👥</span>
            <span className="font-medium text-gray-900">Clients</span>
          </Link>
          <Link href="/admin/appointments" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-pink-300 transition-colors">
            <span className="text-2xl block mb-2">📅</span>
            <span className="font-medium text-gray-900">Appointments</span>
          </Link>
          <Link href="/admin/services" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-pink-300 transition-colors">
            <span className="text-2xl block mb-2">💅</span>
            <span className="font-medium text-gray-900">Services</span>
          </Link>
          <Link href="/admin/users" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-pink-300 transition-colors">
            <span className="text-2xl block mb-2">🔐</span>
            <span className="font-medium text-gray-900">Users</span>
          </Link>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .hidden.print\\:block { display: block !important; }
          nav, header, footer { display: none !important; }
          .print\\:border-0 { border: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:mt-8 { margin-top: 2rem !important; page-break-before: auto; }
          section { page-break-inside: avoid; }
          table { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
