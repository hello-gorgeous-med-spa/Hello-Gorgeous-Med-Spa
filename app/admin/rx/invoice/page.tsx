import { Metadata } from 'next';
import RegenInvoiceTool from '@/components/admin/RegenInvoiceTool';

export const metadata: Metadata = {
  title: 'Re Gen Invoice | Admin',
  description: 'Send Stripe invoices to Re Gen patients',
};

export default function RegenInvoicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Re Gen Invoice</h1>
              <p className="text-sm text-gray-500 mt-1">
                Send payment requests via Stripe (bypasses Square)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Stripe Connected
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RegenInvoiceTool />
      </div>
    </div>
  );
}
