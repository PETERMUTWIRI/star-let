'use client';
import { createAuthClient } from '@neondatabase/auth/next';

const neonAuthUrl = process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL || 
  'https://ep-spring-boat-aisxzatm.neonauth.c-4.us-east-1.aws.neon.tech/neondb/auth';

export const authClient = createAuthClient(neonAuthUrl);
