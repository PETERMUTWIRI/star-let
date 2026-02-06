import Link from 'next/link';

export const metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from Nihri\'s hope newsletter',
};

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Unsubscribe</h1>
          <p className="text-gray-600">
            We&apos;re sorry to see you go. Enter your email to unsubscribe from our newsletter.
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              required
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This feature requires email service integration (Resend, SendGrid, etc.). 
              Please connect an email service provider to enable unsubscribe functionality.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02]"
          >
            Unsubscribe
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-cyan-600 hover:text-cyan-800 font-medium text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
