'use client';

interface CoachTriggerButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function CoachTriggerButton({ onClick, isOpen }: CoachTriggerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-40
        w-14 h-14
        bg-[#fbbf24] text-slate-900 hover:bg-[#f59e0b]
        rounded-2xl shadow-xl
        flex items-center justify-center
        transition-all duration-300
        hover:shadow-2xl hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 focus:ring-offset-2
        ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'}
      `}
      aria-label={isOpen ? 'Close coach chat' : 'Open coach chat'}
      aria-expanded={isOpen}
    >
      {/* Chat bubble icon with sparkle */}
      <svg
        className="w-7 h-7 text-slate-900"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {/* Chat bubble */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      {/* Sparkle accent */}
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#fbbf24] rounded-full animate-pulse" />
    </button>
  );
}
