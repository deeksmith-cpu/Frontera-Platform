'use client';

import { ReviewSection } from '../CanvasPanel/ReviewSection';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface ReviewViewProps {
  conversation: Conversation;
}

export function ReviewView({ conversation }: ReviewViewProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="animate-entrance">
        <ReviewSection conversation={conversation} />
      </div>
    </div>
  );
}
