'use client';

import { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown, Check } from 'lucide-react';
import { PERSONA_OPTIONS, type PersonaId } from '@/lib/agents/strategy-coach/personas';

interface PersonaSelectorProps {
  currentPersona: PersonaId | undefined;
  onSelect: (persona: PersonaId | null) => void;
  isLoading?: boolean;
}

export function PersonaSelector({
  currentPersona,
  onSelect,
  isLoading = false,
}: PersonaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const selected = PERSONA_OPTIONS.find((p) => p.id === currentPersona);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 320; // w-80 = 20rem = 320px

      // Position below the button, aligned to the right edge
      let left = rect.right - dropdownWidth;

      // Ensure it doesn't go off the left edge of the screen
      if (left < 16) {
        left = 16;
      }

      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: left,
        width: dropdownWidth,
      });
    }
  }, [isOpen]);

  const handleSelect = (personaId: PersonaId | null) => {
    onSelect(personaId);
    setIsOpen(false);
  };

  // Color mapping for persona badges
  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = {
      indigo: isSelected
        ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-200'
        : 'hover:bg-indigo-50/50',
      emerald: isSelected
        ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-200'
        : 'hover:bg-emerald-50/50',
      amber: isSelected
        ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-200'
        : 'hover:bg-amber-50/50',
    };
    return baseClasses[color as keyof typeof baseClasses] || 'hover:bg-slate-50';
  };

  const getTagBgClass = (color: string) => {
    const classes = {
      indigo: 'bg-indigo-100 text-indigo-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      amber: 'bg-amber-100 text-amber-700',
    };
    return classes[color as keyof typeof classes] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Users className="w-4 h-4 text-slate-500" />
        <span className="text-slate-700 font-medium">
          {selected?.name || 'Default Coach'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[99]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown - fixed position calculated from button */}
          <div
            className="bg-white rounded-2xl shadow-xl border border-slate-200 z-[100] overflow-hidden"
            style={dropdownStyle}
          >
            <div className="p-3 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Choose Your Coach
              </p>
            </div>

            <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
              {/* Default Coach Option */}
              <button
                onClick={() => handleSelect(null)}
                disabled={isLoading}
                className={`w-full text-left p-3 rounded-xl transition-all duration-300 border border-transparent ${
                  !currentPersona
                    ? 'bg-slate-50 border-slate-200 ring-2 ring-slate-200'
                    : 'hover:bg-slate-50'
                } disabled:opacity-50`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">
                        Default Coach
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Balanced coaching style with no specific persona
                    </p>
                  </div>
                  {!currentPersona && (
                    <Check className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  )}
                </div>
              </button>

              {/* Persona Options */}
              {PERSONA_OPTIONS.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => handleSelect(persona.id)}
                  disabled={isLoading}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 border border-transparent ${getColorClasses(
                    persona.color,
                    currentPersona === persona.id
                  )} disabled:opacity-50`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">
                          {persona.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {persona.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 italic mb-2">
                        &ldquo;{persona.tagline}&rdquo;
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {persona.bestFor.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-0.5 rounded-full ${getTagBgClass(
                              persona.color
                            )}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {currentPersona === persona.id && (
                      <Check className="w-5 h-5 text-slate-600 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
