'use client';

import { useEffect, useState, useMemo } from 'react';
import { CheckCircle2, ArrowRight, Star, Sparkles } from 'lucide-react';

interface CelebrationOverlayProps {
  type: 'area_complete' | 'territory_complete' | 'phase_complete';
  territory?: string;
  areaTitle?: string;
  xpAwarded: number;
  microSynthesisPreview?: string;
  onContinue: () => void;
}

const TYPE_CONFIG = {
  area_complete: {
    title: 'Research Area Mapped!',
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-emerald-600',
    ring: 'ring-emerald-400',
  },
  territory_complete: {
    title: 'Territory Complete!',
    icon: Star,
    gradient: 'from-[#fbbf24] to-[#f59e0b]',
    ring: 'ring-[#fbbf24]',
  },
  phase_complete: {
    title: 'Phase Complete!',
    icon: Sparkles,
    gradient: 'from-purple-500 to-purple-600',
    ring: 'ring-purple-400',
  },
};

const TERRITORY_LABELS: Record<string, string> = {
  company: 'Company Territory',
  customer: 'Customer Territory',
  competitor: 'Market Context',
};

export function CelebrationOverlay({
  type,
  territory,
  areaTitle,
  xpAwarded,
  microSynthesisPreview,
  onContinue,
}: CelebrationOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [xpCounter, setXpCounter] = useState(0);

  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // XP counter animation
  useEffect(() => {
    if (!visible) return;
    const duration = 800;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setXpCounter(Math.round(eased * xpAwarded));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, xpAwarded]);

  // Generate confetti particles (CSS-only, lightweight)
  const showConfetti = type === 'territory_complete' || type === 'phase_complete';
  const confettiParticles = useMemo(() => {
    if (!showConfetti) return [];
    const colors = ['#fbbf24', '#22d3ee', '#a78bfa', '#34d399', '#fb923c', '#f472b6'];
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.6}s`,
      duration: `${1.2 + Math.random() * 0.8}s`,
      size: Math.random() > 0.5 ? 6 : 4,
    }));
  }, [showConfetti]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onContinue, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        visible ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
      }`}
      onClick={handleDismiss}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden transition-all duration-500 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti particles */}
        {showConfetti && visible && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {confettiParticles.map((p) => (
              <span
                key={p.id}
                className="absolute rounded-full animate-confetti-fall"
                style={{
                  left: p.left,
                  top: '-8px',
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              />
            ))}
          </div>
        )}

        {/* Gradient header */}
        <div className={`relative bg-gradient-to-r ${config.gradient} px-6 py-6 text-center text-white`}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-3">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold">{config.title}</h2>
          {areaTitle && (
            <p className="text-sm text-white/80 mt-1 capitalize">{areaTitle.replace(/_/g, ' ')}</p>
          )}
          {territory && type === 'territory_complete' && (
            <p className="text-sm text-white/80 mt-1">{TERRITORY_LABELS[territory] || territory}</p>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* XP Award */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-[#fbbf24]/10 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-[#fbbf24]" />
              <span className="text-lg font-bold text-slate-900 font-[family-name:var(--font-code)]">
                +{xpCounter} XP
              </span>
            </div>
          </div>

          {/* Micro-synthesis preview */}
          {microSynthesisPreview && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Key Insight
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {microSynthesisPreview}
              </p>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={handleDismiss}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#fbbf24] text-sm font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
          >
            {type === 'area_complete' ? 'Next Area' : type === 'territory_complete' ? 'Next Territory' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
