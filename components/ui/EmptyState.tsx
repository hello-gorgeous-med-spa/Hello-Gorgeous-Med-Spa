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
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-black mb-1">{title}</h3>
      {description && (
        <p className="text-black text-sm max-w-sm mb-4">{description}</p>
      )}
      <div className="flex items-center gap-3">
        {(actionLabel && (actionHref || onAction)) && (
          actionHref ? (
            <Link
              href={actionHref}
              className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors"
            >
              {actionLabel}
            </button>
          )
        )}
        {(secondaryActionLabel && (secondaryActionHref || onSecondaryAction)) && (
          secondaryActionHref ? (
            <Link
              href={secondaryActionHref}
              className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white transition-colors"
            >
              {secondaryActionLabel}
            </Link>
          ) : (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white transition-colors"
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
