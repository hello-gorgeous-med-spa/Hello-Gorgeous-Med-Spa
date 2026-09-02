import { RegenPayHub } from "@/components/admin/RegenPayHub";

export const metadata = {
  title: "RE GEN Payments | Staff Dashboard",
};

export default function RegenPayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RE GEN Payments</h1>
              <p className="text-sm text-gray-500">Send checkouts, invoices, and payment links</p>
            </div>
            <a 
              href="https://dashboard.stripe.com/payments" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              Open Stripe →
            </a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <RegenPayHub />
      </main>
    </div>
  );
}
