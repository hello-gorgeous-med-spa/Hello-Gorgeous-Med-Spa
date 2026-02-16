'use client';

// ============================================================
// INJECTION MAPPING PAGE - Aesthetic Record Style
// Professional face mapping for clinical documentation
// ============================================================

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

interface InjectionPoint {
  id: string;
  x: number;
  y: number;
  product: string;
  units?: number;
  ml?: number;
  area: string;
  depth?: string;
  technique?: string;
  lot?: string;
}

interface InjectionMap {
  id: string;
  client_id: string;
  notes: string;
  points: InjectionPoint[];
  created_at: string;
}

// Products with colors
const PRODUCTS = {
  neurotoxins: [
    { name: 'Botox', color: '#3B82F6', unit: 'units' },
    { name: 'Dysport', color: '#60A5FA', unit: 'units' },
    { name: 'Xeomin', color: '#2563EB', unit: 'units' },
    { name: 'Jeuveau', color: '#1D4ED8', unit: 'units' },
  ],
  fillers: [
    { name: 'Juvederm Ultra', color: '#EC4899', unit: 'ml' },
    { name: 'Juvederm Voluma', color: '#DB2777', unit: 'ml' },
    { name: 'Juvederm Vollure', color: '#BE185D', unit: 'ml' },
    { name: 'Juvederm Volbella', color: '#F472B6', unit: 'ml' },
    { name: 'Restylane', color: '#A855F7', unit: 'ml' },
    { name: 'Restylane Lyft', color: '#9333EA', unit: 'ml' },
    { name: 'Restylane Defyne', color: '#7C3AED', unit: 'ml' },
    { name: 'Sculptra', color: '#C084FC', unit: 'ml' },
    { name: 'Radiesse', color: '#E879F9', unit: 'ml' },
    { name: 'RHA Collection', color: '#D946EF', unit: 'ml' },
    { name: 'Versa', color: '#F0ABFC', unit: 'ml' },
  ],
  other: [
    { name: 'Kybella', color: '#F59E0B', unit: 'ml' },
    { name: 'PRP', color: '#EF4444', unit: 'ml' },
  ],
};

const FACE_AREAS = [
  'Forehead', 'Glabella', "Crow's Feet L", "Crow's Feet R", 
  'Temple L', 'Temple R', 'Brow L', 'Brow R',
  'Under Eye L', 'Under Eye R', 'Cheek L', 'Cheek R',
  'Nasolabial L', 'Nasolabial R', 'Lips Upper', 'Lips Lower',
  'Marionette L', 'Marionette R', 'Chin', 'Jawline L', 'Jawline R',
  'Bunny Lines', 'Nose', 'Neck'
];

const DEPTHS = ['Intradermal', 'Subdermal', 'Subcutaneous', 'Periosteal', 'Intramuscular'];
const TECHNIQUES = ['Bolus', 'Linear Threading', 'Fanning', 'Cross-hatching', 'Serial Puncture', 'Microdroplet'];

function InjectionMapContent() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const clientIdParam = searchParams.get('client');

  // State
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(clientIdParam || '');
  const [clientSearch, setClientSearch] = useState('');
  const [showClientPicker, setShowClientPicker] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS.neurotoxins[0]);
  const [points, setPoints] = useState<InjectionPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [existingMaps, setExistingMaps] = useState<InjectionMap[]>([]);
  
  const [quickUnits, setQuickUnits] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPointEditor, setShowPointEditor] = useState(false);
  const [editingPoint, setEditingPoint] = useState<InjectionPoint | null>(null);

  // Fetch clients
  useEffect(() => {
    fetch('/api/clients?limit=200')
      .then(res => res.json())
      .then(data => {
        const sorted = (data.clients || []).sort((a: Client, b: Client) => 
          (a.last_name || '').localeCompare(b.last_name || '')
        );
        setClients(sorted);
      })
      .catch(console.error);
  }, []);

  // Fetch client's maps when selected
  useEffect(() => {
    if (selectedClientId) {
      fetch(`/api/injection-maps?client_id=${selectedClientId}`)
        .then(res => res.json())
        .then(data => setExistingMaps(data.maps || []))
        .catch(console.error);
    }
  }, [selectedClientId]);

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const filteredClients = clients.filter(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Handle click on face
  const handleFaceClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Determine closest area based on position
    let area = 'Face';
    if (y < 25) area = 'Forehead';
    else if (y < 30 && x > 40 && x < 60) area = 'Glabella';
    else if (y < 35 && x < 30) area = 'Temple L';
    else if (y < 35 && x > 70) area = 'Temple R';
    else if (y >= 35 && y < 45 && x < 30) area = "Crow's Feet L";
    else if (y >= 35 && y < 45 && x > 70) area = "Crow's Feet R";
    else if (y >= 38 && y < 48 && x >= 25 && x < 42) area = 'Under Eye L';
    else if (y >= 38 && y < 48 && x > 58 && x <= 75) area = 'Under Eye R';
    else if (y >= 45 && y < 58 && x < 40) area = 'Cheek L';
    else if (y >= 45 && y < 58 && x > 60) area = 'Cheek R';
    else if (y >= 55 && y < 68 && x < 45) area = 'Nasolabial L';
    else if (y >= 55 && y < 68 && x > 55) area = 'Nasolabial R';
    else if (y >= 60 && y < 68 && x >= 45 && x <= 55) area = 'Lips Upper';
    else if (y >= 68 && y < 75 && x >= 40 && x <= 60) area = 'Lips Lower';
    else if (y >= 72 && y < 82 && x < 38) area = 'Marionette L';
    else if (y >= 72 && y < 82 && x > 62) area = 'Marionette R';
    else if (y >= 75 && y < 85 && x >= 40 && x <= 60) area = 'Chin';
    else if (y >= 78 && x < 35) area = 'Jawline L';
    else if (y >= 78 && x > 65) area = 'Jawline R';

    const newPoint: InjectionPoint = {
      id: `p-${Date.now()}`,
      x,
      y,
      product: selectedProduct.name,
      units: selectedProduct.unit === 'units' ? quickUnits : undefined,
      ml: selectedProduct.unit === 'ml' ? 0.1 : undefined,
      area,
    };

    setPoints([...points, newPoint]);
    setEditingPoint(newPoint);
    setShowPointEditor(true);
  };

  // Update point
  const updatePoint = (updates: Partial<InjectionPoint>) => {
    if (!editingPoint) return;
    setPoints(points.map(p => 
      p.id === editingPoint.id ? { ...p, ...updates } : p
    ));
    setEditingPoint({ ...editingPoint, ...updates });
  };

  // Delete point
  const deletePoint = (id: string) => {
    setPoints(points.filter(p => p.id !== id));
    setShowPointEditor(false);
    setEditingPoint(null);
  };

  // Get product color
  const getProductColor = (name: string) => {
    const all = [...PRODUCTS.neurotoxins, ...PRODUCTS.fillers, ...PRODUCTS.other];
    return all.find(p => p.name === name)?.color || '#9CA3AF';
  };

  // Calculate totals
  const totals = points.reduce((acc, p) => {
    if (!acc[p.product]) acc[p.product] = { units: 0, ml: 0 };
    if (p.units) acc[p.product].units += p.units;
    if (p.ml) acc[p.product].ml += p.ml;
    return acc;
  }, {} as Record<string, { units: number; ml: number }>);

  // Save map
  const handleSave = async () => {
    if (!selectedClientId) {
      toast.error('Please select a client first');
      return;
    }
    if (points.length === 0) {
      toast.error('Add at least one injection point');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/injection-maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClientId,
          notes,
          points: points.map(p => ({
            x_position: p.x,
            y_position: p.y,
            product_name: p.product,
            units: p.units,
            volume_ml: p.ml,
            area_label: p.area,
            injection_depth: p.depth,
            technique: p.technique,
            lot_number: p.lot,
          })),
        }),
      });

      if (!res.ok) throw new Error('Save failed');
      
      toast.success('Injection map saved!');
      setPoints([]);
      setNotes('');
      
      // Refresh maps
      const mapsRes = await fetch(`/api/injection-maps?client_id=${selectedClientId}`);
      const mapsData = await mapsRes.json();
      setExistingMaps(mapsData.maps || []);
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-white">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-black px-4 py-2 flex items-center justify-between gap-4">
        {/* Client Selector */}
        <div className="relative">
          <button
            onClick={() => setShowClientPicker(!showClientPicker)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-white rounded-lg transition-colors"
          >
            {selectedClient ? (
              <>
                <div className="w-8 h-8 rounded-full bg-[#FF2D8E] text-white flex items-center justify-center font-semibold text-sm">
                  {selectedClient.first_name[0]}{selectedClient.last_name[0]}
                </div>
                <span className="font-medium">{selectedClient.first_name} {selectedClient.last_name}</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-black">Select Client</span>
              </>
            )}
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Client Dropdown */}
          {showClientPicker && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-black z-50 overflow-hidden">
              <div className="p-2 border-b border-black">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                  autoFocus
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredClients.length === 0 ? (
                  <p className="p-4 text-black text-sm text-center">No clients found</p>
                ) : (
                  filteredClients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setShowClientPicker(false);
                        setClientSearch('');
                        router.push(`/admin/charting/injection-map?client=${client.id}`);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-white flex items-center gap-3 ${
                        selectedClientId === client.id ? 'bg-pink-50' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-medium">
                        {client.first_name[0]}{client.last_name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-black">{client.first_name} {client.last_name}</p>
                        {client.email && <p className="text-xs text-black">{client.email}</p>}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Units Adjuster */}
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1">
          <span className="text-sm text-black">Quick Add:</span>
          <button 
            onClick={() => setQuickUnits(Math.max(1, quickUnits - 1))}
            className="w-7 h-7 rounded bg-white border border-black hover:bg-white font-bold text-black"
          >
            -
          </button>
          <span className="w-8 text-center font-semibold">{quickUnits}</span>
          <button 
            onClick={() => setQuickUnits(quickUnits + 1)}
            className="w-7 h-7 rounded bg-white border border-black hover:bg-white font-bold text-black"
          >
            +
          </button>
          <span className="text-sm text-black">{selectedProduct.unit}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {points.length > 0 && (
            <button
              onClick={() => setPoints([])}
              className="px-3 py-2 text-black hover:bg-white rounded-lg text-sm"
            >
              Clear All
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !selectedClientId || points.length === 0}
            className="px-5 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {saving ? 'Saving...' : 'Save Map'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Product Toolbar - Left */}
        <div className="w-48 bg-white border-r border-black overflow-y-auto">
          <div className="p-3 border-b border-black">
            <h3 className="font-semibold text-black text-xs uppercase tracking-wide">Neurotoxins</h3>
          </div>
          <div className="p-2 space-y-1">
            {PRODUCTS.neurotoxins.map(product => (
              <button
                key={product.name}
                onClick={() => setSelectedProduct(product)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  selectedProduct.name === product.name 
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                    : 'hover:bg-white text-black'
                }`}
              >
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: product.color }}
                />
                <span className="truncate">{product.name}</span>
              </button>
            ))}
          </div>

          <div className="p-3 border-b border-t border-black mt-2">
            <h3 className="font-semibold text-black text-xs uppercase tracking-wide">Fillers</h3>
          </div>
          <div className="p-2 space-y-1">
            {PRODUCTS.fillers.map(product => (
              <button
                key={product.name}
                onClick={() => setSelectedProduct(product)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  selectedProduct.name === product.name 
                    ? 'bg-pink-50 text-pink-700 ring-1 ring-pink-200' 
                    : 'hover:bg-white text-black'
                }`}
              >
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: product.color }}
                />
                <span className="truncate">{product.name}</span>
              </button>
            ))}
          </div>

          <div className="p-3 border-b border-t border-black mt-2">
            <h3 className="font-semibold text-black text-xs uppercase tracking-wide">Other</h3>
          </div>
          <div className="p-2 space-y-1">
            {PRODUCTS.other.map(product => (
              <button
                key={product.name}
                onClick={() => setSelectedProduct(product)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  selectedProduct.name === product.name 
                    ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' 
                    : 'hover:bg-white text-black'
                }`}
              >
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: product.color }}
                />
                <span className="truncate">{product.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Face Canvas - Center */}
        <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-pink-50 via-white to-pink-50">
          <div 
            ref={canvasRef}
            onClick={handleFaceClick}
            className="relative bg-white rounded-3xl shadow-lg cursor-crosshair overflow-hidden"
            style={{ width: '400px', height: '520px' }}
          >
            {/* Face SVG */}
            <svg viewBox="0 0 100 130" className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Background */}
              <rect width="100" height="130" fill="#fef7f7" />
              
              {/* Face outline */}
              <ellipse cx="50" cy="55" rx="38" ry="48" fill="#fff5f5" stroke="#fecaca" strokeWidth="0.5" />
              
              {/* Hairline */}
              <path d="M 15 30 Q 50 0 85 30" fill="none" stroke="#e7e5e4" strokeWidth="0.8" />
              
              {/* Forehead lines */}
              <path d="M 30 20 Q 50 18 70 20" fill="none" stroke="#fde2e2" strokeWidth="0.3" strokeDasharray="1,1" />
              <path d="M 32 24 Q 50 22 68 24" fill="none" stroke="#fde2e2" strokeWidth="0.3" strokeDasharray="1,1" />
              
              {/* Eyebrows */}
              <path d="M 26 35 Q 35 31 44 34" fill="none" stroke="#d4d4d8" strokeWidth="0.8" />
              <path d="M 56 34 Q 65 31 74 35" fill="none" stroke="#d4d4d8" strokeWidth="0.8" />
              
              {/* Eyes */}
              <ellipse cx="35" cy="42" rx="8" ry="4.5" fill="#fff" stroke="#d4d4d8" strokeWidth="0.5" />
              <ellipse cx="65" cy="42" rx="8" ry="4.5" fill="#fff" stroke="#d4d4d8" strokeWidth="0.5" />
              <circle cx="35" cy="42" r="2.5" fill="#a8a29e" />
              <circle cx="65" cy="42" r="2.5" fill="#a8a29e" />
              
              {/* Under eyes / tear troughs */}
              <path d="M 28 47 Q 35 49 42 47" fill="none" stroke="#fde2e2" strokeWidth="0.4" />
              <path d="M 58 47 Q 65 49 72 47" fill="none" stroke="#fde2e2" strokeWidth="0.4" />
              
              {/* Nose */}
              <path d="M 50 38 L 50 58" fill="none" stroke="#e7e5e4" strokeWidth="0.4" />
              <path d="M 44 60 Q 47 63 50 62 Q 53 63 56 60" fill="none" stroke="#d4d4d8" strokeWidth="0.5" />
              
              {/* Nasolabial folds */}
              <path d="M 38 55 Q 36 65 40 78" fill="none" stroke="#fde2e2" strokeWidth="0.4" strokeDasharray="2,1" />
              <path d="M 62 55 Q 64 65 60 78" fill="none" stroke="#fde2e2" strokeWidth="0.4" strokeDasharray="2,1" />
              
              {/* Lips */}
              <path d="M 40 72 Q 50 68 60 72" fill="none" stroke="#f9a8d4" strokeWidth="0.8" />
              <ellipse cx="50" cy="74" rx="10" ry="4" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="0.5" />
              
              {/* Marionette lines */}
              <path d="M 38 78 Q 36 85 38 92" fill="none" stroke="#fde2e2" strokeWidth="0.3" strokeDasharray="1,1" />
              <path d="M 62 78 Q 64 85 62 92" fill="none" stroke="#fde2e2" strokeWidth="0.3" strokeDasharray="1,1" />
              
              {/* Chin */}
              <ellipse cx="50" cy="92" rx="12" ry="6" fill="none" stroke="#fde2e2" strokeWidth="0.4" />
              
              {/* Jawline */}
              <path d="M 12 55 Q 12 85 50 105 Q 88 85 88 55" fill="none" stroke="#e7e5e4" strokeWidth="0.5" />
              
              {/* Cheekbones */}
              <ellipse cx="28" cy="55" rx="8" ry="5" fill="none" stroke="#fde2e2" strokeWidth="0.3" strokeDasharray="1,1" />
              <ellipse cx="72" cy="55" rx="8" ry="5" fill="none" stroke="#fde2e2" strokeWidth="0.3" strokeDasharray="1,1" />
              
              {/* Temple areas */}
              <circle cx="18" cy="38" r="6" fill="none" stroke="#fde2e2" strokeWidth="0.3" strokeDasharray="1,1" />
              <circle cx="82" cy="38" r="6" fill="none" stroke="#fde2e2" strokeWidth="0.3" strokeDasharray="1,1" />
              
              {/* Grid dots for reference */}
              {[20, 35, 50, 65, 80].map(x => 
                [20, 35, 50, 65, 80, 95].map(y => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="0.5" fill="#e5e7eb" opacity="0.5" />
                ))
              )}
            </svg>

            {/* Injection Points */}
            {points.map((point) => (
              <div
                key={point.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingPoint(point);
                  setShowPointEditor(true);
                }}
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  backgroundColor: getProductColor(point.product),
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold cursor-pointer shadow-md border-2 border-white transition-transform hover:scale-110 ${
                  editingPoint?.id === point.id ? 'ring-2 ring-offset-2 ring-pink-400 scale-125' : ''
                }`}
              >
                {point.units || (point.ml ? point.ml.toFixed(1) : '•')}
              </div>
            ))}

            {/* Click hint */}
            {points.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-black">
                  <p className="text-sm">Click anywhere to add injection points</p>
                  <p className="text-xs mt-1">Selected: {selectedProduct.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Details & History */}
        <div className="w-72 bg-white border-l border-black overflow-y-auto flex flex-col">
          {/* Product Totals */}
          {Object.keys(totals).length > 0 && (
            <div className="p-4 border-b border-black">
              <h3 className="font-semibold text-black text-sm mb-3">Treatment Summary</h3>
              <div className="space-y-2">
                {Object.entries(totals).map(([product, amounts]) => (
                  <div key={product} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getProductColor(product) }}
                      />
                      <span className="text-sm text-black">{product}</span>
                    </div>
                    <span className="text-sm font-medium text-black">
                      {amounts.units > 0 ? `${amounts.units}u` : ''}
                      {amounts.ml > 0 ? `${amounts.ml.toFixed(1)}ml` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Points List */}
          <div className="flex-1 p-4 border-b border-black">
            <h3 className="font-semibold text-black text-sm mb-3">
              Injection Points ({points.length})
            </h3>
            {points.length === 0 ? (
              <p className="text-black text-sm text-center py-4">No points added yet</p>
            ) : (
              <div className="space-y-2">
                {points.map((point) => (
                  <div
                    key={point.id}
                    onClick={() => {
                      setEditingPoint(point);
                      setShowPointEditor(true);
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      editingPoint?.id === point.id ? 'bg-pink-50 ring-1 ring-pink-200' : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getProductColor(point.product) }}
                      />
                      <span className="text-sm font-medium text-black">{point.area}</span>
                    </div>
                    <p className="text-xs text-black ml-5">
                      {point.product} • {point.units ? `${point.units}u` : ''}{point.ml ? `${point.ml}ml` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="p-4 border-b border-black">
            <h3 className="font-semibold text-black text-sm mb-2">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Treatment notes..."
              className="w-full px-3 py-2 border border-black rounded-lg text-sm resize-none"
              rows={3}
            />
          </div>

          {/* History */}
          {selectedClientId && existingMaps.length > 0 && (
            <div className="p-4">
              <h3 className="font-semibold text-black text-sm mb-3">Previous Maps</h3>
              <div className="space-y-2">
                {existingMaps.slice(0, 5).map((map) => (
                  <Link
                    key={map.id}
                    href={`/admin/charting/injection-map?map=${map.id}`}
                    className="block p-2 rounded-lg hover:bg-white text-sm"
                  >
                    <p className="font-medium text-black">
                      {new Date(map.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-black">
                      {map.points?.length || 0} points
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Point Editor Modal */}
      {showPointEditor && editingPoint && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="p-4 border-b border-black flex items-center justify-between">
              <h3 className="font-semibold text-black">Edit Injection Point</h3>
              <button
                onClick={() => {
                  setShowPointEditor(false);
                  setEditingPoint(null);
                }}
                className="p-1 hover:bg-white rounded"
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Area</label>
                <select
                  value={editingPoint.area}
                  onChange={(e) => updatePoint({ area: e.target.value })}
                  className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                >
                  {FACE_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Product</label>
                <select
                  value={editingPoint.product}
                  onChange={(e) => updatePoint({ product: e.target.value })}
                  className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                >
                  <optgroup label="Neurotoxins">
                    {PRODUCTS.neurotoxins.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                  <optgroup label="Fillers">
                    {PRODUCTS.fillers.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                  <optgroup label="Other">
                    {PRODUCTS.other.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Units</label>
                  <input
                    type="number"
                    value={editingPoint.units || ''}
                    onChange={(e) => updatePoint({ units: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Volume (ml)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPoint.ml || ''}
                    onChange={(e) => updatePoint({ ml: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Depth</label>
                <select
                  value={editingPoint.depth || ''}
                  onChange={(e) => updatePoint({ depth: e.target.value })}
                  className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                >
                  <option value="">Select...</option>
                  {DEPTHS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Technique</label>
                <select
                  value={editingPoint.technique || ''}
                  onChange={(e) => updatePoint({ technique: e.target.value })}
                  className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                >
                  <option value="">Select...</option>
                  {TECHNIQUES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Lot Number</label>
                <input
                  type="text"
                  value={editingPoint.lot || ''}
                  onChange={(e) => updatePoint({ lot: e.target.value })}
                  className="w-full px-3 py-2 border border-black rounded-lg text-sm"
                  placeholder="e.g., AB12345"
                />
              </div>
            </div>

            <div className="p-4 border-t border-black flex justify-between">
              <button
                onClick={() => deletePoint(editingPoint.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
              >
                Delete Point
              </button>
              <button
                onClick={() => {
                  setShowPointEditor(false);
                  setEditingPoint(null);
                }}
                className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg text-sm font-medium hover:bg-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InjectionMapPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#FF2D8E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black">Loading...</p>
        </div>
      </div>
    }>
      <InjectionMapContent />
    </Suspense>
  );
}
