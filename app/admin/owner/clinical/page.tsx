'use client';

// ============================================================
// CLINICAL / EHR RULES - OWNER CONTROLLED
// Charting requirements, signatures, locking behavior
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

export default function ClinicalRulesPage() {
  const [chartRequirements, setChartRequirements] = useState({
    require_subjective: true,
    require_objective: true,
    require_assessment: true,
    require_plan: true,
    require_signature: true,
    lock_after_signature: true,
    allow_addendum_after_lock: true,
    auto_save_interval: 30,
  });

  const [photoRequirements, setPhotoRequirements] = useState({
    require_before_photo_injectables: true,
    require_after_photo_injectables: false,
    require_before_photo_laser: true,
    require_after_photo_laser: true,
    photo_quality_minimum: 'high',
    require_consent_for_photos: true,
  });

  const [lotTracking, setLotTracking] = useState({
    require_lot_number: true,
    require_expiration: true,
    block_expired_products: true,
    warn_expiring_days: 30,
  });

  const [auditSettings, setAuditSettings] = useState({
    log_all_chart_access: true,
    log_all_edits: true,
    retention_years: 7,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Clinical rules saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <OwnerLayout title="Clinical / EHR Rules" description="Charting requirements and compliance settings">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Chart Requirements */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Chart Requirements</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'require_subjective', label: 'Require Subjective (S)' },
              { key: 'require_objective', label: 'Require Objective (O)' },
              { key: 'require_assessment', label: 'Require Assessment (A)' },
              { key: 'require_plan', label: 'Require Plan (P)' },
              { key: 'require_signature', label: 'Require Provider Signature' },
              { key: 'lock_after_signature', label: 'Lock Chart After Signature' },
              { key: 'allow_addendum_after_lock', label: 'Allow Addendums After Lock' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={chartRequirements[item.key as keyof typeof chartRequirements] as boolean}
                  onChange={(e) => setChartRequirements(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="w-5 h-5 text-purple-600"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Save Interval (seconds)</label>
            <input
              type="number"
              value={chartRequirements.auto_save_interval}
              onChange={(e) => setChartRequirements(prev => ({ ...prev, auto_save_interval: parseInt(e.target.value) || 30 }))}
              className="w-full px-4 py-2 border rounded-lg"
              min="10"
            />
          </div>
        </div>

        {/* Photo Requirements */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Photo Requirements</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'require_before_photo_injectables', label: 'Before Photo - Injectables' },
              { key: 'require_after_photo_injectables', label: 'After Photo - Injectables' },
              { key: 'require_before_photo_laser', label: 'Before Photo - Laser' },
              { key: 'require_after_photo_laser', label: 'After Photo - Laser' },
              { key: 'require_consent_for_photos', label: 'Require Consent for Photos' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={photoRequirements[item.key as keyof typeof photoRequirements] as boolean}
                  onChange={(e) => setPhotoRequirements(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="w-5 h-5 text-purple-600"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Lot Tracking */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Lot Tracking & Expiration</h2>
          <div className="space-y-4">
            {[
              { key: 'require_lot_number', label: 'Require Lot Number Entry' },
              { key: 'require_expiration', label: 'Require Expiration Date Entry' },
              { key: 'block_expired_products', label: 'Block Use of Expired Products' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={lotTracking[item.key as keyof typeof lotTracking] as boolean}
                  onChange={(e) => setLotTracking(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="w-5 h-5 text-purple-600"
                />
                <span>{item.label}</span>
              </label>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warn When Expiring Within (days)</label>
              <input
                type="number"
                value={lotTracking.warn_expiring_days}
                onChange={(e) => setLotTracking(prev => ({ ...prev, warn_expiring_days: parseInt(e.target.value) || 30 }))}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Audit Settings */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Audit & Compliance</h2>
          <div className="space-y-4">
            {[
              { key: 'log_all_chart_access', label: 'Log All Chart Access' },
              { key: 'log_all_edits', label: 'Log All Chart Edits' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={auditSettings[item.key as keyof typeof auditSettings] as boolean}
                  onChange={(e) => setAuditSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="w-5 h-5 text-purple-600"
                />
                <span>{item.label}</span>
              </label>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Record Retention (years)</label>
              <input
                type="number"
                value={auditSettings.retention_years}
                onChange={(e) => setAuditSettings(prev => ({ ...prev, retention_years: parseInt(e.target.value) || 7 }))}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">HIPAA recommends minimum 6 years</p>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={saveSettings} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
            Save Clinical Rules
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
