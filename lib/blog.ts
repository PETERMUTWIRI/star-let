import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  content: string;
  mediaType?: 'video' | 'audio' | 'written';
  mediaUrl?: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);
  
  return filenames.map((filename) => {
    const slug = filename.replace('.md', '');
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title,
      date: data.date,
      author: data.author,
      mediaType: data.mediaType,
      mediaUrl: data.mediaUrl,
      content,
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function createPost(post: Omit<BlogPost, 'slug'>) {
  const slug = post.title.toLowerCase().replace(/ /g, '-');
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  const content = `---
title: "${post.title}"
date: "${post.date}"
author: "${post.author}"
mediaType: "${post.mediaType || 'written'}"
mediaUrl: "${post.mediaUrl || ''}"
---

${post.content}`;

  fs.writeFileSync(fullPath, content);
  return slug;
}