'use client';

// ============================================================
// MODE SWITCHER - Tab Navigation Between Admin/Owner/Provider
// Clean, prominent tabs for switching portal modes
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MODES = [
  { 
    id: 'admin', 
    label: 'Admin', 
    href: '/admin', 
    icon: '📊',
    description: 'Operations & Clients',
    color: 'pink',
    match: (path: string) => path.startsWith('/admin') && !path.startsWith('/admin/owner'),
  },
  { 
    id: 'owner', 
    label: 'Owner', 
    href: '/admin/owner', 
    icon: '👑',
    description: 'System Control',
    color: 'amber',
    match: (path: string) => path.startsWith('/admin/owner'),
  },
  { 
    id: 'provider', 
    label: 'Provider', 
    href: '/provider', 
    icon: '🩺',
    description: 'Clinical Portal',
    color: 'emerald',
    match: (path: string) => path.startsWith('/provider'),
  },
];

interface ModeSwitcherProps {
  variant?: 'tabs' | 'pills' | 'minimal';
  showDescription?: boolean;
}

export default function ModeSwitcher({ variant = 'tabs', showDescription = false }: ModeSwitcherProps) {
  const pathname = usePathname();

  const getActiveMode = () => {
    return MODES.find(mode => mode.match(pathname))?.id || 'admin';
  };

  const activeMode = getActiveMode();

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-1">
        {MODES.map((mode) => {
          const isActive = mode.id === activeMode;
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? mode.color === 'pink' ? 'bg-pink-500 text-white' :
                    mode.color === 'amber' ? 'bg-amber-500 text-white' :
                    'bg-emerald-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span>{mode.icon}</span>
              <span className="hidden sm:inline">{mode.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className="flex items-center gap-2 p-1 bg-gray-800/50 rounded-xl">
        {MODES.map((mode) => {
          const isActive = mode.id === activeMode;
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              <span className="text-lg">{mode.icon}</span>
              <span>{mode.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  // Default: tabs variant
  return (
    <div className="flex items-center">
      {MODES.map((mode, index) => {
        const isActive = mode.id === activeMode;
        const colorClasses = {
          pink: isActive ? 'border-pink-500 text-pink-400 bg-pink-500/10' : 'border-transparent text-gray-400 hover:text-pink-400 hover:border-pink-500/50',
          amber: isActive ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-transparent text-gray-400 hover:text-amber-400 hover:border-amber-500/50',
          emerald: isActive ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50',
        };
        
        return (
          <Link
            key={mode.id}
            href={mode.href}
            className={`
              relative flex items-center gap-2 px-5 py-3 border-b-2 transition-all
              ${colorClasses[mode.color as keyof typeof colorClasses]}
              ${index > 0 ? 'ml-1' : ''}
            `}
          >
            <span className="text-xl">{mode.icon}</span>
            <div>
              <span className="font-semibold text-sm">{mode.label}</span>
              {showDescription && (
                <p className="text-[10px] text-gray-500">{mode.description}</p>
              )}
            </div>
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

// Compact version for mobile
export function ModeSwitcherMobile() {
  const pathname = usePathname();
  
  const getActiveMode = () => {
    return MODES.find(mode => mode.match(pathname))?.id || 'admin';
  };

  const activeMode = getActiveMode();

  return (
    <div className="flex justify-center gap-4 py-2 px-4 bg-[#0a0a0a] border-b border-gray-800">
      {MODES.map((mode) => {
        const isActive = mode.id === activeMode;
        return (
          <Link
            key={mode.id}
            href={mode.href}
            className={`
              flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
              ${isActive 
                ? mode.color === 'pink' ? 'bg-pink-500/20 text-pink-400' :
                  mode.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                : 'text-gray-500'
              }
            `}
          >
            <span className="text-2xl">{mode.icon}</span>
            <span className="text-xs font-medium">{mode.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
