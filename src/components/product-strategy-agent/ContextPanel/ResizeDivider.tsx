'use client';

import { useCallback, useRef } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizeDividerProps {
  onResize: (coachWidthPct: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ResizeDivider({ onResize, containerRef }: ResizeDividerProps) {
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = moveEvent.clientX - rect.left;
        const pct = Math.round((x / rect.width) * 100);
        onResize(pct);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onResize, containerRef]
  );

  return (
    <div
      onMouseDown={handleMouseDown}
      className="flex-shrink-0 w-1.5 cursor-col-resize group relative z-10 hidden md:flex items-center justify-center"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panels"
    >
      {/* Visual indicator */}
      <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-[#fbbf24]/10 transition-colors duration-200" />
      <div className="w-0.5 h-8 rounded-full bg-slate-200 group-hover:bg-[#fbbf24] group-hover:h-12 transition-all duration-200" />
      <GripVertical className="absolute w-3 h-3 text-slate-300 group-hover:text-[#fbbf24] opacity-0 group-hover:opacity-100 transition-all duration-200" />
    </div>
  );
}
