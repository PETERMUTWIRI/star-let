// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminAuth } from '@/lib/auth/middleware';

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paths } = await req.json();
    
    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: 'Paths array required' }, { status: 400 });
    }

    const results = [];
    for (const path of paths) {
      try {
        revalidatePath(path);
        results.push({ path, status: 'success' });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({ path, status: 'error', error: errorMessage });
      }
    }

    return NextResponse.json({ revalidated: results });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}