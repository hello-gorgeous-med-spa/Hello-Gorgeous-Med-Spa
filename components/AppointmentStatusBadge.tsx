'use client';

// ============================================================
// APPOINTMENT STATUS BADGE COMPONENT
// Displays appointment status with color coding and actions
// ============================================================

import { useState } from 'react';
import {
  AppointmentStatusKey,
  APPOINTMENT_STATUSES,
  getStatusConfig,
  getAvailableActions,
  canTransitionTo,
} from '@/lib/hgos/appointment-statuses';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatusKey;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function AppointmentStatusBadge({
  status,
  showIcon = true,
  size = 'md',
  onClick,
}: AppointmentStatusBadgeProps) {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.bgColor} ${config.textColor} ${sizeClasses[size]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
      onClick={onClick}
    >
      {showIcon && <span>{config.icon}</span>}
      {config.displayName}
    </span>
  );
}

interface AppointmentStatusDropdownProps {
  status: AppointmentStatusKey;
  appointmentId: string;
  onStatusChange?: (newStatus: AppointmentStatusKey) => void;
  disabled?: boolean;
}

export function AppointmentStatusDropdown({
  status,
  appointmentId,
  onStatusChange,
  disabled = false,
}: AppointmentStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const config = getStatusConfig(status);
  const actions = getAvailableActions(status);

  const handleAction = async (action: typeof actions[0]) => {
    if (action.requiresConfirmation) {
      if (!confirm(action.confirmationMessage || 'Are you sure?')) {
        return;
      }
    }

    if (action.nextStatus) {
      setLoading(true);
      try {
        // Call onStatusChange callback
        onStatusChange?.(action.nextStatus);
      } finally {
        setLoading(false);
        setIsOpen(false);
      }
    }
  };

  if (config.isFinal || actions.length === 0 || disabled) {
    return <AppointmentStatusBadge status={status} />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full ${config.bgColor} ${config.textColor} hover:opacity-80 transition-opacity`}
        disabled={loading}
      >
        <span>{config.icon}</span>
        {config.displayName}
        <span className="ml-1">▾</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-black py-1 z-50 min-w-[180px]">
            {actions.map((action) => (
              <button
                key={action.key}
                onClick={() => handleAction(action)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-white flex items-center gap-2"
                disabled={loading}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Status workflow/timeline component
interface AppointmentStatusTimelineProps {
  currentStatus: AppointmentStatusKey;
}

export function AppointmentStatusTimeline({ currentStatus }: AppointmentStatusTimelineProps) {
  const workflow: AppointmentStatusKey[] = ['pending', 'confirmed', 'checked_in', 'in_progress', 'completed'];
  const currentIndex = workflow.indexOf(currentStatus);
  
  // Handle cancelled/no-show separately
  if (currentStatus === 'cancelled' || currentStatus === 'no_show') {
    const config = getStatusConfig(currentStatus);
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${config.bgColor}`}>
        <span>{config.icon}</span>
        <span className={`font-medium ${config.textColor}`}>
          Appointment {config.displayName}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {workflow.map((step, index) => {
        const config = getStatusConfig(step);
        const isActive = index <= currentIndex;
        const isCurrent = step === currentStatus;

        return (
          <div key={step} className="flex items-center">
            {/* Step indicator */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                isCurrent
                  ? `${config.bgColor} ${config.textColor} ring-2 ring-offset-2`
                  : isActive
                  ? 'bg-green-100 text-green-600'
                  : 'bg-white text-black'
              }`}
              style={isCurrent ? { ringColor: config.color } : {}}
              title={config.displayName}
            >
              {isActive && !isCurrent ? '✓' : config.icon}
            </div>
            
            {/* Connector line */}
            {index < workflow.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  index < currentIndex ? 'bg-green-300' : 'bg-white'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
