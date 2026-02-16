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
                  ? mode.color === 'pink' ? 'bg-[#FF2D8E] text-white' :
                    mode.color === 'amber' ? 'bg-amber-500 text-white' :
                    'bg-emerald-500 text-white'
                  : 'text-black hover:text-[#FF2D8E] hover:bg-[#FF2D8E]/10'
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
      <div className="flex items-center gap-2 p-1 bg-white rounded-xl">
        {MODES.map((mode) => {
          const isActive = mode.id === activeMode;
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-[#FF2D8E] text-white shadow-lg' 
                  : 'text-black hover:text-[#FF2D8E]'
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
          pink: isActive ? 'border-[#FF2D8E] text-[#FF2D8E] bg-[#FF2D8E]/10' : 'border-transparent text-black hover:text-[#FF2D8E] hover:border-[#FF2D8E]/50',
          amber: isActive ? 'border-[#FF2D8E] text-[#FF2D8E] bg-amber-500/10' : 'border-transparent text-black hover:text-[#FF2D8E] hover:border-[#FF2D8E]/50',
          emerald: isActive ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-black hover:text-emerald-400 hover:border-emerald-500/50',
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
                <p className="text-[10px] text-black">{mode.description}</p>
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
    <div className="flex justify-center gap-4 py-2 px-4 bg-[#0a0a0a] border-b border-black">
      {MODES.map((mode) => {
        const isActive = mode.id === activeMode;
        return (
          <Link
            key={mode.id}
            href={mode.href}
            className={`
              flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
              ${isActive 
                ? mode.color === 'pink' ? 'bg-[#FF2D8E]/20 text-[#FF2D8E]' :
                  mode.color === 'amber' ? 'bg-amber-500/20 text-[#FF2D8E]' :
                  'bg-emerald-500/20 text-emerald-400'
                : 'text-black'
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
