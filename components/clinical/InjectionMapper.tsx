'use client';

// ============================================================
// INJECTION MAPPER COMPONENT
// Visual face diagram for mapping injection sites
// Aesthetic Record-style clinical charting feature
// ============================================================

import { useState, useRef, useCallback, useEffect } from 'react';

export interface InjectionPoint {
  id: string;
  x_position: number;
  y_position: number;
  product_name: string;
  product_id?: string;
  lot_number?: string;
  expiration_date?: string;
  units?: number;
  volume_ml?: number;
  injection_depth?: string;
  technique?: string;
  area_label: string;
}

interface InjectionMapperProps {
  points: InjectionPoint[];
  onPointsChange?: (points: InjectionPoint[]) => void;
  readOnly?: boolean;
  products?: { id: string; name: string; type: string }[];
  className?: string;
}

// Predefined face areas for quick selection
const FACE_AREAS = [
  { label: 'Forehead', x: 50, y: 18 },
  { label: 'Glabella', x: 50, y: 28 },
  { label: "Crow's Feet L", x: 22, y: 38 },
  { label: "Crow's Feet R", x: 78, y: 38 },
  { label: 'Temple L', x: 15, y: 32 },
  { label: 'Temple R', x: 85, y: 32 },
  { label: 'Brow L', x: 35, y: 30 },
  { label: 'Brow R', x: 65, y: 30 },
  { label: 'Bunny Lines L', x: 42, y: 45 },
  { label: 'Bunny Lines R', x: 58, y: 45 },
  { label: 'Nasolabial L', x: 38, y: 60 },
  { label: 'Nasolabial R', x: 62, y: 60 },
  { label: 'Marionette L', x: 38, y: 72 },
  { label: 'Marionette R', x: 62, y: 72 },
  { label: 'Lips Upper', x: 50, y: 62 },
  { label: 'Lips Lower', x: 50, y: 68 },
  { label: 'Lip Border', x: 50, y: 65 },
  { label: 'Chin', x: 50, y: 78 },
  { label: 'Jawline L', x: 25, y: 72 },
  { label: 'Jawline R', x: 75, y: 72 },
  { label: 'Cheek L', x: 28, y: 52 },
  { label: 'Cheek R', x: 72, y: 52 },
  { label: 'Under Eye L', x: 35, y: 42 },
  { label: 'Under Eye R', x: 65, y: 42 },
];

const INJECTION_DEPTHS = ['Superficial', 'Mid-dermal', 'Deep', 'Periosteal', 'Subcutaneous'];
const TECHNIQUES = ['Linear threading', 'Fanning', 'Cross-hatching', 'Serial puncture', 'Bolus', 'Microdroplet'];

// Product presets for common injectables
const PRODUCT_PRESETS = [
  { name: 'Botox', unit: 'units', type: 'neurotoxin' },
  { name: 'Dysport', unit: 'units', type: 'neurotoxin' },
  { name: 'Xeomin', unit: 'units', type: 'neurotoxin' },
  { name: 'Jeuveau', unit: 'units', type: 'neurotoxin' },
  { name: 'Juvederm Ultra', unit: 'ml', type: 'filler' },
  { name: 'Juvederm Ultra Plus', unit: 'ml', type: 'filler' },
  { name: 'Juvederm Voluma', unit: 'ml', type: 'filler' },
  { name: 'Juvederm Vollure', unit: 'ml', type: 'filler' },
  { name: 'Juvederm Volbella', unit: 'ml', type: 'filler' },
  { name: 'Restylane', unit: 'ml', type: 'filler' },
  { name: 'Restylane Lyft', unit: 'ml', type: 'filler' },
  { name: 'Restylane Silk', unit: 'ml', type: 'filler' },
  { name: 'Restylane Defyne', unit: 'ml', type: 'filler' },
  { name: 'Restylane Refyne', unit: 'ml', type: 'filler' },
  { name: 'Sculptra', unit: 'ml', type: 'filler' },
  { name: 'Radiesse', unit: 'ml', type: 'filler' },
  { name: 'Versa', unit: 'ml', type: 'filler' },
  { name: 'RHA 2', unit: 'ml', type: 'filler' },
  { name: 'RHA 3', unit: 'ml', type: 'filler' },
  { name: 'RHA 4', unit: 'ml', type: 'filler' },
  { name: 'Kybella', unit: 'ml', type: 'deoxycholic acid' },
];

export function InjectionMapper({ 
  points, 
  onPointsChange, 
  readOnly = false,
  products = [],
  className = ''
}: InjectionMapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragPoint, setDragPoint] = useState<string | null>(null);

  const [pointForm, setPointForm] = useState({
    product_name: '',
    lot_number: '',
    expiration_date: '',
    units: '',
    volume_ml: '',
    injection_depth: '',
    technique: '',
    area_label: '',
  });

  // Handle click on face diagram
  const handleDiagramClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly || dragPoint) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Find closest face area
    const closest = FACE_AREAS.reduce((prev, curr) => {
      const prevDist = Math.hypot(prev.x - x, prev.y - y);
      const currDist = Math.hypot(curr.x - x, curr.y - y);
      return currDist < prevDist ? curr : prev;
    });

    setPendingPosition({ x, y });
    setPointForm(prev => ({ ...prev, area_label: closest.label }));
    setShowAddModal(true);
  };

  // Add new injection point
  const handleAddPoint = () => {
    if (!pendingPosition || !pointForm.product_name || !pointForm.area_label) return;

    const newPoint: InjectionPoint = {
      id: `point-${Date.now()}`,
      x_position: pendingPosition.x,
      y_position: pendingPosition.y,
      product_name: pointForm.product_name,
      lot_number: pointForm.lot_number || undefined,
      expiration_date: pointForm.expiration_date || undefined,
      units: pointForm.units ? parseFloat(pointForm.units) : undefined,
      volume_ml: pointForm.volume_ml ? parseFloat(pointForm.volume_ml) : undefined,
      injection_depth: pointForm.injection_depth || undefined,
      technique: pointForm.technique || undefined,
      area_label: pointForm.area_label,
    };

    onPointsChange?.([...points, newPoint]);
    setShowAddModal(false);
    setPendingPosition(null);
    setPointForm({
      product_name: '',
      lot_number: '',
      expiration_date: '',
      units: '',
      volume_ml: '',
      injection_depth: '',
      technique: '',
      area_label: '',
    });
  };

  // Remove injection point
  const handleRemovePoint = (id: string) => {
    onPointsChange?.(points.filter(p => p.id !== id));
    setSelectedPoint(null);
  };

  // Get color based on product type
  const getPointColor = (productName: string) => {
    const preset = PRODUCT_PRESETS.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (preset?.type === 'neurotoxin') return 'bg-blue-500 border-blue-600';
    if (preset?.type === 'filler') return 'bg-pink-500 border-pink-600';
    return 'bg-purple-500 border-purple-600';
  };

  // Calculate totals
  const totals = points.reduce((acc, p) => {
    const key = p.product_name;
    if (!acc[key]) acc[key] = { units: 0, ml: 0 };
    if (p.units) acc[key].units += p.units;
    if (p.volume_ml) acc[key].ml += p.volume_ml;
    return acc;
  }, {} as Record<string, { units: number; ml: number }>);

  return (
    <div className={`flex flex-col lg:flex-row gap-6 ${className}`}>
      {/* Face Diagram */}
      <div className="flex-1">
        <div 
          ref={containerRef}
          onClick={handleDiagramClick}
          className={`relative w-full aspect-[3/4] max-w-md mx-auto bg-gradient-to-b from-pink-50 to-white rounded-2xl border-2 border-gray-200 overflow-hidden ${!readOnly ? 'cursor-crosshair' : ''}`}
        >
          {/* Face outline SVG */}
          <svg viewBox="0 0 100 133" className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Face outline */}
            <ellipse cx="50" cy="50" rx="35" ry="45" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            
            {/* Hairline */}
            <path d="M 20 25 Q 50 5 80 25" fill="none" stroke="#e5e7eb" strokeWidth="0.3" />
            
            {/* Eyebrows */}
            <path d="M 28 30 Q 37 27 45 30" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
            <path d="M 55 30 Q 63 27 72 30" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
            
            {/* Eyes */}
            <ellipse cx="35" cy="38" rx="7" ry="4" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
            <ellipse cx="65" cy="38" rx="7" ry="4" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
            
            {/* Nose */}
            <path d="M 50 35 L 50 52 Q 45 55 42 52" fill="none" stroke="#d1d5db" strokeWidth="0.3" />
            <path d="M 50 52 Q 55 55 58 52" fill="none" stroke="#d1d5db" strokeWidth="0.3" />
            
            {/* Lips */}
            <path d="M 40 63 Q 50 60 60 63" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
            <path d="M 40 63 Q 50 70 60 63" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
            
            {/* Jaw */}
            <path d="M 15 50 Q 15 75 50 90 Q 85 75 85 50" fill="none" stroke="#e5e7eb" strokeWidth="0.3" />
            
            {/* Guide dots for face areas */}
            {!readOnly && FACE_AREAS.map((area, i) => (
              <circle
                key={i}
                cx={area.x}
                cy={area.y}
                r="1.5"
                fill="#f3f4f6"
                stroke="#d1d5db"
                strokeWidth="0.2"
                className="opacity-40"
              />
            ))}
          </svg>

          {/* Injection points */}
          {points.map((point) => (
            <div
              key={point.id}
              style={{
                left: `${point.x_position}%`,
                top: `${point.y_position}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPoint(selectedPoint === point.id ? null : point.id);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer transition-all ${getPointColor(point.product_name)} ${selectedPoint === point.id ? 'ring-2 ring-offset-2 ring-pink-400 scale-125' : 'hover:scale-110'}`}
            >
              {point.units || point.volume_ml || '•'}
            </div>
          ))}

          {/* Click hint */}
          {!readOnly && points.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-gray-400 text-sm">Click to add injection points</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-gray-600">Neurotoxin</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            <span className="text-gray-600">Filler</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span className="text-gray-600">Other</span>
          </div>
        </div>
      </div>

      {/* Side panel - Points list & Totals */}
      <div className="lg:w-72 space-y-4">
        {/* Totals */}
        {Object.keys(totals).length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Product Totals</h3>
            <div className="space-y-2">
              {Object.entries(totals).map(([product, amounts]) => (
                <div key={product} className="flex justify-between text-sm">
                  <span className="text-gray-600">{product}</span>
                  <span className="font-medium text-gray-900">
                    {amounts.units > 0 && `${amounts.units} units`}
                    {amounts.units > 0 && amounts.ml > 0 && ' / '}
                    {amounts.ml > 0 && `${amounts.ml} ml`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Points list */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Injection Points ({points.length})</h3>
          </div>
          
          {points.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              No points added yet
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {points.map((point) => (
                <div 
                  key={point.id}
                  onClick={() => setSelectedPoint(selectedPoint === point.id ? null : point.id)}
                  className={`p-3 cursor-pointer transition-colors ${selectedPoint === point.id ? 'bg-pink-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{point.area_label}</p>
                      <p className="text-xs text-gray-500">
                        {point.product_name}
                        {point.units && ` • ${point.units} units`}
                        {point.volume_ml && ` • ${point.volume_ml} ml`}
                      </p>
                      {point.technique && (
                        <p className="text-xs text-gray-400">{point.technique}</p>
                      )}
                    </div>
                    {!readOnly && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePoint(point.id);
                        }}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Point Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add Injection Point</h2>
              <p className="text-sm text-gray-500">Document the injection details</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
                <select
                  value={pointForm.area_label}
                  onChange={(e) => setPointForm(prev => ({ ...prev, area_label: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Select area...</option>
                  {FACE_AREAS.map(area => (
                    <option key={area.label} value={area.label}>{area.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                <select
                  value={pointForm.product_name}
                  onChange={(e) => setPointForm(prev => ({ ...prev, product_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Select product...</option>
                  <optgroup label="Neurotoxins">
                    {PRODUCT_PRESETS.filter(p => p.type === 'neurotoxin').map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Fillers">
                    {PRODUCT_PRESETS.filter(p => p.type === 'filler').map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Other">
                    {PRODUCT_PRESETS.filter(p => p.type !== 'neurotoxin' && p.type !== 'filler').map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                  <input
                    type="number"
                    step="0.5"
                    value={pointForm.units}
                    onChange={(e) => setPointForm(prev => ({ ...prev, units: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Volume (ml)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pointForm.volume_ml}
                    onChange={(e) => setPointForm(prev => ({ ...prev, volume_ml: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="e.g., 0.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
                  <input
                    type="text"
                    value={pointForm.lot_number}
                    onChange={(e) => setPointForm(prev => ({ ...prev, lot_number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="e.g., AB12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                  <input
                    type="date"
                    value={pointForm.expiration_date}
                    onChange={(e) => setPointForm(prev => ({ ...prev, expiration_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Injection Depth</label>
                <select
                  value={pointForm.injection_depth}
                  onChange={(e) => setPointForm(prev => ({ ...prev, injection_depth: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Select depth...</option>
                  {INJECTION_DEPTHS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technique</label>
                <select
                  value={pointForm.technique}
                  onChange={(e) => setPointForm(prev => ({ ...prev, technique: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Select technique...</option>
                  {TECHNIQUES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setPendingPosition(null);
                }}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPoint}
                disabled={!pointForm.product_name || !pointForm.area_label}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                Add Point
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InjectionMapper;
