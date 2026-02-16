'use client';

// ============================================================
// GIFT CARD SETTINGS - OWNER CONTROL
// Full configuration without code changes
// ============================================================

import { useState, useEffect } from 'react';
import OwnerLayout from '../layout-wrapper';

interface Settings {
  enabled: boolean;
  allow_online_purchase: boolean;
  allow_pos_purchase: boolean;
  allow_partial_redemption: boolean;
  min_purchase_amount: number;
  max_purchase_amount: number;
  preset_amounts: number[];
  allow_custom_amount: boolean;
  cards_expire: boolean;
  default_expiration_months: number;
  allow_split_tender: boolean;
  auto_apply_to_appointments: boolean;
  prompt_before_checkout: boolean;
  allow_promotional_cards: boolean;
  square_location_id: string;
}

interface SyncStats {
  total: number;
  needsSync: number;
  hasErrors: number;
  stale: number;
  recentlySynced: number;
}

export default function GiftCardSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newPreset, setNewPreset] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchSyncStats();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gift-cards/settings');
      const data = await res.json();
      setSettings(data.settings);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSyncStats = async () => {
    try {
      const res = await fetch('/api/gift-cards/sync');
      const data = await res.json();
      setSyncStats(data.syncStats);
    } catch (err) {
      console.error('Failed to fetch sync stats:', err);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    
    try {
      const res = await fetch('/api/gift-cards/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleToggle = (key: keyof Settings) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const addPresetAmount = () => {
    if (!settings || !newPreset) return;
    const amount = parseFloat(newPreset);
    if (amount > 0 && !settings.preset_amounts.includes(amount)) {
      setSettings({
        ...settings,
        preset_amounts: [...settings.preset_amounts, amount].sort((a, b) => a - b),
      });
      setNewPreset('');
    }
  };

  const removePresetAmount = (amount: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      preset_amounts: settings.preset_amounts.filter(a => a !== amount),
    });
  };

  if (isLoading || !settings) {
    return (
      <OwnerLayout title="Gift Card Settings" description="Loading...">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-white rounded"></div>
          <div className="h-40 bg-white rounded"></div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout title="Gift Card Settings" description="Owner-controlled gift card configuration">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="col-span-2 space-y-6">
          {/* Master Toggle */}
          <div className={`p-6 rounded-xl border-2 ${settings.enabled ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Gift Cards {settings.enabled ? 'ENABLED' : 'DISABLED'}</h2>
                <p className="text-sm text-black">Master switch for all gift card functionality</p>
              </div>
              <button
                onClick={() => handleToggle('enabled')}
                className={`w-14 h-8 rounded-full transition-colors ${settings.enabled ? 'bg-green-500' : 'bg-white'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${settings.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Sales Channels */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Sales Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Online Purchase</p>
                  <p className="text-sm text-black">Allow gift cards to be purchased on website</p>
                </div>
                <button
                  onClick={() => handleToggle('allow_online_purchase')}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.allow_online_purchase ? 'bg-[#FF2D8E]' : 'bg-white'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.allow_online_purchase ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">POS Purchase</p>
                  <p className="text-sm text-black">Allow gift cards to be sold in-spa</p>
                </div>
                <button
                  onClick={() => handleToggle('allow_pos_purchase')}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.allow_pos_purchase ? 'bg-[#FF2D8E]' : 'bg-white'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.allow_pos_purchase ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Amounts */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Purchase Amounts</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-black mb-1">Minimum Amount</label>
                <input
                  type="number"
                  value={settings.min_purchase_amount}
                  onChange={(e) => setSettings({ ...settings, min_purchase_amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm text-black mb-1">Maximum Amount</label>
                <input
                  type="number"
                  value={settings.max_purchase_amount}
                  onChange={(e) => setSettings({ ...settings, max_purchase_amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-black mb-2">Preset Amounts</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {settings.preset_amounts.map(amount => (
                  <span key={amount} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm flex items-center gap-2">
                    ${amount}
                    <button onClick={() => removePresetAmount(amount)} className="text-[#FF2D8E] hover:text-pink-600">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newPreset}
                  onChange={(e) => setNewPreset(e.target.value)}
                  placeholder="Add preset..."
                  className="px-3 py-2 border rounded-lg w-32"
                />
                <button onClick={addPresetAmount} className="px-3 py-2 bg-pink-100 text-pink-700 rounded-lg">
                  Add
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium">Allow Custom Amounts</p>
                <p className="text-sm text-black">Let customers enter any amount</p>
              </div>
              <button
                onClick={() => handleToggle('allow_custom_amount')}
                className={`w-12 h-6 rounded-full transition-colors ${settings.allow_custom_amount ? 'bg-[#FF2D8E]' : 'bg-white'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.allow_custom_amount ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Redemption Rules */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Redemption Rules</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Partial Redemption</p>
                  <p className="text-sm text-black">Allow using part of gift card balance</p>
                </div>
                <button
                  onClick={() => handleToggle('allow_partial_redemption')}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.allow_partial_redemption ? 'bg-[#FF2D8E]' : 'bg-white'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.allow_partial_redemption ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Split Tender</p>
                  <p className="text-sm text-black">Allow combining with other payment methods</p>
                </div>
                <button
                  onClick={() => handleToggle('allow_split_tender')}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.allow_split_tender ? 'bg-[#FF2D8E]' : 'bg-white'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.allow_split_tender ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Prompt Before Checkout</p>
                  <p className="text-sm text-black">Ask if client wants to use gift card</p>
                </div>
                <button
                  onClick={() => handleToggle('prompt_before_checkout')}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.prompt_before_checkout ? 'bg-[#FF2D8E]' : 'bg-white'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.prompt_before_checkout ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Apply to Appointments</p>
                  <p className="text-sm text-black">Automatically apply gift card if available</p>
                </div>
                <button
                  onClick={() => handleToggle('auto_apply_to_appointments')}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.auto_apply_to_appointments ? 'bg-[#FF2D8E]' : 'bg-white'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.auto_apply_to_appointments ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Expiration */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Expiration Policy</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Gift Cards Expire</p>
                <p className="text-sm text-black">Set expiration date on new gift cards</p>
              </div>
              <button
                onClick={() => handleToggle('cards_expire')}
                className={`w-12 h-6 rounded-full transition-colors ${settings.cards_expire ? 'bg-[#FF2D8E]' : 'bg-white'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.cards_expire ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {settings.cards_expire && (
              <div>
                <label className="block text-sm text-black mb-1">Expiration Period (months)</label>
                <input
                  type="number"
                  value={settings.default_expiration_months}
                  onChange={(e) => setSettings({ ...settings, default_expiration_months: parseInt(e.target.value) || 12 })}
                  className="w-32 px-3 py-2 border rounded-lg"
                  min="1"
                />
              </div>
            )}
            <p className="text-xs text-amber-600 mt-3">
              Note: Some states prohibit gift card expiration. Check your local regulations.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-3 bg-[#FF2D8E] text-white rounded-lg font-medium hover:bg-black disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Square Status */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">Square Integration</h3>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-500">✓</span>
              <span className="text-blue-700 text-sm">Connected</span>
            </div>
            <div className="mt-3">
              <label className="block text-xs text-black mb-1">Location ID</label>
              <input
                type="text"
                value={settings.square_location_id || ''}
                onChange={(e) => setSettings({ ...settings, square_location_id: e.target.value })}
                placeholder="LXXXXXXXXXXXXXXX"
                className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {/* Sync Status */}
          {syncStats && (
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-3">Sync Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-black">Total Cards</span>
                  <span className="font-medium">{syncStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Recently Synced</span>
                  <span className="text-green-600">{syncStats.recentlySynced}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Needs Sync</span>
                  <span className="text-amber-600">{syncStats.needsSync}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Errors</span>
                  <span className="text-red-600">{syncStats.hasErrors}</span>
                </div>
              </div>
              <button
                onClick={fetchSyncStats}
                className="w-full mt-3 px-3 py-2 bg-pink-100 text-pink-700 rounded-lg text-sm hover:bg-pink-200"
              >
                Refresh Status
              </button>
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <div className="space-y-2">
              <a href="/admin/gift-cards" className="block px-3 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm hover:bg-pink-100">
                → View All Gift Cards
              </a>
              <a href="/admin/finance" className="block px-3 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm hover:bg-pink-100">
                → Gift Card Liability Report
              </a>
            </div>
          </div>

          {/* Help */}
          <div className="bg-blue-50 rounded-xl p-4 text-sm">
            <h3 className="font-semibold text-blue-800 mb-2">About Gift Cards</h3>
            <p className="text-blue-600">
              Gift cards are synced with Square in real-time. All transactions are recorded and balances are always accurate.
            </p>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
