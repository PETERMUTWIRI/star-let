import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendWelcomeEmail } from '@/lib/email/resend';

const prisma = new PrismaClient();

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 409 }
        );
      } else {
        // Resubscribe
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { subscribed: true, unsubscribedAt: null },
        });
        
        // Send welcome email
        try {
          await sendWelcomeEmail(email);
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
        }
        
        return NextResponse.json(
          { message: 'Successfully resubscribed!' },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        subscribed: true,
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletter - Unsubscribe from newsletter
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        subscribed: false,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Successfully unsubscribed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
