// app/api/registrations/all/route.ts - Get all registrations without auth check for debugging
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/registrations/all - Fetching all registrations');
    
    const registrations = await prisma.registration.findMany({
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startDate: true,
            location: true,
            venue: true,
            cover: true,
            isFree: true,
            ticketPrice: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`Found ${registrations.length} registrations`);
    
    return NextResponse.json(registrations);
  } catch (error) {
    console.error('GET /api/registrations/all error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
