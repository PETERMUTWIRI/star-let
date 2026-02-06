import { AuthView } from '@neondatabase/auth/react';
import Link from 'next/link';

export default function AdminSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-black text-center mb-4">Create Admin Account</h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Sign up to manage blog posts and events
        </p>
        
        <AuthView path="sign-up" />
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/admin/sign-in" className="text-brand-primary font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
