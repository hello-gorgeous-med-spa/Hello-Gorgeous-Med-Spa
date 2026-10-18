// ============================================================
// HELLO GORGEOUS OS - TEAM SCHEDULING & SHIFTS
// Weekly roster, timesheets, and availability management
// ============================================================

export type ShiftStatus = 'scheduled' | 'working' | 'completed' | 'missed' | 'time_off';

export interface TeamMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'provider' | 'staff' | 'admin';
  credentials?: string;
  color: string; // For calendar display
  defaultShift?: DefaultShift;
  hourlyRate?: number;
  isActive: boolean;
}

export interface DefaultShift {
  monday?: ShiftTime;
  tuesday?: ShiftTime;
  wednesday?: ShiftTime;
  thursday?: ShiftTime;
  friday?: ShiftTime;
  saturday?: ShiftTime;
  sunday?: ShiftTime;
}

export interface ShiftTime {
  start: string; // HH:mm format
  end: string;
  breakMinutes?: number;
}

export interface ScheduledShift {
  id: string;
  teamMemberId: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  breakMinutes: number;
  status: ShiftStatus;
  locationId?: string;
  notes?: string;
  // Time tracking
  clockedInAt?: string;
  clockedOutAt?: string;
  actualBreakMinutes?: number;
  // Calculated
  scheduledHours: number;
  actualHours?: number;
}

export interface TimeOffRequest {
  id: string;
  teamMemberId: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  status: 'pending' | 'approved' | 'denied';
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface WeeklySchedule {
  weekStart: string; // Monday date
  weekEnd: string; // Sunday date
  teamMembers: TeamMemberWeek[];
  totalScheduledHours: number;
}

export interface TeamMemberWeek {
  member: TeamMember;
  shifts: (ScheduledShift | null)[]; // Array of 7 days (Mon-Sun), null = not working
  totalHours: number;
  totalBreakMinutes: number;
}

// ============================================================
// HELLO GORGEOUS TEAM - Default Configuration
// ============================================================

export const TEAM_MEMBERS: TeamMember[] = [
  // INACTIVE - Ryan Kent no longer affiliated (Oct 2026)
  // Cannot accept new appointments or assignments. Historical records preserved.
  {
    id: 'ryan',
    userId: 'ryan-user-id',
    firstName: 'Ryan',
    lastName: 'Kent',
    role: 'provider',
    credentials: 'APRN, FNP-BC (Inactive)',
    color: '#6B7280', // Gray - inactive
    isActive: false, // DISABLED - cannot accept new assignments
    defaultShift: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
  },
  {
    id: 'danielle',
    userId: 'danielle-user-id',
    firstName: 'Danielle',
    lastName: 'Alcala',
    role: 'provider',
    color: '#8B5CF6', // Purple
    isActive: true,
    defaultShift: {
      monday: { start: '11:00', end: '16:00', breakMinutes: 0 },
      tuesday: { start: '11:00', end: '16:00', breakMinutes: 0 },
      wednesday: null, // Off
      thursday: { start: '11:00', end: '16:00', breakMinutes: 0 },
      friday: { start: '11:00', end: '16:00', breakMinutes: 0 },
      saturday: null, // Off
      sunday: null, // Off
    },
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate hours between two times
 */
export function calculateShiftHours(startTime: string, endTime: string, breakMinutes: number = 0): number {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  const totalMinutes = endMinutes - startMinutes - breakMinutes;
  return Math.round((totalMinutes / 60) * 100) / 100;
}

/**
 * Format time for display (e.g., "10:00" -> "10am")
 */
export function formatShiftTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  
  if (minutes === 0) {
    return `${displayHours}${period}`;
  }
  return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
}

/**
 * Format shift range (e.g., "10am - 5pm")
 */
export function formatShiftRange(startTime: string, endTime: string): string {
  return `${formatShiftTime(startTime)} - ${formatShiftTime(endTime)}`;
}

/**
 * Get week dates starting from a given date (Monday start)
 */
export function getWeekDates(date: Date = new Date()): Date[] {
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

/**
 * Format date for display
 */
export function formatWeekDay(date: Date): { dayName: string; dayNum: number; month: string } {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    dayName: days[date.getDay()],
    dayNum: date.getDate(),
    month: months[date.getMonth()],
  };
}

/**
 * Generate default schedule for a week based on team member defaults
 */
export function generateDefaultSchedule(
  member: TeamMember,
  weekDates: Date[]
): (ScheduledShift | null)[] {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  
  return weekDates.map(date => {
    const dayName = dayNames[date.getDay()];
    const defaultShift = member.defaultShift?.[dayName as keyof DefaultShift];
    
    if (!defaultShift) return null;
    
    return {
      id: `${member.id}-${date.toISOString().split('T')[0]}`,
      teamMemberId: member.id,
      date: date.toISOString().split('T')[0],
      startTime: defaultShift.start,
      endTime: defaultShift.end,
      breakMinutes: defaultShift.breakMinutes || 0,
      status: 'scheduled' as ShiftStatus,
      scheduledHours: calculateShiftHours(defaultShift.start, defaultShift.end, defaultShift.breakMinutes || 0),
    };
  });
}

/**
 * Build weekly schedule for all team members
 */
export function buildWeeklySchedule(
  members: TeamMember[],
  weekStart: Date,
  existingShifts?: ScheduledShift[]
): WeeklySchedule {
  const weekDates = getWeekDates(weekStart);
  const weekEnd = weekDates[6];
  
  let totalScheduledHours = 0;
  
  const teamMembers: TeamMemberWeek[] = members.filter(m => m.isActive).map(member => {
    // Check for existing shifts or generate defaults
    const shifts = existingShifts
      ? weekDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return existingShifts.find(s => s.teamMemberId === member.id && s.date === dateStr) || null;
        })
      : generateDefaultSchedule(member, weekDates);
    
    const totalHours = shifts.reduce((sum, s) => sum + (s?.scheduledHours || 0), 0);
    const totalBreakMinutes = shifts.reduce((sum, s) => sum + (s?.breakMinutes || 0), 0);
    
    totalScheduledHours += totalHours;
    
    return {
      member,
      shifts,
      totalHours,
      totalBreakMinutes,
    };
  });
  
  return {
    weekStart: weekDates[0].toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0],
    teamMembers,
    totalScheduledHours,
  };
}

/**
 * Calculate daily hours for a date across all team members
 */
export function getDailyTotalHours(schedule: WeeklySchedule, dayIndex: number): number {
  return schedule.teamMembers.reduce((sum, tm) => {
    const shift = tm.shifts[dayIndex];
    return sum + (shift?.scheduledHours || 0);
  }, 0);
}

/**
 * Check for scheduling conflicts
 */
export function checkConflicts(
  memberId: string,
  date: string,
  startTime: string,
  endTime: string,
  existingShifts: ScheduledShift[]
): boolean {
  const memberShifts = existingShifts.filter(s => s.teamMemberId === memberId && s.date === date);
  
  const [newStart, newEnd] = [
    timeToMinutes(startTime),
    timeToMinutes(endTime),
  ];
  
  for (const shift of memberShifts) {
    const [existStart, existEnd] = [
      timeToMinutes(shift.startTime),
      timeToMinutes(shift.endTime),
    ];
    
    // Check overlap
    if (newStart < existEnd && newEnd > existStart) {
      return true; // Conflict found
    }
  }
  
  return false;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// ============================================================
// TIMESHEET & PAY CALCULATIONS
// ============================================================

export interface TimesheetEntry {
  date: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  scheduledHours: number;
  actualHours: number;
  overtimeHours: number;
  breakMinutes: number;
  status: 'pending' | 'approved' | 'disputed';
}

export interface PayPeriodSummary {
  teamMemberId: string;
  periodStart: string;
  periodEnd: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  hourlyRate: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  entries: TimesheetEntry[];
}

/**
 * Calculate pay for a period
 */
export function calculatePay(
  hours: number,
  hourlyRate: number,
  overtimeThreshold: number = 40
): { regular: number; overtime: number; total: number } {
  const regularHours = Math.min(hours, overtimeThreshold);
  const overtimeHours = Math.max(0, hours - overtimeThreshold);
  
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * 1.5;
  
  return {
    regular: Math.round(regularPay * 100) / 100,
    overtime: Math.round(overtimePay * 100) / 100,
    total: Math.round((regularPay + overtimePay) * 100) / 100,
  };
}

// ============================================================
// AVAILABILITY MANAGEMENT
// ============================================================

export interface AvailabilityBlock {
  id: string;
  teamMemberId: string;
  dayOfWeek: number; // 0-6, Sunday = 0
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  effectiveFrom?: string;
  effectiveUntil?: string;
}

/**
 * Check if team member is available at a specific time
 */
export function isAvailable(
  member: TeamMember,
  date: Date,
  time: string,
  timeOffRequests: TimeOffRequest[] = []
): boolean {
  // Check time off
  const dateStr = date.toISOString().split('T')[0];
  const hasTimeOff = timeOffRequests.some(
    r => r.teamMemberId === member.id &&
         r.status === 'approved' &&
         dateStr >= r.startDate &&
         dateStr <= r.endDate
  );
  
  if (hasTimeOff) return false;
  
  // Check default schedule
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const dayName = dayNames[date.getDay()];
  const defaultShift = member.defaultShift?.[dayName as keyof DefaultShift];
  
  if (!defaultShift) return false;
  
  const timeMinutes = timeToMinutes(time);
  const shiftStart = timeToMinutes(defaultShift.start);
  const shiftEnd = timeToMinutes(defaultShift.end);
  
  return timeMinutes >= shiftStart && timeMinutes < shiftEnd;
}
