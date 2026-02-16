'use client';

// ============================================================
// HELLO GORGEOUS DESIGN SYSTEM
// Fresha-level UX components - Black/White/Pink theme
// ============================================================

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================
// COLORS (BRAND STANDARD)
// ============================================================
export const COLORS = {
  // Core
  black: '#0a0a0a',
  white: '#ffffff',
  pink: '#ec4899',
  pinkLight: '#fdf2f8',
  pinkDark: '#db2777',
  
  // Text
  textPrimary: '#0a0a0a',
  textSecondary: '#4b5563',
  textMuted: '#9ca3af',
  
  // Status
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Backgrounds
  bgDark: '#0a0a0a',
  bgCard: '#ffffff',
  bgHover: '#f9fafb',
};

// ============================================================
// SKELETON LOADERS (No spinners - smooth pulse)
// ============================================================
export function Skeleton({ className = '', variant = 'default' }: { 
  className?: string; 
  variant?: 'default' | 'text' | 'circular' | 'card';
}) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]';
  const variantClasses = {
    default: 'rounded',
    text: 'rounded h-4',
    circular: 'rounded-full',
    card: 'rounded-xl',
  };
  
  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
}

export function KPISkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-black">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-10 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <Skeleton className="h-10 w-10" variant="circular" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ANIMATED NUMBER (Counts up smoothly)
// ============================================================
export function AnimatedNumber({ 
  value, 
  prefix = '', 
  suffix = '',
  duration = 1000,
  decimals = 0,
}: { 
  value: number; 
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * eased;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  const formatted = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.round(displayValue).toLocaleString();
  
  return <span>{prefix}{formatted}{suffix}</span>;
}

// ============================================================
// KPI CARD (Core dashboard component)
// ============================================================
interface KPICardProps {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  icon?: string;
  trend?: { value: number; positive: boolean };
  color?: 'default' | 'pink' | 'green' | 'amber' | 'red';
  loading?: boolean;
  size?: 'default' | 'large';
  href?: string;
  animate?: boolean;
}

export function KPICard({
  label,
  value,
  prefix = '',
  suffix = '',
  icon,
  trend,
  color = 'default',
  loading = false,
  size = 'default',
  href,
  animate = true,
}: KPICardProps) {
  const colorClasses = {
    default: 'text-black',
    pink: 'text-pink-600',
    green: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
  };
  
  const bgAccent = {
    default: '',
    pink: 'bg-gradient-to-br from-pink-50 to-white',
    green: 'bg-gradient-to-br from-emerald-50 to-white',
    amber: 'bg-gradient-to-br from-amber-50 to-white',
    red: 'bg-gradient-to-br from-red-50 to-white',
  };
  
  const content = (
    <div className={`
      bg-white rounded-2xl p-6 shadow-sm border border-black 
      transition-all duration-300 hover:shadow-lg hover:border-pink-200 hover:-translate-y-0.5
      ${bgAccent[color]}
      ${size === 'large' ? 'p-8' : ''}
      ${href ? 'cursor-pointer' : ''}
    `}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-black">{label}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      
      {loading ? (
        <>
          <Skeleton className="h-10 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </>
      ) : (
        <>
          <p className={`${size === 'large' ? 'text-4xl' : 'text-3xl'} font-bold ${colorClasses[color]} tracking-tight`}>
            {typeof value === 'number' && animate ? (
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            ) : (
              `${prefix}${typeof value === 'number' ? value.toLocaleString() : value}${suffix}`
            )}
          </p>
          
          {trend && (
            <p className={`text-sm mt-2 font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
              <span className="inline-block mr-1">{trend.positive ? '↑' : '↓'}</span>
              {Math.abs(trend.value)}% vs last period
            </p>
          )}
        </>
      )}
    </div>
  );
  
  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return content;
}

// ============================================================
// STATUS BADGE
// ============================================================
interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function StatusBadge({ status, size = 'md', pulse = false }: StatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    // Appointment statuses
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    checked_in: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-white text-black border-black',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    no_show: 'bg-amber-100 text-amber-700 border-amber-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    
    // General
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    inactive: 'bg-white text-black border-black',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
  };
  
  const style = statusStyles[status.toLowerCase()] || 'bg-white text-black border-black';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 font-medium rounded-full border ${style} ${sizeClass}
    `}>
      {pulse && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          status === 'checked_in' || status === 'active' ? 'bg-emerald-500' :
          status === 'in_progress' ? 'bg-purple-500' :
          'bg-current'
        }`} />
      )}
      {status.replace(/_/g, ' ')}
    </span>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-black mb-1">{title}</h3>
      {description && <p className="text-sm text-black text-center max-w-sm">{description}</p>}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="mt-4 px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="mt-4 px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

// ============================================================
// CARD COMPONENT
// ============================================================
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', hover = true, padding = 'md' }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };
  
  return (
    <div className={`
      bg-white rounded-2xl border border-black shadow-sm
      ${hover ? 'transition-all duration-300 hover:shadow-md hover:border-black' : ''}
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================
interface SectionHeaderProps {
  title: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  badge?: string | number;
}

export function SectionHeader({ title, action, badge }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        {badge !== undefined && (
          <span className="px-2 py-0.5 bg-white text-black text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
      </div>
      {action && (
        action.href ? (
          <Link href={action.href} className="text-sm text-pink-600 font-medium hover:text-pink-700">
            {action.label} →
          </Link>
        ) : (
          <button onClick={action.onClick} className="text-sm text-pink-600 font-medium hover:text-pink-700">
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

// ============================================================
// ALERT BANNER
// ============================================================
interface AlertBannerProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export function AlertBanner({ type, title, message, action, onDismiss }: AlertBannerProps) {
  const styles = {
    success: 'bg-emerald-500 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };
  
  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ',
  };
  
  return (
    <div className={`rounded-xl p-4 ${styles[type]}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{icons[type]}</span>
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          {message && <p className="text-sm opacity-90">{message}</p>}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="px-4 py-2 bg-white/20 rounded-lg font-medium hover:bg-white/30 transition-colors"
          >
            {action.label}
          </button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} className="p-1 hover:bg-white/20 rounded-lg">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// QUICK ACTION BUTTON
// ============================================================
interface QuickActionProps {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
  color?: 'default' | 'pink' | 'green';
}

export function QuickAction({ icon, label, href, onClick, color = 'default' }: QuickActionProps) {
  const colorClasses = {
    default: 'bg-white hover:bg-pink-50 hover:text-pink-600 text-black',
    pink: 'bg-pink-500 hover:bg-pink-600 text-white',
    green: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  };
  
  const content = (
    <div className={`
      flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200
      ${colorClasses[color]}
    `}>
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
  
  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return <button onClick={onClick}>{content}</button>;
}

// ============================================================
// APPOINTMENT ROW
// ============================================================
interface AppointmentRowProps {
  id: string;
  time: string;
  clientName: string;
  serviceName: string;
  status: string;
  duration?: number;
  amount?: number;
  isNext?: boolean;
  onAction?: (action: string) => void;
}

export function AppointmentRow({
  id,
  time,
  clientName,
  serviceName,
  status,
  duration,
  amount,
  isNext = false,
  onAction,
}: AppointmentRowProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  return (
    <div className={`
      flex items-center gap-4 p-4 rounded-xl transition-all duration-200
      ${isNext ? 'bg-pink-50 border-2 border-pink-200' : 'hover:bg-white'}
    `}>
      <div className="text-center min-w-[70px]">
        <p className={`text-lg font-bold ${isNext ? 'text-pink-600' : 'text-black'}`}>
          {formatTime(time)}
        </p>
        {duration && <p className="text-xs text-black">{duration} min</p>}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-black truncate">{clientName}</p>
          {isNext && (
            <span className="px-2 py-0.5 bg-pink-500 text-white text-xs font-medium rounded-full">
              UP NEXT
            </span>
          )}
        </div>
        <p className="text-sm text-black truncate">{serviceName}</p>
      </div>
      
      {amount !== undefined && (
        <p className="font-semibold text-black">${amount}</p>
      )}
      
      <StatusBadge status={status} pulse={status === 'checked_in'} />
      
      {onAction && (
        <Link
          href={`/provider/charting?appointment=${id}`}
          className="px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          Start
        </Link>
      )}
    </div>
  );
}

// ============================================================
// PROGRESS BAR
// ============================================================
export function ProgressBar({ 
  value, 
  max = 100, 
  color = 'pink',
  showLabel = true,
}: { 
  value: number; 
  max?: number;
  color?: 'pink' | 'green' | 'amber';
  showLabel?: boolean;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    pink: 'bg-pink-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
  };
  
  return (
    <div className="w-full">
      <div className="h-2 bg-white rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-black mt-1 text-right">{Math.round(percentage)}%</p>
      )}
    </div>
  );
}
