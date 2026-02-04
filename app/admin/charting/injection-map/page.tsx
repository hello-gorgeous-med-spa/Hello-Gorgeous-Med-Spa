'use client';

// ============================================================
// INJECTION MAPPING PAGE
// Visual face diagram for documenting injection sites
// A-Z client navigation, saves to client profile
// ============================================================

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import InjectionMapper, { InjectionPoint } from '@/components/clinical/InjectionMapper';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
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

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>(clientId || '');
  const [clientSearch, setClientSearch] = useState('');
  const [existingMaps, setExistingMaps] = useState<InjectionMap[]>([]);
  const [currentMap, setCurrentMap] = useState<InjectionMap | null>(null);
  const [points, setPoints] = useState<InjectionPoint[]>([]);
  const [notes, setNotes] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch all clients on mount
  useEffect(() => {
    fetchAllClients();
  }, []);

  // Handle initial client from URL
  useEffect(() => {
    if (mapId) {
      fetchMap(mapId);
    } else if (clientId) {
      setSelectedClient(clientId);
      fetchClientHistory(clientId);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [clientId, mapId]);

  // Filter clients when letter or search changes
  useEffect(() => {
    filterClients();
  }, [selectedLetter, clientSearch, allClients]);

  const fetchAllClients = async () => {
    setSearchLoading(true);
    try {
      const res = await fetch('/api/clients?limit=500');
      const data = await res.json();
      const fetchedClients = data.clients || [];
      // Sort alphabetically by last name
      fetchedClients.sort((a: Client, b: Client) => 
        (a.last_name || '').localeCompare(b.last_name || '')
      );
      setAllClients(fetchedClients);
      setClients(fetchedClients);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = [...allClients];
    
    // Filter by letter
    if (selectedLetter) {
      filtered = filtered.filter(c => 
        (c.last_name || '').toUpperCase().startsWith(selectedLetter)
      );
    }
    
    // Filter by search
    if (clientSearch) {
      const search = clientSearch.toLowerCase();
      filtered = filtered.filter(c => 
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(search) ||
        (c.email || '').toLowerCase().includes(search)
      );
    }
    
    setClients(filtered);
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
    try {
      const res = await fetch(`/api/injection-maps?client_id=${id}`);
      const data = await res.json();
      setExistingMaps(data.maps || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? '' : letter);
    setClientSearch('');
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

      if (!res.ok) throw new Error('Failed to save');

      const data = await res.json();
      toast.success(currentMap ? 'Map updated!' : 'Map saved to client profile!');
      
      if (!currentMap && data.map?.id) {
        setCurrentMap(data.map);
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
  };

  const handleNewMap = () => {
    setCurrentMap(null);
    setPoints([]);
    setNotes('');
  };

  const selectedClientData = allClients.find(c => c.id === selectedClient);

  // Group clients by first letter of last name
  const clientsByLetter: Record<string, Client[]> = {};
  clients.forEach(c => {
    const letter = (c.last_name || 'Z')[0].toUpperCase();
    if (!clientsByLetter[letter]) clientsByLetter[letter] = [];
    clientsByLetter[letter].push(c);
  });

  // Count clients per letter for the alphabet bar
  const letterCounts: Record<string, number> = {};
  allClients.forEach(c => {
    const letter = (c.last_name || 'Z')[0].toUpperCase();
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  });

  return (
    <div className="space-y-4">
      <Breadcrumb />

      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Injection Mapping</h1>
          <p className="text-sm text-gray-500">Document injection sites for client records</p>
        </div>
        {selectedClient && points.length > 0 && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : 'Save to Profile'}
          </button>
        )}
      </div>

      {/* Main Layout - Side by side */}
      <div className="flex gap-4 h-[calc(100vh-180px)]">
        {/* Left Panel - Client Selection */}
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              value={clientSearch}
              onChange={(e) => {
                setClientSearch(e.target.value);
                setSelectedLetter('');
              }}
              placeholder="Search clients..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          {/* A-Z Bar */}
          <div className="px-2 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-wrap gap-0.5 justify-center">
              {ALPHABET.map(letter => {
                const count = letterCounts[letter] || 0;
                const isActive = selectedLetter === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    disabled={count === 0}
                    className={`w-6 h-6 text-xs font-medium rounded transition-colors ${
                      isActive 
                        ? 'bg-pink-500 text-white' 
                        : count > 0 
                          ? 'bg-white text-gray-700 hover:bg-pink-100 border border-gray-200' 
                          : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
            {selectedLetter && (
              <p className="text-xs text-center text-gray-500 mt-1">
                Showing {letterCounts[selectedLetter] || 0} clients
                <button 
                  onClick={() => setSelectedLetter('')}
                  className="ml-2 text-pink-500 hover:underline"
                >
                  Clear
                </button>
              </p>
            )}
          </div>

          {/* Client List */}
          <div className="flex-1 overflow-y-auto">
            {searchLoading ? (
              <div className="p-4 text-center text-gray-500">Loading clients...</div>
            ) : clients.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {clientSearch ? 'No clients found' : 'No clients to display'}
              </div>
            ) : selectedLetter || clientSearch ? (
              // Flat list when filtering
              <div className="p-2 space-y-0.5">
                {clients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => handleClientSelect(client.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedClient === client.id 
                        ? 'bg-pink-100 text-pink-700' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{client.last_name}</span>
                    <span className="text-gray-500">, {client.first_name}</span>
                  </button>
                ))}
              </div>
            ) : (
              // Grouped A-Z list
              <div className="py-1">
                {Object.keys(clientsByLetter).sort().map(letter => (
                  <div key={letter}>
                    <div className="px-3 py-1 bg-gray-50 text-xs font-semibold text-gray-500 sticky top-0">
                      {letter}
                    </div>
                    {clientsByLetter[letter].map(client => (
                      <button
                        key={client.id}
                        onClick={() => handleClientSelect(client.id)}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors border-b border-gray-50 ${
                          selectedClient === client.id 
                            ? 'bg-pink-100 text-pink-700' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{client.last_name}</span>
                        <span className="text-gray-500">, {client.first_name}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected client link */}
          {selectedClient && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <Link
                href={`/admin/clients/${selectedClient}`}
                className="text-sm text-pink-600 hover:text-pink-700 flex items-center gap-1"
              >
                <span>View {selectedClientData?.first_name}'s full profile</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right Panel - Map Editor */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
          {!selectedClient ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span className="text-5xl mb-4 block">💉</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Client</h3>
                <p className="text-gray-500 text-sm">Choose from A-Z list or search by name</p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Client header bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-semibold">
                    {selectedClientData?.first_name?.[0]}{selectedClientData?.last_name?.[0]}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedClientData?.first_name} {selectedClientData?.last_name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {currentMap 
                        ? `Viewing map from ${new Date(currentMap.created_at).toLocaleDateString()}` 
                        : 'New injection map'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {existingMaps.length > 0 && (
                    <select
                      value={currentMap?.id || 'new'}
                      onChange={(e) => {
                        if (e.target.value === 'new') {
                          handleNewMap();
                        } else {
                          const map = existingMaps.find(m => m.id === e.target.value);
                          if (map) handleViewMap(map);
                        }
                      }}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
                    >
                      <option value="new">+ New Map</option>
                      {existingMaps.map(map => (
                        <option key={map.id} value={map.id}>
                          {new Date(map.created_at).toLocaleDateString()} ({map.points?.length || 0} points)
                        </option>
                      ))}
                    </select>
                  )}
                  <Link
                    href={`/admin/clients/${selectedClient}?tab=clinical`}
                    className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Clinical Records
                  </Link>
                </div>
              </div>

              {/* Map Area */}
              <div className="flex-1 p-4 overflow-auto">
                <InjectionMapper
                  points={points}
                  onPointsChange={setPoints}
                  readOnly={false}
                />
              </div>

              {/* Notes Footer */}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Treatment notes (optional)..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                  rows={2}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InjectionMapPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    }>
      <InjectionMapPageContent />
    </Suspense>
  );
}
