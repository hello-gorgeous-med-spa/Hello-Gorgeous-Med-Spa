import { CharmBluefinPayInstructions } from '@/components/admin/CharmBluefinPayInstructions';
import { CHARM_SIGNIN_URL } from '@/lib/regen/charm-payments';

export default function RegenPayPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Re Gen Payments</h1>
              <p className="text-sm text-gray-500 mt-1">
                Charm + Bluefin for REGEN RX. Square stays spa booking.
              </p>
            </div>
            <a
              href={CHARM_SIGNIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
            >
              Open Charm
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CharmBluefinPayInstructions />
      </div>
    </div>
  );
}
