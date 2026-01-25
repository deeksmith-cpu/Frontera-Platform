'use client';

import { useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { CoachingPanel } from './CoachingPanel/CoachingPanel';
import { useMediaQuery } from '@/hooks/useCoachPopup';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface CoachingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  conversation: Conversation | null;
  userId: string;
  orgId: string;
  constraints: {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
  };
}

export function CoachingPopup({
  isOpen,
  onClose,
  position,
  size,
  onPositionChange,
  onSizeChange,
  conversation,
  userId,
  orgId,
  constraints,
}: CoachingPopupProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Handle Escape key to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  // Mobile: Bottom sheet
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Bottom sheet */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
          role="dialog"
          aria-modal="true"
          aria-label="Strategy Coach"
        >
          {/* Drag indicator */}
          <div className="flex-shrink-0 flex justify-center py-3">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors z-10"
            aria-label="Close coach panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <CoachingPanel
              conversation={conversation ?? undefined}
              userId={userId}
              orgId={orgId}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Draggable/resizable popup
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Rnd
        position={{ x: position.x, y: position.y }}
        size={{ width: size.width, height: size.height }}
        onDragStop={(_e, d) => onPositionChange(d.x, d.y)}
        onResizeStop={(_e, _dir, ref, _delta, pos) => {
          onSizeChange(parseInt(ref.style.width), parseInt(ref.style.height));
          onPositionChange(pos.x, pos.y);
        }}
        minWidth={constraints.minWidth}
        minHeight={constraints.minHeight}
        maxWidth={constraints.maxWidth}
        maxHeight={constraints.maxHeight}
        bounds="window"
        dragHandleClassName="popup-drag-handle"
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        resizeHandleStyles={{
          top: { cursor: 'ns-resize' },
          right: { cursor: 'ew-resize' },
          bottom: { cursor: 'ns-resize' },
          left: { cursor: 'ew-resize' },
          topRight: { cursor: 'nesw-resize' },
          bottomRight: { cursor: 'nwse-resize' },
          bottomLeft: { cursor: 'nesw-resize' },
          topLeft: { cursor: 'nwse-resize' },
        }}
        resizeHandleClasses={{
          top: 'resize-handle resize-handle-top',
          right: 'resize-handle resize-handle-right',
          bottom: 'resize-handle resize-handle-bottom',
          left: 'resize-handle resize-handle-left',
          topRight: 'resize-handle resize-handle-corner',
          bottomRight: 'resize-handle resize-handle-corner',
          bottomLeft: 'resize-handle resize-handle-corner',
          topLeft: 'resize-handle resize-handle-corner',
        }}
        className="pointer-events-auto"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 h-full overflow-hidden flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Strategy Coach"
        >
          <CoachingPanel
            conversation={conversation ?? undefined}
            userId={userId}
            orgId={orgId}
            onClose={onClose}
          />
        </div>
      </Rnd>
    </div>
  );
}
