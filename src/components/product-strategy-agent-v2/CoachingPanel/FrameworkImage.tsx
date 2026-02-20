'use client';

import Image from 'next/image';

const FRAMEWORK_MAP: Record<string, { src: string; caption: string }> = {
  'distinctive-capabilities': {
    src: '/frameworks/distinctive-capabilities.svg',
    caption: 'Distinctive Capabilities Framework',
  },
  'ptw-cascade': {
    src: '/frameworks/ptw-cascade.svg',
    caption: 'Playing to Win Strategic Cascade',
  },
  'playing-to-win': {
    src: '/frameworks/ptw-cascade.svg',
    caption: 'Playing to Win Strategic Cascade',
  },
  '3cs': {
    src: '/frameworks/3cs-framework.svg',
    caption: '3Cs Strategic Triangle',
  },
  '3cs-framework': {
    src: '/frameworks/3cs-framework.svg',
    caption: '3Cs Strategic Triangle',
  },
  jtbd: {
    src: '/frameworks/jtbd-framework.svg',
    caption: 'Jobs to be Done Framework',
  },
  'jobs-to-be-done': {
    src: '/frameworks/jtbd-framework.svg',
    caption: 'Jobs to be Done Framework',
  },
};

interface FrameworkImageProps {
  frameworkId: string;
}

export function FrameworkImage({ frameworkId }: FrameworkImageProps) {
  const framework = FRAMEWORK_MAP[frameworkId.toLowerCase()];
  if (!framework) return null;

  return (
    <div className="my-3 rounded-2xl overflow-hidden border border-cyan-200 bg-[#1a1f3a] shadow-sm">
      <Image
        src={framework.src}
        alt={framework.caption}
        width={400}
        height={260}
        className="w-full h-auto"
      />
      <div className="px-3 py-2 bg-slate-50 border-t border-cyan-200">
        <p className="text-xs text-slate-500 font-medium">{framework.caption}</p>
      </div>
    </div>
  );
}

/** Parse [Framework:id] markers from content. Returns clean content + framework IDs found. */
export function parseFrameworkMarkers(content: string): {
  cleanContent: string;
  frameworkIds: string[];
} {
  const pattern = /\[Framework:([\w-]+)\]/gi;
  const ids: string[] = [];
  let match;

  while ((match = pattern.exec(content)) !== null) {
    const id = match[1].toLowerCase();
    if (FRAMEWORK_MAP[id]) {
      ids.push(id);
    }
  }

  const cleanContent = content.replace(pattern, '').trim();
  return { cleanContent, frameworkIds: ids };
}
