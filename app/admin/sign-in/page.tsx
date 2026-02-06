import { AuthView } from '@neondatabase/auth/react';

export default function AdminSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-black text-center mb-4">Admin Login</h2>
        <AuthView path="sign-in" />
      </div>
    </div>
  );
}