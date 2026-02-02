'use client';

// ============================================================
// SERVICES & WORKFLOWS - MOST USED SCREEN
// Complete service management with config panels
// ============================================================

import { useState, useEffect } from 'react';
import OwnerLayout from '../layout-wrapper';

interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  status: 'active' | 'inactive' | 'draft';
  taxable: boolean;
  bufferBefore: number;
  bufferAfter: number;
  requiredConsents: string[];
  requiredChartSections: string[];
  requireBeforePhoto: boolean;
  requireAfterPhoto: boolean;
  requireInventory: boolean;
  eligibleProviders: string[];
  unitLimits: { providerId: string; limit: number }[];
  followUpDays: number;
  postCareMessage: string;
  reviewRequestDays: number;
  publishStatus: 'draft' | 'live';
  applyToFutureOnly: boolean;
}

const CATEGORIES = ['Injectables', 'Fillers', 'Facials', 'Laser', 'Body', 'Wellness', 'Skincare'];
const CONSENTS = ['HIPAA', 'Financial Policy', 'Neurotoxin Consent', 'Filler Consent', 'Laser Consent', 'Photo Release'];
const CHART_SECTIONS = ['Subjective', 'Objective', 'Assessment', 'Plan', 'Injection Map', 'Before Photo', 'After Photo', 'Products Used'];
const PROVIDERS = [
  { id: 'p1', name: 'Ryan Kent' },
  { id: 'p2', name: 'Danielle Alcala' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Botox (per unit)', category: 'Injectables', duration: 30, price: 14, status: 'active', taxable: false, bufferBefore: 0, bufferAfter: 15, requiredConsents: ['HIPAA', 'Neurotoxin Consent'], requiredChartSections: ['Subjective', 'Objective', 'Assessment', 'Plan', 'Injection Map'], requireBeforePhoto: true, requireAfterPhoto: false, requireInventory: true, eligibleProviders: ['p1', 'p2'], unitLimits: [{ providerId: 'p1', limit: 50 }], followUpDays: 14, postCareMessage: 'Avoid rubbing the treated area for 4 hours.', reviewRequestDays: 3, publishStatus: 'live', applyToFutureOnly: true },
    { id: '2', name: 'Juvederm Filler', category: 'Fillers', duration: 45, price: 650, status: 'active', taxable: false, bufferBefore: 0, bufferAfter: 15, requiredConsents: ['HIPAA', 'Filler Consent'], requiredChartSections: ['Subjective', 'Objective', 'Assessment', 'Plan', 'Before Photo'], requireBeforePhoto: true, requireAfterPhoto: true, requireInventory: true, eligibleProviders: ['p1', 'p2'], unitLimits: [], followUpDays: 14, postCareMessage: 'Apply ice as needed. Avoid strenuous exercise for 24 hours.', reviewRequestDays: 7, publishStatus: 'live', applyToFutureOnly: true },
    { id: '3', name: 'HydraFacial', category: 'Facials', duration: 60, price: 199, status: 'active', taxable: false, bufferBefore: 10, bufferAfter: 10, requiredConsents: ['HIPAA'], requiredChartSections: ['Subjective', 'Assessment'], requireBeforePhoto: false, requireAfterPhoto: false, requireInventory: false, eligibleProviders: ['p2'], unitLimits: [], followUpDays: 30, postCareMessage: 'Your skin may be slightly pink for a few hours.', reviewRequestDays: 1, publishStatus: 'live', applyToFutureOnly: true },
    { id: '4', name: 'Laser Hair Removal', category: 'Laser', duration: 30, price: 150, status: 'active', taxable: false, bufferBefore: 5, bufferAfter: 10, requiredConsents: ['HIPAA', 'Laser Consent'], requiredChartSections: ['Subjective', 'Objective', 'Before Photo'], requireBeforePhoto: true, requireAfterPhoto: false, requireInventory: false, eligibleProviders: ['p1', 'p2'], unitLimits: [], followUpDays: 42, postCareMessage: 'Avoid sun exposure for 2 weeks.', reviewRequestDays: 3, publishStatus: 'live', applyToFutureOnly: true },
    { id: '5', name: 'Weight Loss Consultation', category: 'Wellness', duration: 45, price: 0, status: 'draft', taxable: false, bufferBefore: 0, bufferAfter: 0, requiredConsents: ['HIPAA'], requiredChartSections: ['Subjective', 'Assessment', 'Plan'], requireBeforePhoto: false, requireAfterPhoto: false, requireInventory: false, eligibleProviders: ['p1'], unitLimits: [], followUpDays: 7, postCareMessage: '', reviewRequestDays: 0, publishStatus: 'draft', applyToFutureOnly: true },
  ]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const createNewService = () => {
    const newService: Service = {
      id: `new-${Date.now()}`,
      name: 'New Service',
      category: 'Injectables',
      duration: 30,
      price: 0,
      status: 'draft',
      taxable: false,
      bufferBefore: 0,
      bufferAfter: 15,
      requiredConsents: ['HIPAA'],
      requiredChartSections: [],
      requireBeforePhoto: false,
      requireAfterPhoto: false,
      requireInventory: false,
      eligibleProviders: PROVIDERS.map(p => p.id),
      unitLimits: [],
      followUpDays: 0,
      postCareMessage: '',
      reviewRequestDays: 0,
      publishStatus: 'draft',
      applyToFutureOnly: true,
    };
    setServices(prev => [newService, ...prev]);
    setSelectedService(newService);
    setActiveTab('general');
  };

  const updateService = (updates: Partial<Service>) => {
    if (!selectedService) return;
    const updated = { ...selectedService, ...updates };
    setSelectedService(updated);
    setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const saveService = () => {
    setMessage({ type: 'success', text: `Service "${selectedService?.name}" saved successfully!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'timing', label: 'Timing' },
    { id: 'clinical', label: 'Clinical Requirements' },
    { id: 'providers', label: 'Provider Rules' },
    { id: 'automation', label: 'Automation' },
    { id: 'publishing', label: 'Publishing' },
  ];

  return (
    <OwnerLayout title="Services & Workflows" description="Most used screen - Complete service configuration">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-6">
        {/* Service List */}
        <div className="w-1/3">
          <div className="bg-white rounded-xl border">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Service List</h2>
                <button onClick={createNewService} className="px-3 py-1.5 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600">
                  + New Service
                </button>
              </div>
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Service Table */}
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">SERVICE</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">CAT</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">DUR</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">PRICE</th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredServices.map(service => (
                    <tr
                      key={service.id}
                      onClick={() => { setSelectedService(service); setActiveTab('general'); }}
                      className={`cursor-pointer hover:bg-gray-50 ${selectedService?.id === service.id ? 'bg-purple-50' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm font-medium">{service.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{service.category.substring(0, 3)}</td>
                      <td className="px-4 py-3 text-sm text-right">{service.duration}m</td>
                      <td className="px-4 py-3 text-sm text-right">${service.price}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          service.status === 'active' ? 'bg-green-100 text-green-700' :
                          service.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Service Config Panel */}
        <div className="w-2/3">
          {selectedService ? (
            <div className="bg-white rounded-xl border">
              {/* Panel Header */}
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-lg">{selectedService.name}</h2>
                <p className="text-sm text-gray-500">Service Configuration Panel</p>
              </div>

              {/* Tabs */}
              <div className="border-b flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={selectedService.name}
                        onChange={(e) => updateService({ name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={selectedService.category}
                          onChange={(e) => updateService({ category: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={selectedService.status}
                          onChange={(e) => updateService({ status: e.target.value as any })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={selectedService.price}
                          onChange={(e) => updateService({ price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Taxable</label>
                        <select
                          value={selectedService.taxable ? 'yes' : 'no'}
                          onChange={(e) => updateService({ taxable: e.target.value === 'yes' })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* TIMING TAB */}
                {activeTab === 'timing' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        value={selectedService.duration}
                        onChange={(e) => updateService({ duration: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border rounded-lg"
                        min="0"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Before (min)</label>
                        <input
                          type="number"
                          value={selectedService.bufferBefore}
                          onChange={(e) => updateService({ bufferBefore: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buffer After (min)</label>
                        <input
                          type="number"
                          value={selectedService.bufferAfter}
                          onChange={(e) => updateService({ bufferAfter: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Total block time:</strong> {selectedService.bufferBefore + selectedService.duration + selectedService.bufferAfter} minutes
                      </p>
                    </div>
                  </div>
                )}

                {/* CLINICAL REQUIREMENTS TAB */}
                {activeTab === 'clinical' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Required Consent(s)</label>
                      <div className="space-y-2">
                        {CONSENTS.map(consent => (
                          <label key={consent} className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={selectedService.requiredConsents.includes(consent)}
                              onChange={(e) => {
                                const newConsents = e.target.checked
                                  ? [...selectedService.requiredConsents, consent]
                                  : selectedService.requiredConsents.filter(c => c !== consent);
                                updateService({ requiredConsents: newConsents });
                              }}
                              className="w-4 h-4 text-pink-600"
                            />
                            <span className="text-sm">{consent}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Required Chart Sections</label>
                      <div className="grid grid-cols-2 gap-2">
                        {CHART_SECTIONS.map(section => (
                          <label key={section} className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={selectedService.requiredChartSections.includes(section)}
                              onChange={(e) => {
                                const newSections = e.target.checked
                                  ? [...selectedService.requiredChartSections, section]
                                  : selectedService.requiredChartSections.filter(s => s !== section);
                                updateService({ requiredChartSections: newSections });
                              }}
                              className="w-4 h-4 text-pink-600"
                            />
                            <span className="text-sm">{section}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Required Photos</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" checked={selectedService.requireBeforePhoto} onChange={(e) => updateService({ requireBeforePhoto: e.target.checked })} className="w-5 h-5 text-pink-600" />
                          <span>Before Photo (Pre-treatment)</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" checked={selectedService.requireAfterPhoto} onChange={(e) => updateService({ requireAfterPhoto: e.target.checked })} className="w-5 h-5 text-pink-600" />
                          <span>After Photo (Post-treatment)</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" checked={selectedService.requireInventory} onChange={(e) => updateService({ requireInventory: e.target.checked })} className="w-5 h-5 text-pink-600" />
                        <div>
                          <span className="font-medium">Require Inventory / Lot Tracking</span>
                          <p className="text-xs text-gray-500">Must select product lot when charting</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* PROVIDER RULES TAB */}
                {activeTab === 'providers' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Eligible Providers</label>
                      <div className="space-y-2">
                        {PROVIDERS.map(provider => (
                          <label key={provider.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={selectedService.eligibleProviders.includes(provider.id)}
                              onChange={(e) => {
                                const newProviders = e.target.checked
                                  ? [...selectedService.eligibleProviders, provider.id]
                                  : selectedService.eligibleProviders.filter(p => p !== provider.id);
                                updateService({ eligibleProviders: newProviders });
                              }}
                              className="w-5 h-5 text-pink-600"
                            />
                            <span>{provider.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit Limits per Provider</label>
                      <p className="text-xs text-gray-500 mb-2">Set maximum units this provider can administer per day (for injectable services)</p>
                      {PROVIDERS.map(provider => (
                        <div key={provider.id} className="flex items-center gap-3 mb-2">
                          <span className="w-32 text-sm">{provider.name}</span>
                          <input
                            type="number"
                            placeholder="No limit"
                            value={selectedService.unitLimits.find(u => u.providerId === provider.id)?.limit || ''}
                            onChange={(e) => {
                              const limit = parseInt(e.target.value) || 0;
                              const existing = selectedService.unitLimits.filter(u => u.providerId !== provider.id);
                              if (limit > 0) {
                                updateService({ unitLimits: [...existing, { providerId: provider.id, limit }] });
                              } else {
                                updateService({ unitLimits: existing });
                              }
                            }}
                            className="w-24 px-3 py-2 border rounded-lg text-sm"
                            min="0"
                          />
                          <span className="text-xs text-gray-500">units/day</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AUTOMATION TAB */}
                {activeTab === 'automation' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Timing (days after treatment)</label>
                      <input
                        type="number"
                        value={selectedService.followUpDays}
                        onChange={(e) => updateService({ followUpDays: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border rounded-lg"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">0 = no automatic follow-up</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Post-Care Message (SMS)</label>
                      <textarea
                        value={selectedService.postCareMessage}
                        onChange={(e) => updateService({ postCareMessage: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows={3}
                        placeholder="Instructions sent to client after treatment..."
                      />
                      <p className="text-xs text-gray-500 mt-1">{selectedService.postCareMessage.length}/160 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Review Request Trigger (days after)</label>
                      <input
                        type="number"
                        value={selectedService.reviewRequestDays}
                        onChange={(e) => updateService({ reviewRequestDays: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border rounded-lg"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">0 = no review request</p>
                    </div>
                  </div>
                )}

                {/* PUBLISHING TAB */}
                {activeTab === 'publishing' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Publish Status</label>
                      <select
                        value={selectedService.publishStatus}
                        onChange={(e) => updateService({ publishStatus: e.target.value as any })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="draft">Draft - Not visible to clients</option>
                        <option value="live">Live - Available for booking</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedService.applyToFutureOnly}
                        onChange={(e) => updateService({ applyToFutureOnly: e.target.checked })}
                        className="w-5 h-5 text-pink-600"
                      />
                      <div>
                        <span className="font-medium">Apply to future bookings only</span>
                        <p className="text-xs text-gray-500">Existing appointments will not be affected by changes</p>
                      </div>
                    </label>
                    <div className={`p-4 rounded-lg ${selectedService.publishStatus === 'live' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <p className={`text-sm ${selectedService.publishStatus === 'live' ? 'text-green-700' : 'text-gray-600'}`}>
                        {selectedService.publishStatus === 'live'
                          ? '✓ This service is currently visible to clients and available for online booking.'
                          : '⚠ This service is in draft mode and not visible to clients.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveService}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium"
                >
                  Save Service
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <span className="text-4xl mb-4 block">💉</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Service</h3>
              <p className="text-gray-500 mb-4">Click a service from the list to configure it, or create a new one.</p>
              <button onClick={createNewService} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                + Create New Service
              </button>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
