'use client';

import Image from 'next/image';
import type { PersonaId } from '@/lib/agents/strategy-coach/personas';

/** Minimal persona info needed for the sidebar display */
interface CoachProfileProps {
  personaId: PersonaId | null;
  isIconOnly?: boolean;
}

const PERSONA_DISPLAY: Record<PersonaId, { name: string; title: string; color: string }> = {
  marcus: { name: 'Marcus', title: 'The Strategic Navigator', color: 'indigo' },
  elena: { name: 'Elena', title: 'The Capability Builder', color: 'emerald' },
  richard: { name: 'Richard', title: 'The Transformation Pragmatist', color: 'amber' },
  'growth-architect': { name: 'Growth Architect', title: 'The Growth Architect', color: 'cyan' },
  'product-purist': { name: 'Product Purist', title: 'The Product Purist', color: 'violet' },
  'scale-navigator': { name: 'Scale Navigator', title: 'The Scale Navigator', color: 'rose' },
};

export function CoachProfile({ personaId, isIconOnly = false }: CoachProfileProps) {
  const display = personaId ? PERSONA_DISPLAY[personaId] : null;
  const name = display?.name || 'Marcus';
  const title = display?.title || 'The Strategic Navigator';

  if (isIconOnly) {
    return (
      <div className="flex justify-center py-3">
        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/20 transition-transform duration-300 hover:scale-110" suppressHydrationWarning>
          <Image
            src="/avatars/marcus.jpg"
            alt="Marcus"
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-4" suppressHydrationWarning>
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/20 transition-transform duration-300 hover:scale-110">
        <Image
          src="/avatars/marcus.jpg"
          alt="Marcus"
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white truncate">{name}</p>
        <p className="text-[11px] text-white/50 truncate">{title}</p>
      </div>
    </div>
  );
}
