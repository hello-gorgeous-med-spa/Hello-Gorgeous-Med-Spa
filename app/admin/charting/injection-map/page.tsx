'use client';

// ============================================================
// INJECTION MAPPING PAGE
// Visual face diagram for documenting injection sites
// ============================================================

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import InjectionMapper, { InjectionPoint } from '@/components/clinical/InjectionMapper';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
}

interface InjectionMap {
  id: string;
  client_id: string;
  client_name: string;
  provider_name: string;
  diagram_type: string;
  notes: string;
  points: InjectionPoint[];
  created_at: string;
}

function InjectionMapPageContent() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client');
  const appointmentId = searchParams.get('appointment');
  const mapId = searchParams.get('map');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>(clientId || '');
  const [clientSearch, setClientSearch] = useState('');
  const [existingMaps, setExistingMaps] = useState<InjectionMap[]>([]);
  const [currentMap, setCurrentMap] = useState<InjectionMap | null>(null);
  const [points, setPoints] = useState<InjectionPoint[]>([]);
  const [notes, setNotes] = useState('');
  const [view, setView] = useState<'new' | 'history'>('new');

  useEffect(() => {
    fetchClients();
    if (mapId) {
      fetchMap(mapId);
    } else if (clientId) {
      fetchClientHistory(clientId);
    }
  }, [clientId, mapId]);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients?limit=100');
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const fetchMap = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/injection-maps/${id}`);
      const data = await res.json();
      
      if (data.map) {
        setCurrentMap(data.map);
        setPoints(data.map.points || []);
        setNotes(data.map.notes || '');
        setSelectedClient(data.map.client_id);
      }
    } catch (err) {
      console.error('Failed to fetch map:', err);
      toast.error('Failed to load injection map');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientHistory = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/injection-maps?client_id=${id}`);
      const data = await res.json();
      setExistingMaps(data.maps || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (id: string) => {
    setSelectedClient(id);
    setPoints([]);
    setNotes('');
    setCurrentMap(null);
    if (id) {
      fetchClientHistory(id);
      router.push(`/admin/charting/injection-map?client=${id}`);
    }
  };

  const handleSave = async () => {
    if (!selectedClient) {
      toast.error('Please select a client');
      return;
    }

    if (points.length === 0) {
      toast.error('Add at least one injection point');
      return;
    }

    setSaving(true);
    try {
      const url = currentMap 
        ? `/api/injection-maps/${currentMap.id}`
        : '/api/injection-maps';
      
      const res = await fetch(url, {
        method: currentMap ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient,
          appointment_id: appointmentId || null,
          notes,
          points: points.map(p => ({
            x_position: p.x_position,
            y_position: p.y_position,
            product_name: p.product_name,
            lot_number: p.lot_number,
            expiration_date: p.expiration_date,
            units: p.units,
            volume_ml: p.volume_ml,
            injection_depth: p.injection_depth,
            technique: p.technique,
            area_label: p.area_label,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save');
      }

      toast.success(currentMap ? 'Injection map updated!' : 'Injection map saved!');
      
      if (!currentMap) {
        // Reset for new entry
        setPoints([]);
        setNotes('');
        fetchClientHistory(selectedClient);
      }
    } catch (err) {
      toast.error('Failed to save injection map');
    } finally {
      setSaving(false);
    }
  };

  const handleViewMap = (map: InjectionMap) => {
    setCurrentMap(map);
    setPoints(map.points || []);
    setNotes(map.notes || '');
    setView('new');
  };

  const handleNewMap = () => {
    setCurrentMap(null);
    setPoints([]);
    setNotes('');
    setView('new');
  };

  const filteredClients = clients.filter(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const selectedClientName = clients.find(c => c.id === selectedClient);

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Injection Mapping</h1>
          <p className="text-gray-500">Document injection sites, products, and techniques</p>
        </div>
        {selectedClient && points.length > 0 && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : currentMap ? 'Update Map' : 'Save Map'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar - Client selection */}
        <div className="lg:col-span-1 space-y-4">
          {/* Client Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Select Client</h3>
            <input
              type="text"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3"
            />
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredClients.slice(0, 20).map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleClientSelect(client.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedClient === client.id 
                      ? 'bg-pink-100 text-pink-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {client.first_name} {client.last_name}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {selectedClient && existingMaps.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">History</h3>
                <button
                  onClick={handleNewMap}
                  className="text-xs text-pink-600 hover:text-pink-700"
                >
                  + New Map
                </button>
              </div>
              <div className="space-y-2">
                {existingMaps.map((map) => (
                  <button
                    key={map.id}
                    onClick={() => handleViewMap(map)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentMap?.id === map.id 
                        ? 'bg-pink-100 text-pink-700' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <p className="font-medium">
                      {new Date(map.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {map.points.length} points • {map.provider_name || 'Unknown provider'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content - Injection map */}
        <div className="lg:col-span-3">
          {!selectedClient ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <span className="text-5xl mb-4 block">💉</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Client</h3>
              <p className="text-gray-500">Choose a client from the list to start documenting injections</p>
            </div>
          ) : loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Client header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedClientName?.first_name} {selectedClientName?.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {currentMap 
                      ? `Recorded ${new Date(currentMap.created_at).toLocaleDateString()}` 
                      : 'New injection map'
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  {currentMap && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                      Viewing saved map
                    </span>
                  )}
                </div>
              </div>

              {/* Injection Mapper */}
              <InjectionMapper
                points={points}
                onPointsChange={setPoints}
                readOnly={false}
              />

              {/* Notes */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes about this treatment..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InjectionMapPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    }>
      <InjectionMapPageContent />
    </Suspense>
  );
}
