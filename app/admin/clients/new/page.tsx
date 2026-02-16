'use client';

// ============================================================
// ADD NEW CLIENT PAGE
// Create a new client record - USES API (bypasses RLS)
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: 'IL',
    zip: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    referralSource: '',
    notes: '',
    sendWelcomeEmail: true,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Use API endpoint to create client (bypasses RLS issues)
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          address_line1: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          postal_code: formData.zip || null,
          emergency_contact_name: formData.emergencyContactName || null,
          emergency_contact_phone: formData.emergencyContactPhone || null,
          referral_source: formData.referralSource || null,
          internal_notes: formData.notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create client');
      }

      router.push('/admin/clients');
    } catch (err) {
      console.error('Error creating client:', err);
      setError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/clients"
          className="text-sm text-black hover:text-black mb-2 inline-block"
        >
          ← Back to Clients
        </Link>
        <h1 className="text-2xl font-bold text-black">Add New Client</h1>
        <p className="text-black">Create a new client record</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <h2 className="font-semibold text-black mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="(630) 555-1234"
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select...</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non_binary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <h2 className="font-semibold text-black mb-4">Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="IL">IL</option>
                  <option value="IN">IN</option>
                  <option value="WI">WI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  ZIP
                </label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => updateField('zip', e.target.value)}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <h2 className="font-semibold text-black mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Contact Name
              </label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => updateField('emergencyContactName', e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => updateField('emergencyContactPhone', e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <h2 className="font-semibold text-black mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                How did they hear about us?
              </label>
              <select
                value={formData.referralSource}
                onChange={(e) => updateField('referralSource', e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select...</option>
                <option value="google">Google Search</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="friend">Friend/Family Referral</option>
                <option value="yelp">Yelp</option>
                <option value="drive_by">Drove By</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={3}
                placeholder="Any additional notes about this client..."
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.sendWelcomeEmail}
                onChange={(e) => updateField('sendWelcomeEmail', e.target.checked)}
                className="w-4 h-4 text-pink-500 border-black rounded focus:ring-pink-500"
              />
              <span className="text-sm text-black">Send welcome email with portal login</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/clients"
            className="px-6 py-2.5 text-black font-medium hover:bg-white rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Client'}
          </button>
        </div>
      </form>
    </div>
  );
}
