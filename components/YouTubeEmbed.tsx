'use client';

import { useState, useCallback } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  className?: string;
  lite?: boolean;
}

// Validate YouTube video ID format
const isValidVideoId = (id: string): boolean => {
  // YouTube video IDs are 11 characters, alphanumeric with underscores and hyphens
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
};

export default function YouTubeEmbed({
  videoId,
  title = 'YouTube Video',
  autoplay = false,
  className = '',
  lite = true,
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(!lite || autoplay);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isValid = isValidVideoId(videoId);

  const handlePlay = useCallback(() => {
    if (!isValid) return;
    setIsLoading(true);
    setIsLoaded(true);
  }, [isValid]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Error state for invalid video ID
  if (!isValid) {
    return (
      <div
        className={`relative aspect-video w-full rounded-xl bg-muted flex flex-col items-center justify-center gap-3 ${className}`}
        role="alert"
        aria-label="Invalid YouTube video ID"
      >
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center px-4">
          <p className="text-sm font-medium text-muted-foreground">
            Invalid video ID
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Please check the video URL
          </p>
        </div>
      </div>
    );
  }

  // Error state for load failure
  if (hasError) {
    return (
      <div
        className={`relative aspect-video w-full rounded-xl bg-muted flex flex-col items-center justify-center gap-3 ${className}`}
        role="alert"
        aria-label="Failed to load video"
      >
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center px-4">
          <p className="text-sm font-medium text-muted-foreground">
            Failed to load video
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoaded(false);
            }}
            className="mt-3 px-4 py-2 text-xs font-medium bg-brand-primary text-brand-text rounded-lg hover:bg-brand-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Lite embed mode - show thumbnail with play button
  if (!isLoaded) {
    return (
      <div
        className={`relative aspect-video w-full rounded-xl overflow-hidden group cursor-pointer card-lift ${className}`}
        onClick={handlePlay}
        role="button"
        tabIndex={0}
        aria-label={`Play video: ${title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePlay();
          }
        }}
      >
        {/* Thumbnail */}
        <img
          src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback to standard quality if maxres is not available
            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-primary rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            <Play className="w-6 h-6 md:w-8 md:h-8 text-brand-text fill-brand-text ml-1" />
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white font-medium text-sm md:text-base line-clamp-2">
            {title}
          </p>
        </div>
      </div>
    );
  }

  // Full embed mode
  return (
    <div className={`relative aspect-video w-full rounded-xl overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
        </div>
      )}
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        loading="lazy"
      />
    </div>
  );
}
