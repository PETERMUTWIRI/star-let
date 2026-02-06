import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create post content with front matter
    const postContent = `---
title: ${data.title}
author: ${data.author || 'Admin'}
date: ${data.date}
mediaType: ${data.mediaType || 'written'}
${data.mediaUrl ? `mediaUrl: ${data.mediaUrl}` : ''}
---

${data.content}
`;

    // Generate filename from title
    const filename = `${data.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.md`;
    const filepath = path.join(process.cwd(), 'content', 'posts', filename);

    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filepath, postContent);

    return NextResponse.json({ 
      success: true, 
      message: 'Post created successfully',
      filename 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST method required' });
}