'use client';

// ============================================================
// BREADCRUMB COMPONENT
// Navigation breadcrumbs for nested pages
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

// Auto-generate breadcrumbs from pathname
const PATH_LABELS: Record<string, string> = {
  admin: 'Dashboard',
  clients: 'Clients',
  appointments: 'Appointments',
  sales: 'Sales',
  services: 'Services',
  inventory: 'Inventory',
  'gift-cards': 'Gift Cards',
  staff: 'Staff',
  settings: 'Settings',
  calendar: 'Calendar',
  charts: 'Charts',
  consents: 'Consents',
  reports: 'Reports',
  marketing: 'Marketing',
  sms: 'SMS',
  memberships: 'Memberships',
  promotions: 'Promotions',
  packages: 'Packages',
  payments: 'Payments',
  vendors: 'Vendors',
  users: 'Users',
  compliance: 'Compliance',
  medications: 'Medications',
  owner: 'Owner',
  new: 'New',
  edit: 'Edit',
  reschedule: 'Reschedule',
  wallet: 'Wallet',
  'daily-summary': 'Daily Summary',
  'link-builder': 'Link Builder',
  photos: 'Photos',
  loyalty: 'Loyalty',
};

export function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs if not provided
  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Skip UUID segments but keep for path
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
      
      if (isUUID) {
        crumbs.push({
          label: 'Details',
          href: isLast ? undefined : currentPath,
        });
      } else {
        crumbs.push({
          label: PATH_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          href: isLast ? undefined : currentPath,
        });
      }
    });

    return crumbs;
  })();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on top-level pages
  }

  return (
    <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
      {showHome && (
        <>
          <Link 
            href="/admin" 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
          <span className="text-gray-400">/</span>
        </>
      )}
      {breadcrumbs.slice(1).map((crumb, index) => (
        <span key={index} className="flex items-center gap-2">
          {crumb.href ? (
            <Link 
              href={crumb.href}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          )}
          {index < breadcrumbs.length - 2 && (
            <span className="text-gray-400">/</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumb;
