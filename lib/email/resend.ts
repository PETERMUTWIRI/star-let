/**
 * Resend Email Integration
 * 
 * Resend is the RECOMMENDED email service for Nihri's hope
 * 
 * FREE TIER:
 * - 3,000 emails/month
 * - 1,000 contacts
 * - 1-day data retention
 * - Ticket support
 * 
 * SETUP INSTRUCTIONS:
 * 1. Sign up at https://resend.com
 * 2. Get your API key from the dashboard
 * 3. Add to .env.local: RESEND_API_KEY=re_xxxxxxxx
 * 4. Run: npm install resend
 * 5. Uncomment the code below
 */

/*
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nihri\'s hope <newsletter@nihrihope.com>',
      to: [to],
      subject: 'Welcome to Nihri\'s hope Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #06b6d4;">Welcome to Nihri's hope!</h1>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>You'll receive updates about:</p>
          <ul>
            <li>Upcoming events</li>
            <li>Success stories</li>
            <li>Volunteer opportunities</li>
            <li>News and announcements</li>
          </ul>
          <p>Stay connected!</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            <a href="https://nihrihope.com/unsubscribe?email=${encodeURIComponent(to)}">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

export async function sendNewsletterEmail(to: string[], subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nihri\'s hope <newsletter@nihrihope.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send newsletter:', error);
    throw error;
  }
}
*/

// Generic email sender placeholder
export async function sendEmail({ to, subject, template, data }: { 
  to: string; 
  subject: string; 
  template: string; 
  data: any; 
}) {
  console.log('Email would be sent to:', to);
  console.log('Subject:', subject);
  console.log('Template:', template);
  console.log('Data:', data);
  console.log('Please configure Resend to enable email sending');
}

// Placeholder functions until Resend is configured
export async function sendWelcomeEmail(to: string) {
  console.log('Welcome email would be sent to:', to);
  console.log('Please configure Resend to enable email sending');
}

export async function sendNewsletterEmail(to: string[], subject: string, html: string) {
  console.log('Newsletter would be sent to:', to.length, 'subscribers');
  console.log('Subject:', subject);
  console.log('Please configure Resend to enable email sending');
}
