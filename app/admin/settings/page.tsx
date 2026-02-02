'use client';

// ============================================================
// ADMIN SETTINGS HUB - Owner-Controlled System Configuration
// ALL business rules, policies, and settings in ONE place
// NO CODE CHANGES REQUIRED for operational modifications
// ============================================================

import { useState, useEffect } from 'react';

type TabId = 'general' | 'booking' | 'scheduling' | 'compliance' | 'clinical' | 'payments' | 'notifications' | 'features' | 'rules' | 'audit';

interface Config {
  [category: string]: {
    [key: string]: any;
  };
}

interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  is_enabled: boolean;
  category: string;
}

interface BusinessRule {
  id: string;
  name: string;
  description: string;
  category: string;
  conditions: any[];
  actions: any[];
  priority: number;
  is_active: boolean;
  version: number;
}

interface AuditEntry {
  id: string;
  table_name: string;
  action: string;
  description: string;
  changed_at: string;
  new_value: any;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [config, setConfig] = useState<Config>({});
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dataSource, setDataSource] = useState<string>('');

  // Fetch all configuration on load
  useEffect(() => {
    fetchAllConfig();
  }, []);

  const fetchAllConfig = async () => {
    setLoading(true);
    try {
      const [configRes, flagsRes, rulesRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/config/flags'),
        fetch('/api/config/rules'),
      ]);

      const configData = await configRes.json();
      const flagsData = await flagsRes.json();
      const rulesData = await rulesRes.json();

      setConfig(configData.config || {});
      setFeatureFlags(flagsData.flags || []);
      setBusinessRules(rulesData.rules || []);
      setDataSource(configData.source || 'defaults');
    } catch (error) {
      console.error('Error fetching config:', error);
      setMessage({ type: 'error', text: 'Failed to load configuration' });
    } finally {
      setLoading(false);
    }
  };

  // Save configuration
  const saveConfig = async (category: string, key: string, value: any) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, key, value }),
      });
      
      if (res.ok) {
        setConfig(prev => ({
          ...prev,
          [category]: { ...prev[category], [key]: value }
        }));
        setMessage({ type: 'success', text: 'Settings saved!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  // Toggle feature flag
  const toggleFlag = async (flag: FeatureFlag) => {
    try {
      const res = await fetch('/api/config/flags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: flag.key, is_enabled: !flag.is_enabled }),
      });
      
      if (res.ok) {
        setFeatureFlags(prev => 
          prev.map(f => f.key === flag.key ? { ...f, is_enabled: !f.is_enabled } : f)
        );
        setMessage({ type: 'success', text: `${flag.name} ${!flag.is_enabled ? 'enabled' : 'disabled'}` });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to toggle feature' });
    }
  };

  // Toggle business rule
  const toggleRule = async (rule: BusinessRule) => {
    try {
      const res = await fetch('/api/config/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rule.id, is_active: !rule.is_active }),
      });
      
      if (res.ok) {
        setBusinessRules(prev => 
          prev.map(r => r.id === rule.id ? { ...r, is_active: !r.is_active } : r)
        );
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to toggle rule' });
    }
  };

  const tabs = [
    { id: 'general' as TabId, label: 'General', icon: '⚙️' },
    { id: 'booking' as TabId, label: 'Booking', icon: '📅' },
    { id: 'scheduling' as TabId, label: 'Scheduling', icon: '🕐' },
    { id: 'compliance' as TabId, label: 'Compliance', icon: '📋' },
    { id: 'clinical' as TabId, label: 'Clinical', icon: '🩺' },
    { id: 'payments' as TabId, label: 'Payments', icon: '💳' },
    { id: 'notifications' as TabId, label: 'Notifications', icon: '🔔' },
    { id: 'features' as TabId, label: 'Features', icon: '🎛️' },
    { id: 'rules' as TabId, label: 'Rules', icon: '📜' },
    { id: 'audit' as TabId, label: 'Audit Log', icon: '📝' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500">Loading configuration...</p>
        </div>
        <div className="bg-white rounded-xl border p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-gray-100 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500">
            Configure all business rules, policies, and system behavior
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
              Source: {dataSource}
            </span>
          </p>
        </div>
        {message && (
          <div className={`px-4 py-2 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Migration Notice */}
      {dataSource === 'defaults' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> Settings are using default values. To enable database persistence, 
            run the migration script in <code className="bg-amber-100 px-1 rounded">supabase/migrations/001_system_config_layer.sql</code>
          </p>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-pink-50 text-pink-700 border-l-4 border-pink-500'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <GeneralSettings config={config} onSave={saveConfig} saving={saving} />
          )}

          {/* Booking Settings */}
          {activeTab === 'booking' && (
            <BookingSettings config={config} onSave={saveConfig} saving={saving} />
          )}

          {/* Scheduling Settings */}
          {activeTab === 'scheduling' && (
            <SchedulingSettings config={config} onSave={saveConfig} saving={saving} />
          )}

          {/* Compliance Settings */}
          {activeTab === 'compliance' && (
            <ComplianceSettings config={config} onSave={saveConfig} saving={saving} />
          )}

          {/* Clinical Settings */}
          {activeTab === 'clinical' && (
            <ClinicalSettings config={config} onSave={saveConfig} saving={saving} />
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <PaymentSettings config={config} onSave={saveConfig} saving={saving} />
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <NotificationSettings config={config} onSave={saveConfig} saving={saving} />
          )}

          {/* Feature Flags */}
          {activeTab === 'features' && (
            <FeatureFlagsPanel flags={featureFlags} onToggle={toggleFlag} />
          )}

          {/* Business Rules */}
          {activeTab === 'rules' && (
            <BusinessRulesPanel rules={businessRules} onToggle={toggleRule} />
          )}

          {/* Audit Log */}
          {activeTab === 'audit' && (
            <AuditLogPanel entries={auditLog} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SETTINGS COMPONENTS
// ============================================================

function GeneralSettings({ config, onSave, saving }: { config: Config; onSave: Function; saving: boolean }) {
  const hours = config.business?.hours || {};
  const [localHours, setLocalHours] = useState(hours);

  useEffect(() => {
    setLocalHours(config.business?.hours || {});
  }, [config]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const updateDay = (day: string, field: string, value: any) => {
    const updated = { ...localHours, [day]: { ...localHours[day], [field]: value } };
    setLocalHours(updated);
  };

  const saveHours = () => onSave('business', 'hours', localHours);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Business Hours</h2>
        <p className="text-sm text-gray-500 mt-1">Set your operating hours for each day</p>
      </div>

      <div className="space-y-3">
        {days.map(day => (
          <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-28">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localHours[day]?.enabled !== false}
                  onChange={(e) => updateDay(day, 'enabled', e.target.checked)}
                  className="w-4 h-4 text-pink-500 rounded"
                />
                <span className="font-medium capitalize">{day}</span>
              </label>
            </div>
            
            {localHours[day]?.enabled !== false ? (
              <>
                <input
                  type="time"
                  value={localHours[day]?.open || '09:00'}
                  onChange={(e) => updateDay(day, 'open', e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={localHours[day]?.close || '18:00'}
                  onChange={(e) => updateDay(day, 'close', e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
              </>
            ) : (
              <span className="text-gray-400">Closed</span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={saveHours}
        disabled={saving}
        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Hours'}
      </button>
    </div>
  );
}

function BookingSettings({ config, onSave, saving }: { config: Config; onSave: Function; saving: boolean }) {
  const rules = config.booking?.rules || {};
  const [local, setLocal] = useState(rules);

  useEffect(() => {
    setLocal(config.booking?.rules || {});
  }, [config]);

  const update = (key: string, value: any) => setLocal(prev => ({ ...prev, [key]: value }));
  const save = () => onSave('booking', 'rules', local);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Booking Policies</h2>
        <p className="text-sm text-gray-500 mt-1">Configure booking rules and cancellation policies</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Advance Booking (hours)</label>
          <input
            type="number"
            value={local.min_advance_hours || 2}
            onChange={(e) => update('min_advance_hours', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Advance Booking (days)</label>
          <input
            type="number"
            value={local.max_advance_days || 60}
            onChange={(e) => update('max_advance_days', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Window (hours)</label>
          <input
            type="number"
            value={local.cancellation_hours || 24}
            onChange={(e) => update('cancellation_hours', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Fee (%)</label>
          <input
            type="number"
            value={local.cancellation_fee_percentage || 50}
            onChange={(e) => update('cancellation_fee_percentage', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No-Show Fee (%)</label>
          <input
            type="number"
            value={local.no_show_fee_percentage || 100}
            onChange={(e) => update('no_show_fee_percentage', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (%)</label>
          <input
            type="number"
            value={local.deposit_percentage || 25}
            onChange={(e) => update('deposit_percentage', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
            min="0"
            max="100"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t">
        <ToggleSetting
          label="Allow Same-Day Booking"
          description="Clients can book appointments for today"
          checked={local.allow_same_day !== false}
          onChange={(v) => update('allow_same_day', v)}
        />
        <ToggleSetting
          label="Require Deposit"
          description="Require deposit at time of booking"
          checked={local.require_deposit === true}
          onChange={(v) => update('require_deposit', v)}
        />
        <ToggleSetting
          label="Allow Online Booking"
          description="Enable the public booking page"
          checked={local.allow_online_booking !== false}
          onChange={(v) => update('allow_online_booking', v)}
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Booking Settings'}
      </button>
    </div>
  );
}

function SchedulingSettings({ config, onSave, saving }: { config: Config; onSave: Function; saving: boolean }) {
  const buffers = config.scheduling?.buffers || {};
  const [local, setLocal] = useState(buffers);

  useEffect(() => {
    setLocal(config.scheduling?.buffers || {});
  }, [config]);

  const update = (key: string, value: any) => setLocal(prev => ({ ...prev, [key]: value }));
  const save = () => onSave('scheduling', 'buffers', local);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Scheduling & Buffers</h2>
        <p className="text-sm text-gray-500 mt-1">Set time buffers between appointments</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Buffer Before (min)</label>
          <input
            type="number"
            value={local.default_buffer_before || 0}
            onChange={(e) => update('default_buffer_before', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Buffer After (min)</label>
          <input
            type="number"
            value={local.default_buffer_after || 15}
            onChange={(e) => update('default_buffer_after', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Injectable Buffer After (min)</label>
          <input
            type="number"
            value={local.injectable_buffer_after || 15}
            onChange={(e) => update('injectable_buffer_after', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Buffer After (min)</label>
          <input
            type="number"
            value={local.consultation_buffer_after || 10}
            onChange={(e) => update('consultation_buffer_after', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Scheduling Settings'}
      </button>
    </div>
  );
}

function ComplianceSettings({ config, onSave, saving }: { config: Config; onSave: Function; saving: boolean }) {
  const consents = config.compliance?.consents || {};
  const [local, setLocal] = useState(consents);

  useEffect(() => {
    setLocal(config.compliance?.consents || {});
  }, [config]);

  const update = (key: string, value: any) => setLocal(prev => ({ ...prev, [key]: value }));
  const save = () => onSave('compliance', 'consents', local);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Compliance & Consents</h2>
        <p className="text-sm text-gray-500 mt-1">Configure consent form requirements</p>
      </div>

      <div className="space-y-3">
        <ToggleSetting
          label="Require HIPAA Acknowledgment"
          description="Clients must sign HIPAA form"
          checked={local.require_hipaa !== false}
          onChange={(v) => update('require_hipaa', v)}
        />
        <ToggleSetting
          label="Require Financial Policy"
          description="Clients must accept financial policy"
          checked={local.require_financial_policy !== false}
          onChange={(v) => update('require_financial_policy', v)}
        />
        <ToggleSetting
          label="Require Photo Release"
          description="Clients must sign photo release"
          checked={local.require_photo_release === true}
          onChange={(v) => update('require_photo_release', v)}
        />
        <ToggleSetting
          label="Allow Digital Signatures"
          description="Accept electronic signatures"
          checked={local.allow_digital_signature !== false}
          onChange={(v) => update('allow_digital_signature', v)}
        />
      </div>

      <div className="pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Consent Expiration (days)</label>
        <input
          type="number"
          value={local.consent_expiry_days || 365}
          onChange={(e) => update('consent_expiry_days', parseInt(e.target.value))}
          className="w-48 px-4 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">How long before consents need to be re-signed</p>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Compliance Settings'}
      </button>
    </div>
  );
}

function ClinicalSettings({ config, onSave, saving }: { config: Config; onSave: Function; saving: boolean }) {
  const charting = config.clinical?.charting || {};
  const [local, setLocal] = useState(charting);

  useEffect(() => {
    setLocal(config.clinical?.charting || {});
  }, [config]);

  const update = (key: string, value: any) => setLocal(prev => ({ ...prev, [key]: value }));
  const save = () => onSave('clinical', 'charting', local);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Clinical Documentation</h2>
        <p className="text-sm text-gray-500 mt-1">Configure charting requirements</p>
      </div>

      <div className="space-y-3">
        <ToggleSetting
          label="Require SOAP Notes"
          description="Providers must complete SOAP notes"
          checked={local.require_soap_notes !== false}
          onChange={(v) => update('require_soap_notes', v)}
        />
        <ToggleSetting
          label="Require Lot Tracking for Injectables"
          description="Track lot numbers and expiration dates"
          checked={local.require_lot_tracking_injectables !== false}
          onChange={(v) => update('require_lot_tracking_injectables', v)}
        />
        <ToggleSetting
          label="Require Before Photos"
          description="Photos required before treatment"
          checked={local.require_before_photos === true}
          onChange={(v) => update('require_before_photos', v)}
        />
        <ToggleSetting
          label="Require After Photos"
          description="Photos required after treatment"
          checked={local.require_after_photos === true}
          onChange={(v) => update('require_after_photos', v)}
        />
        <ToggleSetting
          label="Allow Chart Addendums"
          description="Allow adding notes to signed charts"
          checked={local.allow_addendum !== false}
          onChange={(v) => update('allow_addendum', v)}
        />
      </div>

      <div className="pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Lock Chart After (hours)</label>
        <input
          type="number"
          value={local.lock_chart_after_hours || 24}
          onChange={(e) => update('lock_chart_after_hours', parseInt(e.target.value))}
          className="w-48 px-4 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">Hours after appointment before chart is locked</p>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Clinical Settings'}
      </button>
    </div>
  );
}

function PaymentSettings({ config, onSave, saving }: { config: Config; onSave: Function; saving: boolean }) {
  const settings = config.payments?.settings || {};
  const [local, setLocal] = useState(settings);

  useEffect(() => {
    setLocal(config.payments?.settings || {});
  }, [config]);

  const update = (key: string, value: any) => setLocal(prev => ({ ...prev, [key]: value }));
  const save = () => onSave('payments', 'settings', local);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Payment Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure payment methods and receipts</p>
      </div>

      <div className="space-y-3">
        <ToggleSetting
          label="Accept Cash"
          description="Allow cash payments"
          checked={local.accept_cash !== false}
          onChange={(v) => update('accept_cash', v)}
        />
        <ToggleSetting
          label="Accept Card"
          description="Allow credit/debit card payments"
          checked={local.accept_card !== false}
          onChange={(v) => update('accept_card', v)}
        />
        <ToggleSetting
          label="Accept Financing"
          description="Allow financing options (Cherry, CareCredit)"
          checked={local.accept_financing !== false}
          onChange={(v) => update('accept_financing', v)}
        />
        <ToggleSetting
          label="Require Payment Before Service"
          description="Collect payment before appointment"
          checked={local.require_payment_before_service === true}
          onChange={(v) => update('require_payment_before_service', v)}
        />
        <ToggleSetting
          label="Auto-Generate Receipt"
          description="Automatically create receipt after payment"
          checked={local.auto_generate_receipt !== false}
          onChange={(v) => update('auto_generate_receipt', v)}
        />
        <ToggleSetting
          label="Email Receipt"
          description="Send receipt via email"
          checked={local.send_receipt_email !== false}
          onChange={(v) => update('send_receipt_email', v)}
        />
        <ToggleSetting
          label="SMS Receipt"
          description="Send receipt via SMS"
          checked={local.send_receipt_sms === true}
          onChange={(v) => update('send_receipt_sms', v)}
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Payment Settings'}
      </button>
    </div>
  );
}

function NotificationSettings({ config, onSave, saving }: { config: Config; onSave: Function; saving: boolean }) {
  const settings = config.notifications?.settings || {};
  const [local, setLocal] = useState(settings);

  useEffect(() => {
    setLocal(config.notifications?.settings || {});
  }, [config]);

  const update = (key: string, value: any) => setLocal(prev => ({ ...prev, [key]: value }));
  const save = () => onSave('notifications', 'settings', local);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure automated client notifications</p>
      </div>

      <div className="space-y-3">
        <ToggleSetting
          label="Booking Confirmation"
          description="Send confirmation when appointment is booked"
          checked={local.send_booking_confirmation !== false}
          onChange={(v) => update('send_booking_confirmation', v)}
        />
        <ToggleSetting
          label="24-Hour Reminder"
          description="Send reminder 24 hours before appointment"
          checked={local.send_24h_reminder !== false}
          onChange={(v) => update('send_24h_reminder', v)}
        />
        <ToggleSetting
          label="2-Hour Reminder"
          description="Send reminder 2 hours before appointment"
          checked={local.send_2h_reminder !== false}
          onChange={(v) => update('send_2h_reminder', v)}
        />
        <ToggleSetting
          label="Follow-Up Message"
          description="Send check-in after appointment"
          checked={local.send_follow_up !== false}
          onChange={(v) => update('send_follow_up', v)}
        />
        <ToggleSetting
          label="Review Request"
          description="Ask for review after appointment"
          checked={local.send_review_request !== false}
          onChange={(v) => update('send_review_request', v)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Follow-Up Delay (days)</label>
          <input
            type="number"
            value={local.follow_up_delay_days || 14}
            onChange={(e) => update('follow_up_delay_days', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Request Delay (hours)</label>
          <input
            type="number"
            value={local.review_request_delay_hours || 24}
            onChange={(e) => update('review_request_delay_hours', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Notification Settings'}
      </button>
    </div>
  );
}

function FeatureFlagsPanel({ flags, onToggle }: { flags: FeatureFlag[]; onToggle: (flag: FeatureFlag) => void }) {
  const categories = [...new Set(flags.map(f => f.category))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Feature Flags</h2>
        <p className="text-sm text-gray-500 mt-1">Enable or disable system features instantly</p>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{category}</h3>
          <div className="space-y-2">
            {flags.filter(f => f.category === category).map(flag => (
              <div
                key={flag.key}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  flag.is_enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900">{flag.name}</p>
                  <p className="text-sm text-gray-500">{flag.description}</p>
                </div>
                <button
                  onClick={() => onToggle(flag)}
                  className={`w-14 h-7 rounded-full transition-colors relative ${
                    flag.is_enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                    flag.is_enabled ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BusinessRulesPanel({ rules, onToggle }: { rules: BusinessRule[]; onToggle: (rule: BusinessRule) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Business Rules</h2>
          <p className="text-sm text-gray-500 mt-1">Configure automated business logic</p>
        </div>
        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm">
          + Add Rule
        </button>
      </div>

      <div className="space-y-3">
        {rules.map(rule => (
          <div
            key={rule.id}
            className={`p-4 rounded-lg border ${
              rule.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{rule.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {rule.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    v{rule.version}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
                <div className="mt-2 flex gap-4 text-xs text-gray-400">
                  <span>Category: {rule.category}</span>
                  <span>Priority: {rule.priority}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                  Edit
                </button>
                <button
                  onClick={() => onToggle(rule)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    rule.is_active ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    rule.is_active ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditLogPanel({ entries }: { entries: AuditEntry[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Audit Log</h2>
        <p className="text-sm text-gray-500 mt-1">Track all configuration changes</p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No configuration changes recorded yet</p>
          <p className="text-sm mt-1">Changes will appear here after you modify settings</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(entry => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                <p className="text-xs text-gray-500">
                  {entry.table_name} • {entry.action}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(entry.changed_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable toggle component
function ToggleSetting({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          checked ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
          checked ? 'right-1' : 'left-1'
        }`} />
      </button>
    </div>
  );
}
