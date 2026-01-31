// ============================================================
// BLOCKED TIME TYPES
// Non-appointment time blocks for the calendar
// ============================================================

export interface BlockedTimeType {
  id: string;
  name: string;
  icon: string;
  defaultDurationMinutes: number;
  isPaid: boolean;
  color: string;
  bgColor: string;
  textColor: string;
  description?: string;
  isActive: boolean;
}

export interface BlockedTimeEntry {
  id: string;
  typeId: string;
  providerId: string;
  locationId?: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: Date;
  createdBy: string;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // Every X days/weeks/months
  daysOfWeek?: number[]; // 0=Sunday, 6=Saturday
  endDate?: Date;
  exceptions?: Date[]; // Dates to skip
}

// Default blocked time types
export const BLOCKED_TIME_TYPES: BlockedTimeType[] = [
  {
    id: 'lunch',
    name: 'Lunch',
    icon: '🥪',
    defaultDurationMinutes: 30,
    isPaid: false,
    color: '#F59E0B',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    description: 'Lunch break',
    isActive: true,
  },
  {
    id: 'training',
    name: 'Training',
    icon: '📚',
    defaultDurationMinutes: 60,
    isPaid: true,
    color: '#8B5CF6',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    description: 'Training or education time',
    isActive: true,
  },
  {
    id: 'meeting',
    name: 'Meeting',
    icon: '📆',
    defaultDurationMinutes: 30,
    isPaid: true,
    color: '#3B82F6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    description: 'Staff meeting or team huddle',
    isActive: true,
  },
  {
    id: 'break',
    name: 'Break',
    icon: '☕',
    defaultDurationMinutes: 15,
    isPaid: false,
    color: '#6B7280',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    description: 'Short break',
    isActive: true,
  },
  {
    id: 'admin',
    name: 'Admin Time',
    icon: '📝',
    defaultDurationMinutes: 30,
    isPaid: true,
    color: '#10B981',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    description: 'Administrative tasks, charting, follow-ups',
    isActive: true,
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: '🏠',
    defaultDurationMinutes: 60,
    isPaid: false,
    color: '#EC4899',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-700',
    description: 'Personal time off',
    isActive: true,
  },
  {
    id: 'setup',
    name: 'Room Setup',
    icon: '🧹',
    defaultDurationMinutes: 15,
    isPaid: true,
    color: '#14B8A6',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-700',
    description: 'Room preparation between appointments',
    isActive: true,
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: '📦',
    defaultDurationMinutes: 30,
    isPaid: true,
    color: '#F97316',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    description: 'Inventory check or restocking',
    isActive: true,
  },
  {
    id: 'other',
    name: 'Other',
    icon: '⏰',
    defaultDurationMinutes: 30,
    isPaid: false,
    color: '#64748B',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    description: 'Other blocked time',
    isActive: true,
  },
];

// Get all active blocked time types
export function getActiveBlockedTimeTypes(): BlockedTimeType[] {
  return BLOCKED_TIME_TYPES.filter(t => t.isActive);
}

// Get blocked time type by ID
export function getBlockedTimeType(id: string): BlockedTimeType | undefined {
  return BLOCKED_TIME_TYPES.find(t => t.id === id);
}

// Calculate end time from start time and duration
export function calculateEndTime(startTime: Date, durationMinutes: number): Date {
  return new Date(startTime.getTime() + durationMinutes * 60 * 1000);
}

// Check if a time range overlaps with blocked time
export function overlapsWithBlockedTime(
  start: Date,
  end: Date,
  blockedTimes: BlockedTimeEntry[]
): BlockedTimeEntry | null {
  for (const blocked of blockedTimes) {
    const blockStart = new Date(blocked.startTime);
    const blockEnd = new Date(blocked.endTime);
    
    // Check for overlap
    if (start < blockEnd && end > blockStart) {
      return blocked;
    }
  }
  return null;
}

// Format duration for display
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}mins`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

// Format blocked time type for display
export function formatBlockedTimeType(type: BlockedTimeType): string {
  const duration = formatDuration(type.defaultDurationMinutes);
  const paid = type.isPaid ? 'Paid' : 'Unpaid';
  return `${type.name} • ${duration} • ${paid}`;
}

// Generate recurring blocked times
export function generateRecurringBlocks(
  entry: BlockedTimeEntry,
  fromDate: Date,
  toDate: Date
): BlockedTimeEntry[] {
  if (!entry.isRecurring || !entry.recurringPattern) {
    return [entry];
  }

  const results: BlockedTimeEntry[] = [];
  const pattern = entry.recurringPattern;
  let currentDate = new Date(entry.startTime);

  while (currentDate <= toDate) {
    // Skip if before fromDate
    if (currentDate >= fromDate) {
      // Check if this date is an exception
      const isException = pattern.exceptions?.some(
        ex => ex.toDateString() === currentDate.toDateString()
      );

      // Check day of week for weekly patterns
      const dayMatch = !pattern.daysOfWeek || 
        pattern.daysOfWeek.includes(currentDate.getDay());

      if (!isException && dayMatch) {
        const duration = new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime();
        results.push({
          ...entry,
          id: `${entry.id}-${currentDate.toISOString()}`,
          startTime: new Date(currentDate),
          endTime: new Date(currentDate.getTime() + duration),
        });
      }
    }

    // Advance to next occurrence
    switch (pattern.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + pattern.interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * pattern.interval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + pattern.interval);
        break;
    }

    // Check end date
    if (pattern.endDate && currentDate > pattern.endDate) {
      break;
    }
  }

  return results;
}
