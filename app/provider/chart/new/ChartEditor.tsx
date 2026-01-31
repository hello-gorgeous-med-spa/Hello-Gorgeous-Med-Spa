'use client';

// ============================================================
// CHART EDITOR COMPONENT
// SOAP Note Documentation Interface
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ChartEditorProps {
  clientId: string;
  appointmentId?: string;
  defaultService?: string;
}

// Common treatment areas for Botox
const BOTOX_AREAS = [
  { name: 'Glabella', defaultUnits: 20 },
  { name: 'Forehead', defaultUnits: 20 },
  { name: 'Crows Feet (L)', defaultUnits: 12 },
  { name: 'Crows Feet (R)', defaultUnits: 12 },
  { name: 'Brow Lift', defaultUnits: 4 },
  { name: 'Bunny Lines', defaultUnits: 4 },
  { name: 'Lip Flip', defaultUnits: 4 },
  { name: 'Chin (Mentalis)', defaultUnits: 6 },
  { name: 'Masseter (L)', defaultUnits: 25 },
  { name: 'Masseter (R)', defaultUnits: 25 },
  { name: 'Neck Bands', defaultUnits: 30 },
];

const PRODUCTS = [
  { name: 'Botox', brand: 'Allergan' },
  { name: 'Dysport', brand: 'Galderma' },
  { name: 'Jeuveau', brand: 'Evolus' },
  { name: 'Juvederm Ultra', brand: 'Allergan' },
  { name: 'Juvederm Voluma', brand: 'Allergan' },
  { name: 'Juvederm Volbella', brand: 'Allergan' },
  { name: 'Restylane', brand: 'Galderma' },
  { name: 'Restylane Kysse', brand: 'Galderma' },
  { name: 'RHA Collection', brand: 'Revance' },
];

export default function ChartEditor({
  clientId,
  appointmentId,
  defaultService,
}: ChartEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'soap' | 'treatment' | 'photos'>('soap');
  const [isSaving, setIsSaving] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  // SOAP Note State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  // Vitals State
  const [vitals, setVitals] = useState({
    bp: '',
    hr: '',
    weight: '',
  });

  // Treatment State
  const [selectedProduct, setSelectedProduct] = useState('Botox');
  const [lotNumber, setLotNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [injectionSites, setInjectionSites] = useState<
    { area: string; units: number; notes: string }[]
  >([]);

  // Checkboxes
  const [allergiesReviewed, setAllergiesReviewed] = useState(false);
  const [medicationsReviewed, setMedicationsReviewed] = useState(false);
  const [consentObtained, setConsentObtained] = useState(false);

  const addInjectionSite = (area: string, defaultUnits: number) => {
    if (!injectionSites.find((s) => s.area === area)) {
      setInjectionSites([...injectionSites, { area, units: defaultUnits, notes: '' }]);
    }
  };

  const updateInjectionSite = (index: number, field: string, value: any) => {
    const updated = [...injectionSites];
    updated[index] = { ...updated[index], [field]: value };
    setInjectionSites(updated);
  };

  const removeInjectionSite = (index: number) => {
    setInjectionSites(injectionSites.filter((_, i) => i !== index));
  };

  const totalUnits = injectionSites.reduce((sum, site) => sum + site.units, 0);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Draft saved!');
  };

  const handleSign = async () => {
    if (!allergiesReviewed || !medicationsReviewed || !consentObtained) {
      alert('Please confirm all checkboxes before signing.');
      return;
    }

    setIsSigning(true);
    // Simulate sign
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSigning(false);
    alert('Chart signed successfully!');
    router.push(`/provider/clients/${clientId}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('soap')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'soap'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 SOAP Note
          </button>
          <button
            onClick={() => setActiveTab('treatment')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'treatment'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            💉 Treatment Details
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'photos'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📷 Photos
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* SOAP Note Tab */}
        {activeTab === 'soap' && (
          <div className="space-y-6">
            {/* Chief Complaint */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chief Complaint
              </label>
              <input
                type="text"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Patient presents for..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Vitals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vitals (Optional)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Blood Pressure</label>
                  <input
                    type="text"
                    value={vitals.bp}
                    onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                    placeholder="120/80"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Heart Rate</label>
                  <input
                    type="text"
                    value={vitals.hr}
                    onChange={(e) => setVitals({ ...vitals, hr: e.target.value })}
                    placeholder="72 bpm"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Weight</label>
                  <input
                    type="text"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    placeholder="150 lbs"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Subjective */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-indigo-600 font-bold">S</span>ubjective
                <span className="text-gray-400 font-normal ml-2">Patient's description</span>
              </label>
              <textarea
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                rows={3}
                placeholder="Patient reports concerns with..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Objective */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-indigo-600 font-bold">O</span>bjective
                <span className="text-gray-400 font-normal ml-2">Provider observations</span>
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
                placeholder="Physical exam reveals..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Assessment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-indigo-600 font-bold">A</span>ssessment
                <span className="text-gray-400 font-normal ml-2">Clinical impression</span>
              </label>
              <textarea
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                rows={2}
                placeholder="Assessment/diagnosis..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-indigo-600 font-bold">P</span>lan
                <span className="text-gray-400 font-normal ml-2">Treatment plan & follow-up</span>
              </label>
              <textarea
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                rows={4}
                placeholder="Treatment administered, post-care instructions, follow-up recommendations..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Treatment Details Tab */}
        {activeTab === 'treatment' && (
          <div className="space-y-6">
            {/* Product Selection */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} ({p.brand})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lot Number
                </label>
                <input
                  type="text"
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  placeholder="Enter lot #"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Injection Sites */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Injection Sites
              </label>

              {/* Quick Add Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {BOTOX_AREAS.map((area) => (
                  <button
                    key={area.name}
                    onClick={() => addInjectionSite(area.name, area.defaultUnits)}
                    disabled={injectionSites.some((s) => s.area === area.name)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      injectionSites.some((s) => s.area === area.name)
                        ? 'bg-indigo-100 border-indigo-200 text-indigo-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    + {area.name}
                  </button>
                ))}
              </div>

              {/* Selected Sites */}
              {injectionSites.length > 0 ? (
                <div className="space-y-3">
                  {injectionSites.map((site, index) => (
                    <div
                      key={site.area}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{site.area}</p>
                      </div>
                      <div className="w-24">
                        <label className="text-xs text-gray-500">Units</label>
                        <input
                          type="number"
                          value={site.units}
                          onChange={(e) =>
                            updateInjectionSite(index, 'units', parseInt(e.target.value) || 0)
                          }
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Notes</label>
                        <input
                          type="text"
                          value={site.notes}
                          onChange={(e) => updateInjectionSite(index, 'notes', e.target.value)}
                          placeholder="Optional notes"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <button
                        onClick={() => removeInjectionSite(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 rounded-xl">
                    <span className="font-semibold text-indigo-900">Total Units</span>
                    <span className="text-2xl font-bold text-indigo-600">{totalUnits}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Click areas above to add injection sites
                </div>
              )}
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Before Photos */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Before Photos</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-600">Click to upload or drag & drop</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* After Photos */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">After Photos</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-600">Click to upload or drag & drop</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-sm text-amber-800">
                <strong>📋 Reminder:</strong> Ensure photo consent is documented before taking patient photos.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Confirmations & Actions */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          {/* Confirmations */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allergiesReviewed}
                onChange={(e) => setAllergiesReviewed(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span>Allergies reviewed with patient</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={medicationsReviewed}
                onChange={(e) => setMedicationsReviewed(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span>Medications reviewed with patient</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={consentObtained}
                onChange={(e) => setConsentObtained(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span>Informed consent obtained</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button
              onClick={handleSign}
              disabled={isSigning || !allergiesReviewed || !medicationsReviewed || !consentObtained}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigning ? 'Signing...' : '✍️ Sign & Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
