// ============================================================
// APPOINTMENT STATUSES
// Custom appointment status configuration
// ============================================================

export type AppointmentStatusKey = 
  | 'pending' 
  | 'confirmed' 
  | 'checked_in' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export interface AppointmentStatusConfig {
  key: AppointmentStatusKey;
  label: string;
  displayName: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  // Which statuses can transition TO this status
  allowedFromStatuses: AppointmentStatusKey[];
  // Available actions when in this status
  actions: AppointmentStatusAction[];
  // Is this a terminal/final status?
  isFinal: boolean;
  // Order for display
  order: number;
}

export interface AppointmentStatusAction {
  key: string;
  label: string;
  icon: string;
  nextStatus?: AppointmentStatusKey;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

// Status configurations matching Fresha
export const APPOINTMENT_STATUSES: Record<AppointmentStatusKey, AppointmentStatusConfig> = {
  pending: {
    key: 'pending',
    label: 'Booked',
    displayName: 'Booked',
    color: '#3B82F6', // Blue
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: '📅',
    allowedFromStatuses: [],
    actions: [
      { key: 'confirm', label: 'Confirm', icon: '✓', nextStatus: 'confirmed' },
      { key: 'cancel', label: 'Cancel', icon: '✕', nextStatus: 'cancelled', requiresConfirmation: true, confirmationMessage: 'Are you sure you want to cancel this appointment?' },
    ],
    isFinal: false,
    order: 1,
  },
  confirmed: {
    key: 'confirmed',
    label: 'Confirmed',
    displayName: 'Confirmed',
    color: '#10B981', // Green
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: '✓',
    allowedFromStatuses: ['pending'],
    actions: [
      { key: 'check_in', label: 'Client Arrived', icon: '👋', nextStatus: 'checked_in' },
      { key: 'cancel', label: 'Cancel', icon: '✕', nextStatus: 'cancelled', requiresConfirmation: true, confirmationMessage: 'Are you sure you want to cancel this appointment?' },
      { key: 'no_show', label: 'No-Show', icon: '⚠️', nextStatus: 'no_show', requiresConfirmation: true, confirmationMessage: 'Mark this client as a no-show?' },
    ],
    isFinal: false,
    order: 2,
  },
  checked_in: {
    key: 'checked_in',
    label: 'Arrived',
    displayName: 'Arrived',
    color: '#8B5CF6', // Purple
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    icon: '👋',
    allowedFromStatuses: ['pending', 'confirmed'],
    actions: [
      { key: 'start', label: 'Start Treatment', icon: '▶️', nextStatus: 'in_progress' },
      { key: 'cancel', label: 'Cancel', icon: '✕', nextStatus: 'cancelled', requiresConfirmation: true, confirmationMessage: 'Are you sure you want to cancel this appointment?' },
    ],
    isFinal: false,
    order: 3,
  },
  in_progress: {
    key: 'in_progress',
    label: 'Started',
    displayName: 'Started',
    color: '#F59E0B', // Amber
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    icon: '▶️',
    allowedFromStatuses: ['checked_in'],
    actions: [
      { key: 'complete', label: 'Complete', icon: '✓', nextStatus: 'completed' },
    ],
    isFinal: false,
    order: 4,
  },
  completed: {
    key: 'completed',
    label: 'Completed',
    displayName: 'Completed',
    color: '#059669', // Emerald
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    icon: '✅',
    allowedFromStatuses: ['in_progress', 'checked_in'],
    actions: [
      { key: 'checkout', label: 'Go to Checkout', icon: '💳' },
      { key: 'rebook', label: 'Book Follow-up', icon: '📅' },
    ],
    isFinal: true,
    order: 5,
  },
  cancelled: {
    key: 'cancelled',
    label: 'Canceled',
    displayName: 'Canceled',
    color: '#EF4444', // Red
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    icon: '✕',
    allowedFromStatuses: ['pending', 'confirmed', 'checked_in'],
    actions: [
      { key: 'rebook', label: 'Rebook', icon: '📅' },
    ],
    isFinal: true,
    order: 6,
  },
  no_show: {
    key: 'no_show',
    label: 'No-Show',
    displayName: 'No-Show',
    color: '#6B7280', // Gray
    bgColor: 'bg-white',
    textColor: 'text-black',
    icon: '⚠️',
    allowedFromStatuses: ['confirmed', 'pending'],
    actions: [
      { key: 'rebook', label: 'Rebook', icon: '📅' },
      { key: 'charge_fee', label: 'Apply No-Show Fee', icon: '💰' },
    ],
    isFinal: true,
    order: 7,
  },
};

// Get status configuration
export function getStatusConfig(status: AppointmentStatusKey): AppointmentStatusConfig {
  return APPOINTMENT_STATUSES[status] || APPOINTMENT_STATUSES.pending;
}

// Get all statuses in order
export function getAllStatuses(): AppointmentStatusConfig[] {
  return Object.values(APPOINTMENT_STATUSES).sort((a, b) => a.order - b.order);
}

// Get non-final statuses (for filtering active appointments)
export function getActiveStatuses(): AppointmentStatusKey[] {
  return Object.values(APPOINTMENT_STATUSES)
    .filter(s => !s.isFinal)
    .map(s => s.key);
}

// Check if transition is valid
export function canTransitionTo(
  currentStatus: AppointmentStatusKey,
  newStatus: AppointmentStatusKey
): boolean {
  const newConfig = APPOINTMENT_STATUSES[newStatus];
  if (!newConfig) return false;
  
  // Can always stay in the same status
  if (currentStatus === newStatus) return true;
  
  // Check if current status is in the allowed list
  return newConfig.allowedFromStatuses.includes(currentStatus);
}

// Get available actions for a status
export function getAvailableActions(status: AppointmentStatusKey): AppointmentStatusAction[] {
  const config = APPOINTMENT_STATUSES[status];
  return config?.actions || [];
}

// Status badge component helper
export function getStatusBadgeClasses(status: AppointmentStatusKey): string {
  const config = APPOINTMENT_STATUSES[status];
  return `${config.bgColor} ${config.textColor}`;
}

// Format status for display
export function formatStatus(status: AppointmentStatusKey): string {
  const config = APPOINTMENT_STATUSES[status];
  return config?.displayName || status;
}

// Status workflow for timeline display
export const STATUS_WORKFLOW: AppointmentStatusKey[] = [
  'pending',
  'confirmed', 
  'checked_in',
  'in_progress',
  'completed',
];
