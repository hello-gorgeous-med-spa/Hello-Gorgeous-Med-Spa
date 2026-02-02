'use client';

// ============================================================
// OWNER MODE DASHBOARD - EHR-GRADE SYSTEM CONTROL CENTER
// Non-removable, non-downgradable, full system authority
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SystemStatus {
  database: 'connected' | 'error';
  payments: 'live' | 'test' | 'error';
  sms: 'active' | 'inactive' | 'error';
  email: 'active' | 'inactive' | 'error';
  storage: 'active' | 'error';
  lastBackup: string;
  uptime: string;
}

interface QuickStat {
  label: string;
  value: string | number;
  change?: string;
}

export default function OwnerDashboardPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'connected',
    payments: 'live',
    sms: 'active',
    email: 'active',
    storage: 'active',
    lastBackup: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    uptime: '99.9%',
  });

  const [stats, setStats] = useState<QuickStat[]>([
    { label: 'Total Clients', value: '3,425', change: '+12 this week' },
    { label: 'Active Services', value: '76', change: '' },
    { label: 'Active Providers', value: '2', change: '' },
    { label: 'Pending Consents', value: '0', change: '' },
  ]);

  const controlModules = [
    {
      title: 'Business & Clinic',
      icon: '🏢',
      description: 'Name, locations, hours, closures',
      link: '/admin/owner/business',
      status: 'configured',
    },
    {
      title: 'Services & Treatments',
      icon: '💉',
      description: 'Create, edit, configure all services',
      link: '/admin/owner/services',
      status: 'configured',
    },
    {
      title: 'Providers & Staff',
      icon: '👥',
      description: 'Users, roles, capabilities, kill switch',
      link: '/admin/owner/users',
      status: 'configured',
    },
    {
      title: 'Scheduling Engine',
      icon: '📅',
      description: 'Availability, buffers, overbooking',
      link: '/admin/settings/schedules',
      status: 'configured',
    },
    {
      title: 'Booking Rules',
      icon: '📋',
      description: 'Cancellation, no-show, deposits',
      link: '/admin/owner/booking-rules',
      status: 'configured',
    },
    {
      title: 'Consents & Legal',
      icon: '📝',
      description: 'Forms, versioning, enforcement',
      link: '/admin/settings/consent-forms',
      status: 'configured',
    },
    {
      title: 'Clinical Charting',
      icon: '🩺',
      description: 'SOAP templates, requirements',
      link: '/admin/settings/chart-templates',
      status: 'configured',
    },
    {
      title: 'Inventory & Supplies',
      icon: '📦',
      description: 'Products, lots, expiration',
      link: '/admin/owner/inventory',
      status: 'configured',
    },
    {
      title: 'Payments & Pricing',
      icon: '💳',
      description: 'Prices, taxes, refund rules',
      link: '/admin/settings/prices',
      status: 'configured',
    },
    {
      title: 'Memberships & Packages',
      icon: '💎',
      description: 'Plans, billing, benefits',
      link: '/admin/settings/memberships',
      status: 'configured',
    },
    {
      title: 'Automations',
      icon: '⚡',
      description: 'Triggers, SMS/email, follow-ups',
      link: '/admin/settings/automations',
      status: 'configured',
    },
    {
      title: 'Feature Flags',
      icon: '🎚️',
      description: 'Enable/disable features instantly',
      link: '/admin/owner/features',
      status: 'configured',
    },
    {
      title: 'Sandbox Mode',
      icon: '🧪',
      description: 'Test changes before publishing',
      link: '/admin/owner/sandbox',
      status: 'ready',
    },
    {
      title: 'Change Log & Rollback',
      icon: '📜',
      description: 'History, before/after, undo',
      link: '/admin/owner/changelog',
      status: 'configured',
    },
    {
      title: 'Data Exports',
      icon: '📤',
      description: 'Export all data (CSV/PDF/JSON)',
      link: '/admin/owner/exports',
      status: 'ready',
    },
    {
      title: 'System Access & Keys',
      icon: '🔑',
      description: 'All credentials you control',
      link: '/admin/owner/access',
      status: 'critical',
    },
  ];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Owner Mode Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">👑</span>
              <div>
                <h1 className="text-2xl font-bold">OWNER MODE</h1>
                <p className="text-purple-100">Full System Control • EHR-Grade • No Developer Required</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-200">Logged in as</p>
            <p className="font-semibold">Danielle (System Owner)</p>
            <p className="text-xs text-purple-200 mt-1">Non-removable • Non-downgradable</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${systemStatus.database === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">Database</span>
          </div>
          <p className="font-semibold mt-1 capitalize">{systemStatus.database}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${systemStatus.payments === 'live' ? 'bg-green-500' : systemStatus.payments === 'test' ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">Payments</span>
          </div>
          <p className="font-semibold mt-1 capitalize">{systemStatus.payments}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${systemStatus.sms === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">SMS</span>
          </div>
          <p className="font-semibold mt-1 capitalize">{systemStatus.sms}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${systemStatus.email === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">Email</span>
          </div>
          <p className="font-semibold mt-1 capitalize">{systemStatus.email}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${systemStatus.storage === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">Storage</span>
          </div>
          <p className="font-semibold mt-1 capitalize">{systemStatus.storage}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Uptime</span>
          </div>
          <p className="font-semibold mt-1">{systemStatus.uptime}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            {stat.change && <p className="text-xs text-green-600 mt-1">{stat.change}</p>}
          </div>
        ))}
      </div>

      {/* Control Modules Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Control Modules</h2>
        <div className="grid grid-cols-4 gap-4">
          {controlModules.map((module, idx) => (
            <Link
              key={idx}
              href={module.link}
              className="bg-white rounded-xl border p-4 hover:border-pink-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{module.icon}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  module.status === 'configured' ? 'bg-green-100 text-green-700' :
                  module.status === 'critical' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {module.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mt-3 group-hover:text-pink-600">{module.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{module.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Owner Checklist */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Owner Control Verification</h2>
        <p className="text-sm text-gray-500 mb-4">Confirm you can perform all these actions WITHOUT developer help:</p>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { task: 'Create a new service', link: '/admin/owner/services' },
            { task: 'Change a service buffer', link: '/admin/owner/services' },
            { task: 'Modify consent requirements', link: '/admin/settings/consent-forms' },
            { task: 'Edit provider schedule', link: '/admin/settings/schedules' },
            { task: 'Adjust cancellation policy', link: '/admin/owner/booking-rules' },
            { task: 'Disable a feature', link: '/admin/owner/features' },
            { task: 'Roll back a change', link: '/admin/owner/changelog' },
            { task: 'Test in sandbox', link: '/admin/owner/sandbox' },
            { task: 'Export all data', link: '/admin/owner/exports' },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-pink-50 transition-colors"
            >
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">✓</span>
              <span className="text-sm text-gray-700">{item.task}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Emergency Controls</h2>
        <p className="text-sm text-red-600 mb-4">Use these only when necessary. All actions are logged.</p>
        <div className="flex gap-4">
          <Link href="/admin/owner/users" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            🚨 Revoke User Access
          </Link>
          <Link href="/admin/owner/features" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            ⚠️ Disable Feature
          </Link>
          <Link href="/admin/owner/changelog" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            ↩️ Rollback Change
          </Link>
        </div>
      </div>
    </div>
  );
}
