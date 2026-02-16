'use client';

// ============================================================
// ADMIN INBOX PAGE
// Full-page SMS messaging interface
// ============================================================

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ClientInbox } from '@/components/clinical/ClientInbox';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  last_message_at?: string;
  unread_count?: number;
}

// Inner component that uses useSearchParams
function InboxContent() {
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get('client');
  
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch clients with recent messages
  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients?limit=50');
      const data = await res.json();
      if (data.clients) {
        // Sort by most recent interaction (placeholder - would need message data)
        setClients(data.clients);
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch specific client if URL has client param
  const fetchSelectedClient = useCallback(async (clientId: string) => {
    try {
      const res = await fetch(`/api/clients?id=${clientId}`);
      const data = await res.json();
      if (data.client) {
        setSelectedClient(data.client);
      }
    } catch (err) {
      console.error('Failed to fetch client:', err);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (clientIdParam) {
      fetchSelectedClient(clientIdParam);
    }
  }, [clientIdParam, fetchSelectedClient]);

  // Filter clients by search
  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      client.first_name?.toLowerCase().includes(query) ||
      client.last_name?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.includes(query)
    );
  });

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl border border-black overflow-hidden">
      {/* Client List Sidebar */}
      <div className="w-80 border-r border-black flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-black">
          <h1 className="text-xl font-bold text-black flex items-center gap-2">
            <span>💬</span> Messages
          </h1>
          <p className="text-sm text-black mt-1">SMS conversations with clients</p>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-black">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-4 text-center text-black text-sm">
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </div>
          ) : (
            <div className="divide-y divide-black">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full p-4 text-left hover:bg-white transition-colors ${
                    selectedClient?.id === client.id ? 'bg-pink-50 border-l-4 border-l-pink-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                      {client.first_name?.[0]}{client.last_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-black truncate">
                        {client.first_name} {client.last_name}
                      </p>
                      <p className="text-xs text-black truncate">
                        {client.phone || client.email || 'No contact info'}
                      </p>
                    </div>
                    {client.unread_count ? (
                      <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center">
                        {client.unread_count}
                      </span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedClient ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-black flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-medium">
                  {selectedClient.first_name?.[0]}{selectedClient.last_name?.[0]}
                </div>
                <div>
                  <h2 className="font-semibold text-black">
                    {selectedClient.first_name} {selectedClient.last_name}
                  </h2>
                  <p className="text-sm text-black">{selectedClient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/clients/${selectedClient.id}`}
                  className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                >
                  View Profile
                </Link>
                {selectedClient.phone && (
                  <a
                    href={`tel:${selectedClient.phone}`}
                    className="p-2 text-black hover:bg-white rounded-lg transition-colors"
                    title="Call"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1">
              <ClientInbox
                clientId={selectedClient.id}
                clientName={`${selectedClient.first_name} ${selectedClient.last_name}`}
                clientPhone={selectedClient.phone}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black">Select a conversation</h3>
              <p className="text-sm text-black mt-1">
                Choose a client from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function InboxLoading() {
  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl border border-black overflow-hidden">
      <div className="w-80 border-r border-black flex flex-col">
        <div className="p-4 border-b border-black">
          <div className="h-6 w-32 bg-white rounded animate-pulse"></div>
        </div>
        <div className="p-3">
          <div className="h-10 bg-white rounded-lg animate-pulse"></div>
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-white rounded animate-pulse mb-1"></div>
                <div className="h-3 w-32 bg-white rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    </div>
  );
}

// Default export wrapped in Suspense
export default function AdminInboxPage() {
  return (
    <Suspense fallback={<InboxLoading />}>
      <InboxContent />
    </Suspense>
  );
}
