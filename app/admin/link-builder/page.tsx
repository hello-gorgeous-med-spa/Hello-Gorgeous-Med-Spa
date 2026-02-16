'use client';

// ============================================================
// LINK BUILDER - Create shareable booking links & QR codes
// Similar to Fresha's Link Builder functionality
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  category?: string;
  price_cents?: number;
  duration_minutes?: number;
}

interface Provider {
  id: string;
  name: string;
}

interface GeneratedLink {
  type: string;
  url: string;
  label: string;
  filters: string[];
}

const LINK_TYPES = [
  {
    id: 'everything',
    title: 'Link to everything',
    description: 'One simple link covering everything your clients can book or buy online.',
    icon: '🛍️',
  },
  {
    id: 'services',
    title: 'Link to services',
    description: 'Booking links for certain services, categories or team members.',
    icon: '📋',
  },
  {
    id: 'memberships',
    title: 'Link to memberships',
    description: 'Link to a specific membership or your full list of memberships.',
    icon: '💎',
  },
  {
    id: 'gift-cards',
    title: 'Link to gift cards',
    description: 'Link to purchase gift cards online.',
    icon: '🎁',
  },
];

export default function LinkBuilderPage() {
  const [step, setStep] = useState<'select' | 'customize' | 'generated'>('select');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [generatedLink, setGeneratedLink] = useState<GeneratedLink | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://hellogorgeousmedspa.com';

  // Fetch services and providers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, providersRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/providers'),
        ]);
        
        const servicesData = await servicesRes.json();
        const providersData = await providersRes.json();
        
        setServices(servicesData.services || []);
        setProviders((providersData.providers || []).map((p: any) => ({
          id: p.id,
          name: `${p.user_profiles?.first_name || p.first_name || ''} ${p.user_profiles?.last_name || p.last_name || ''}`.trim() || 'Provider',
        })));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Get unique categories
  const categories = [...new Set(services.map(s => s.category).filter(Boolean))];

  // Filter services by search and category
  const filteredServices = services.filter(s => {
    const matchesSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    
    if (typeId === 'everything') {
      // Generate link immediately for "everything"
      generateLink(typeId, [], []);
    } else {
      setStep('customize');
    }
  };

  const generateLink = (type: string, serviceIds: string[], providerIds: string[]) => {
    let url = baseUrl;
    let label = '';
    const filters: string[] = [];

    switch (type) {
      case 'everything':
        url = `${baseUrl}/book`;
        label = 'Book Now - All Services';
        break;
      case 'services':
        if (serviceIds.length === 1) {
          url = `${baseUrl}/book?service=${serviceIds[0]}`;
          const service = services.find(s => s.id === serviceIds[0]);
          label = `Book - ${service?.name || 'Service'}`;
          filters.push(`Service: ${service?.name}`);
        } else if (serviceIds.length > 1) {
          url = `${baseUrl}/book?services=${serviceIds.join(',')}`;
          label = `Book - ${serviceIds.length} Services`;
          filters.push(`${serviceIds.length} services selected`);
        } else if (selectedCategory !== 'all') {
          url = `${baseUrl}/book?category=${encodeURIComponent(selectedCategory)}`;
          label = `Book - ${selectedCategory}`;
          filters.push(`Category: ${selectedCategory}`);
        } else {
          url = `${baseUrl}/book`;
          label = 'Book Now - All Services';
        }
        
        if (providerIds.length === 1) {
          url += `${url.includes('?') ? '&' : '?'}provider=${providerIds[0]}`;
          const provider = providers.find(p => p.id === providerIds[0]);
          filters.push(`Provider: ${provider?.name}`);
        } else if (providerIds.length > 1) {
          url += `${url.includes('?') ? '&' : '?'}providers=${providerIds.join(',')}`;
          filters.push(`${providerIds.length} providers`);
        }
        break;
      case 'memberships':
        url = `${baseUrl}/subscribe`;
        label = 'Join Membership';
        break;
      case 'gift-cards':
        url = `${baseUrl}/gift-cards`;
        label = 'Purchase Gift Card';
        break;
    }

    setGeneratedLink({ type, url, label, filters });
    setStep('generated');
  };

  const handleGenerateLink = () => {
    if (!selectedType) return;
    generateLink(selectedType, selectedServices, selectedProviders);
  };

  const copyToClipboard = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleProvider = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const selectAllServices = () => {
    if (selectedServices.length === filteredServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredServices.map(s => s.id));
    }
  };

  const reset = () => {
    setStep('select');
    setSelectedType(null);
    setSelectedServices([]);
    setSelectedProviders([]);
    setSelectedCategory('all');
    setGeneratedLink(null);
    setSearchTerm('');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-black mb-2">
          <Link href="/admin" className="hover:text-pink-600">Admin</Link>
          <span>/</span>
          <span>Link Builder</span>
        </div>
        <h1 className="text-2xl font-bold text-black">Link Builder</h1>
        <p className="text-black mt-1">Create shareable links and QR codes for booking</p>
      </div>

      {/* Step 1: Select Link Type */}
      {step === 'select' && (
        <div className="grid md:grid-cols-2 gap-4">
          {LINK_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelectType(type.id)}
              className="bg-white rounded-xl border-2 border-black p-6 text-left hover:border-pink-300 hover:shadow-lg transition-all group"
            >
              <div className="text-3xl mb-3">{type.icon}</div>
              <h3 className="font-semibold text-black group-hover:text-pink-600 transition-colors">
                {type.title}
              </h3>
              <p className="text-sm text-black mt-1">{type.description}</p>
              <div className="mt-4 text-pink-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Create link →
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Customize */}
      {step === 'customize' && selectedType === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">Customize your link</h2>
            <button onClick={reset} className="text-black hover:text-black text-sm">
              ← Back
            </button>
          </div>

          {/* Provider Selection */}
          <div className="bg-white rounded-xl border border-black p-5">
            <h3 className="font-medium text-black mb-3">Team Members</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedProviders([])}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedProviders.length === 0
                    ? 'bg-[#FF2D8E] text-white'
                    : 'bg-white text-black hover:bg-white'
                }`}
              >
                All team members ({providers.length})
              </button>
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => toggleProvider(provider.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedProviders.includes(provider.id)
                      ? 'bg-[#FF2D8E] text-white'
                      : 'bg-white text-black hover:bg-white'
                  }`}
                >
                  {provider.name}
                </button>
              ))}
            </div>
          </div>

          {/* Service Selection */}
          <div className="bg-white rounded-xl border border-black p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-black">Services</h3>
              <div className="flex items-center gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-black rounded-lg text-sm"
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-black rounded-lg text-sm w-48"
                />
              </div>
            </div>

            <div className="border-b border-black pb-3 mb-3">
              <button
                onClick={selectAllServices}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedServices.length === filteredServices.length && filteredServices.length > 0
                    ? 'bg-pink-50 text-pink-700'
                    : 'hover:bg-white'
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedServices.length === filteredServices.length && filteredServices.length > 0
                    ? 'border-[#FF2D8E] bg-[#FF2D8E]'
                    : 'border-black'
                }`}>
                  {selectedServices.length === filteredServices.length && filteredServices.length > 0 && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </span>
                Select all ({filteredServices.length})
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                    selectedServices.includes(service.id)
                      ? 'bg-pink-50 text-pink-700'
                      : 'hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedServices.includes(service.id)
                        ? 'border-[#FF2D8E] bg-[#FF2D8E]'
                        : 'border-black'
                    }`}>
                      {selectedServices.includes(service.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </span>
                    <span>{service.name}</span>
                  </div>
                  {service.price_cents && (
                    <span className="text-black">
                      ${(service.price_cents / 100).toFixed(0)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerateLink}
              className="px-6 py-3 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-black transition-colors"
            >
              Generate Link
            </button>
          </div>
        </div>
      )}

      {/* Step 2 for other types */}
      {step === 'customize' && selectedType && selectedType !== 'services' && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">
            {LINK_TYPES.find(t => t.id === selectedType)?.icon}
          </div>
          <h2 className="text-lg font-semibold text-black mb-2">
            {LINK_TYPES.find(t => t.id === selectedType)?.title}
          </h2>
          <p className="text-black mb-6">
            {LINK_TYPES.find(t => t.id === selectedType)?.description}
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={reset} className="px-4 py-2 text-black hover:text-black">
              ← Back
            </button>
            <button
              onClick={() => generateLink(selectedType, [], [])}
              className="px-6 py-3 bg-[#FF2D8E] text-white font-semibold rounded-xl hover:bg-black transition-colors"
            >
              Generate Link
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generated Link */}
      {step === 'generated' && generatedLink && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-black">Your link is ready!</h2>
            <p className="text-black mt-1">{generatedLink.label}</p>
          </div>

          {/* Link Display */}
          <div className="bg-white rounded-xl border border-black p-5 mb-6">
            <label className="text-sm font-medium text-black mb-2 block">Shareable Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedLink.url}
                className="flex-1 px-4 py-3 bg-white border border-black rounded-lg text-black text-sm"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-[#FF2D8E] text-white hover:bg-black'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            
            {generatedLink.filters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {generatedLink.filters.map((filter, i) => (
                  <span key={i} className="px-2 py-1 bg-white text-black text-xs rounded">
                    {filter}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* QR Code Placeholder */}
          <div className="bg-white rounded-xl border border-black p-5 mb-6 text-center">
            <label className="text-sm font-medium text-black mb-3 block">QR Code</label>
            <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-xs text-black">QR Code</p>
                <p className="text-xs text-black">Scan to book</p>
              </div>
            </div>
            <p className="text-sm text-black mt-3">
              Right-click to save the QR code image
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <button
              onClick={reset}
              className="px-6 py-3 border border-black text-black font-medium rounded-xl hover:bg-white transition-colors"
            >
              Create Another Link
            </button>
            <a
              href={generatedLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-black transition-colors"
            >
              Preview Link ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
