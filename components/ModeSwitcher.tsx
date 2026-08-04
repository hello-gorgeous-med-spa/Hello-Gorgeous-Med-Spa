'use client';

// ============================================================
// MODE SWITCHER — Owner / Admin / Command / Staff Hub / Provider
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const PORTAL_MODES = [
  {
    id: 'desk',
    label: 'Desk',
    href: '/desk',
    icon: '🏠',
    description: 'Business bible',
    color: 'pink',
    match: (path: string) => path === '/desk' || path.startsWith('/desk/'),
  },
  {
    id: 'owner',
    label: 'Owner',
    href: '/admin/owner',
    icon: '👑',
    description: 'Business control',
    color: 'amber',
    match: (path: string) => path.startsWith('/admin/owner'),
  },
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin',
    icon: '📊',
    description: 'Daily operations',
    color: 'pink',
    match: (path: string) =>
      (path === '/admin' || path.startsWith('/admin/')) &&
      !path.startsWith('/admin/owner') &&
      !path.startsWith('/admin/command-center'),
  },
  {
    id: 'command',
    label: 'Team',
    href: '/admin/command-center',
    icon: '🎛️',
    description: 'Team hub & ops board',
    color: 'pink',
    match: (path: string) => path.startsWith('/admin/command-center'),
  },
  {
    id: 'staff-hub',
    label: 'Staff Hub',
    href: '/staff',
    icon: '📋',
    description: 'Training & protocols',
    color: 'emerald',
    match: (path: string) => path === '/staff' || path.startsWith('/staff/'),
  },
  {
    id: 'provider',
    label: 'Spa Provider',
    href: '/provider',
    icon: '🩺',
    description: 'Clinical portal',
    color: 'emerald',
    match: (path: string) => path.startsWith('/provider'),
  },
] as const;

interface ModeSwitcherProps {
  variant?: 'tabs' | 'pills' | 'minimal' | 'header';
  showDescription?: boolean;
  /** Hide modes the signed-in user cannot use (optional). */
  visibleModeIds?: string[];
}

function activeModeId(pathname: string): string {
  return PORTAL_MODES.find((mode) => mode.match(pathname))?.id || 'desk';
}

function pillClass(color: string, isActive: boolean): string {
  if (!isActive) return 'text-white/70 hover:text-white hover:bg-white/10';
  if (color === 'amber') return 'bg-amber-500 text-white shadow-sm';
  if (color === 'emerald') return 'bg-emerald-600 text-white shadow-sm';
  return 'bg-[#FF2D8E] text-white shadow-sm';
}

export default function ModeSwitcher({
  variant = 'tabs',
  showDescription = false,
  visibleModeIds,
}: ModeSwitcherProps) {
  const pathname = usePathname();
  const activeMode = activeModeId(pathname);
  const modes = visibleModeIds
    ? PORTAL_MODES.filter((m) => visibleModeIds.includes(m.id))
    : PORTAL_MODES;

  if (variant === 'header') {
    return (
      <div className="hidden md:flex items-center bg-white/10 rounded-full p-1 gap-0.5 overflow-x-auto max-w-[min(100%,720px)]">
        {modes.map((mode) => {
          const isActive = mode.id === activeMode;
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${pillClass(mode.color, isActive)}`}
            >
              <span aria-hidden>{mode.icon}</span>
              <span>{mode.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {modes.map((mode) => {
          const isActive = mode.id === activeMode;
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  isActive
                    ? mode.color === 'pink'
                      ? 'bg-[#FF2D8E] text-white'
                      : mode.color === 'amber'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
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
      <div className="flex items-center gap-2 p-1 bg-white rounded-xl flex-wrap">
        {modes.map((mode) => {
          const isActive = mode.id === activeMode;
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive ? 'bg-[#FF2D8E] text-white shadow-lg' : 'text-black hover:text-[#FF2D8E]'}
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

  return (
    <div className="flex items-center flex-wrap">
      {modes.map((mode, index) => {
        const isActive = mode.id === activeMode;
        const colorClasses = {
          pink: isActive
            ? 'border-[#FF2D8E] text-[#FF2D8E] bg-[#FF2D8E]/10'
            : 'border-transparent text-black hover:text-[#FF2D8E] hover:border-[#FF2D8E]/50',
          amber: isActive
            ? 'border-[#FF2D8E] text-[#FF2D8E] bg-amber-500/10'
            : 'border-transparent text-black hover:text-[#FF2D8E] hover:border-[#FF2D8E]/50',
          emerald: isActive
            ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
            : 'border-transparent text-black hover:text-emerald-400 hover:border-emerald-500/50',
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
              {showDescription && <p className="text-[10px] text-black">{mode.description}</p>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function ModeSwitcherMobile() {
  const pathname = usePathname();
  const activeMode = activeModeId(pathname);

  return (
    <div className="flex justify-center gap-2 py-2 px-2 bg-[#0a0a0a] border-b border-black overflow-x-auto">
      {PORTAL_MODES.map((mode) => {
        const isActive = mode.id === activeMode;
        return (
          <Link
            key={mode.id}
            href={mode.href}
            className={`
              flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all shrink-0
              ${
                isActive
                  ? mode.color === 'pink'
                    ? 'bg-[#FF2D8E]/20 text-[#FF2D8E]'
                    : mode.color === 'amber'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-400'
                  : 'text-white/55'
              }
            `}
          >
            <span className="text-xl">{mode.icon}</span>
            <span className="text-[10px] font-medium">{mode.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
