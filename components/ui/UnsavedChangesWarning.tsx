'use client';

// ============================================================
// UNSAVED CHANGES WARNING HOOK
// Warns users before leaving with unsaved changes
// ============================================================

import { useEffect, useCallback, useState } from 'react';

interface UseUnsavedChangesOptions {
  hasChanges: boolean;
  message?: string;
}

export function useUnsavedChanges({ hasChanges, message = 'You have unsaved changes. Are you sure you want to leave?' }: UseUnsavedChangesOptions) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges, message]);

  // Confirm before closing modals
  const confirmClose = useCallback(() => {
    if (hasChanges) {
      return window.confirm(message);
    }
    return true;
  }, [hasChanges, message]);

  return { confirmClose };
}

// Hook to track form changes
export function useFormChanges<T extends object>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [initialState] = useState<T>(initialValues);
  
  const hasChanges = JSON.stringify(values) !== JSON.stringify(initialState);

  const resetChanges = useCallback(() => {
    setValues(initialState);
  }, [initialState]);

  const updateValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    values,
    setValues,
    hasChanges,
    resetChanges,
    updateValue,
  };
}

// Modal wrapper that handles unsaved changes
interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasChanges: boolean;
  children: React.ReactNode;
}

export function UnsavedChangesModal({ isOpen, onClose, hasChanges, children }: UnsavedChangesModalProps) {
  const handleClose = useCallback(() => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [hasChanges, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
      <div 
        className="absolute inset-0 -z-10" 
        onClick={handleClose}
      />
    </div>
  );
}

export default useUnsavedChanges;
