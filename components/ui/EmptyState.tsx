'use client';

// ============================================================
// EMPTY STATE COMPONENT
// Helpful empty states with actions
// ============================================================

import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm max-w-sm mb-4">{description}</p>
      )}
      <div className="flex items-center gap-3">
        {(actionLabel && (actionHref || onAction)) && (
          actionHref ? (
            <Link
              href={actionHref}
              className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
            >
              {actionLabel}
            </button>
          )
        )}
        {(secondaryActionLabel && (secondaryActionHref || onSecondaryAction)) && (
          secondaryActionHref ? (
            <Link
              href={secondaryActionHref}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              {secondaryActionLabel}
            </Link>
          ) : (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              {secondaryActionLabel}
            </button>
          )
        )}
      </div>
    </div>
  );
}

// Pre-built empty states for common scenarios
export function NoClientsEmptyState() {
  return (
    <EmptyState
      icon="👥"
      title="No clients yet"
      description="Add your first client to get started with bookings and treatments."
      actionLabel="+ Add Client"
      actionHref="/admin/clients/new"
    />
  );
}

export function NoAppointmentsEmptyState({ date }: { date?: string }) {
  return (
    <EmptyState
      icon="📅"
      title="No appointments"
      description={date ? `No appointments scheduled for ${date}` : "No appointments match your filters"}
      actionLabel="+ Book Appointment"
      actionHref="/admin/appointments/new"
    />
  );
}

export function NoSalesEmptyState() {
  return (
    <EmptyState
      icon="💰"
      title="No sales found"
      description="Sales will appear here once transactions are completed."
      actionLabel="Go to POS"
      actionHref="/pos"
    />
  );
}

export function NoResultsEmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="No results found"
      description="Try adjusting your search or filters to find what you're looking for."
      actionLabel="Clear Filters"
      onAction={onClear}
    />
  );
}

export function NoDataEmptyState({ type = 'data' }: { type?: string }) {
  return (
    <EmptyState
      icon="📭"
      title={`No ${type} yet`}
      description={`${type.charAt(0).toUpperCase() + type.slice(1)} will appear here once added.`}
    />
  );
}

export default EmptyState;
