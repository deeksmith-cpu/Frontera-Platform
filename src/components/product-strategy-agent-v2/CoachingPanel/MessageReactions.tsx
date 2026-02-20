'use client';

import { useState } from 'react';
import { Heart, Bookmark } from 'lucide-react';

interface MessageReactionsProps {
  messageId: string;
  conversationId: string;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
}

export function MessageReactions({
  messageId,
  conversationId,
  initialLiked = false,
  initialBookmarked = false,
}: MessageReactionsProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  const updateMetadata = async (field: string, value: boolean) => {
    try {
      await fetch(`/api/conversations/${conversationId}/messages/${messageId}/react`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
    } catch {
      // Revert on failure
      if (field === 'liked') setLiked(!value);
      if (field === 'bookmarked') setBookmarked(!value);
    }
  };

  const toggleLike = () => {
    const newVal = !liked;
    setLiked(newVal);
    updateMetadata('liked', newVal);
  };

  const toggleBookmark = () => {
    const newVal = !bookmarked;
    setBookmarked(newVal);
    updateMetadata('bookmarked', newVal);
  };

  return (
    <div className="flex items-center gap-1 mt-1.5">
      <button
        onClick={toggleLike}
        className={`p-1 rounded-lg transition-all duration-300 ${
          liked
            ? 'text-rose-500 hover:text-rose-600'
            : 'text-slate-300 hover:text-slate-400 hover:bg-slate-50'
        }`}
        title={liked ? 'Unlike' : 'Like'}
      >
        <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
      </button>
      <button
        onClick={toggleBookmark}
        className={`p-1 rounded-lg transition-all duration-300 ${
          bookmarked
            ? 'text-[#fbbf24] hover:text-[#f59e0b]'
            : 'text-slate-300 hover:text-slate-400 hover:bg-slate-50'
        }`}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
      >
        <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
}
