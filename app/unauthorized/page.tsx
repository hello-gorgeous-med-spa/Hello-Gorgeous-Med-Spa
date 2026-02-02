'use client';

// ============================================================
// UNAUTHORIZED PAGE
// Shown when user lacks required role/permissions
// ============================================================

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const requiredRoles = searchParams.get('required')?.split(',') || [];
  const currentRole = searchParams.get('current') || 'unknown';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚫</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page.
          </p>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Your Role:</span>
              <span className="font-medium text-gray-900 capitalize">{currentRole}</span>
            </div>
            {requiredRoles.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Required:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {requiredRoles.join(' or ')}
                </span>
              </div>
            )}
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 mb-6">
            If you believe this is an error, please contact your administrator.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors"
            >
              Sign In with Different Account
            </Link>
            <Link
              href="/"
              className="block w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Hello Gorgeous Med Spa • Secure Access
        </p>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔐</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}
