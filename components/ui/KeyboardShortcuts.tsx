'use client';

// ============================================================
// KEYBOARD SHORTCUTS SYSTEM
// Global keyboard shortcuts for common actions
// ============================================================

import { useEffect, useCallback, useState, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
}

interface KeyboardShortcutsContextType {
  shortcuts: Shortcut[];
  registerShortcut: (shortcut: Shortcut) => void;
  unregisterShortcut: (key: string) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
  }
  return context;
}

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  // Default shortcuts
  useEffect(() => {
    const defaultShortcuts: Shortcut[] = [
      { key: 'n', metaKey: true, description: 'New Appointment', action: () => router.push('/admin/appointments/new') },
      { key: 'n', ctrlKey: true, description: 'New Appointment', action: () => router.push('/admin/appointments/new') },
      { key: 'c', metaKey: true, shiftKey: true, description: 'New Client', action: () => router.push('/admin/clients/new') },
      { key: 'c', ctrlKey: true, shiftKey: true, description: 'New Client', action: () => router.push('/admin/clients/new') },
      { key: 's', altKey: true, description: 'Sales Ledger', action: () => router.push('/admin/sales') },
      { key: 'a', altKey: true, description: 'Appointments', action: () => router.push('/admin/appointments') },
      { key: 'k', altKey: true, description: 'Clients', action: () => router.push('/admin/clients') },
      { key: 'd', altKey: true, description: 'Dashboard', action: () => router.push('/admin') },
      { key: 'p', altKey: true, description: 'POS', action: () => router.push('/pos') },
      { key: '/', metaKey: true, description: 'Show Shortcuts', action: () => setShowHelp(true) },
      { key: '/', ctrlKey: true, description: 'Show Shortcuts', action: () => setShowHelp(true) },
      { key: 'Escape', description: 'Close / Cancel', action: () => setShowHelp(false) },
    ];
    setShortcuts(defaultShortcuts);
  }, [router]);

  const registerShortcut = useCallback((shortcut: Shortcut) => {
    setShortcuts(prev => [...prev.filter(s => s.key !== shortcut.key), shortcut]);
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts(prev => prev.filter(s => s.key !== key));
  }, []);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        if (e.key !== 'Escape') return;
      }

      for (const shortcut of shortcuts) {
        const metaMatch = shortcut.metaKey ? e.metaKey : !e.metaKey || shortcut.ctrlKey;
        const ctrlMatch = shortcut.ctrlKey ? e.ctrlKey : !e.ctrlKey || shortcut.metaKey;
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.altKey ? e.altKey : !e.altKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (keyMatch && (metaMatch || ctrlMatch) && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return (
    <KeyboardShortcutsContext.Provider value={{ shortcuts, registerShortcut, unregisterShortcut, showHelp, setShowHelp }}>
      {children}
      
      {/* Keyboard Shortcuts Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Keyboard Shortcuts</h2>
              <p className="text-sm text-gray-500">Press Escape to close</p>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Navigation</h3>
                  <div className="space-y-2">
                    <ShortcutRow keys={['Alt', 'D']} description="Dashboard" />
                    <ShortcutRow keys={['Alt', 'A']} description="Appointments" />
                    <ShortcutRow keys={['Alt', 'K']} description="Clients" />
                    <ShortcutRow keys={['Alt', 'S']} description="Sales" />
                    <ShortcutRow keys={['Alt', 'P']} description="POS" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Actions</h3>
                  <div className="space-y-2">
                    <ShortcutRow keys={['⌘/Ctrl', 'N']} description="New Appointment" />
                    <ShortcutRow keys={['⌘/Ctrl', 'Shift', 'C']} description="New Client" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">General</h3>
                  <div className="space-y-2">
                    <ShortcutRow keys={['⌘/Ctrl', '/']} description="Show Shortcuts" />
                    <ShortcutRow keys={['Esc']} description="Close / Cancel" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowHelp(false)}
                className="w-full py-2 text-center text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </KeyboardShortcutsContext.Provider>
  );
}

function ShortcutRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{description}</span>
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <span key={i}>
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded">
              {key}
            </kbd>
            {i < keys.length - 1 && <span className="text-gray-400 mx-0.5">+</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export default KeyboardShortcutsProvider;
