// lib/auth/server.ts   (rename file if you want, or keep old name)
import { neonAuth } from '@neondatabase/auth/next/server';
import { NextRequest, NextResponse } from 'next/server';

export async function verifyAdminAuth(req: NextRequest) {
  const { session, user } = await neonAuth();
  if (!session || !user) return { authorized: false };
  // optional: later check user.role === 'admin'
  return { authorized: true, user };
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}