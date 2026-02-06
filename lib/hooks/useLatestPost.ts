'use client';

import { useState, useEffect } from 'react';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover: string | null;
  category: string;
  author: string | null;
  publishedAt: string;
  createdAt: string;
}

interface UseLatestPostReturn {
  post: BlogPost | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch the latest published blog post
 * Used in navbar featured section and other dynamic content areas
 */
export function useLatestPost(): UseLatestPostReturn {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/blog?limit=1');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const posts: BlogPost[] = await response.json();
        
        if (posts && posts.length > 0) {
          setPost(posts[0]);
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Error fetching latest post:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPost();
  }, []);

  return { post, isLoading, error };
}

export default useLatestPost;
