'use client';

import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">We’re sorry to see you go!</h1>
      <p className="mb-6 text-gray-700">Your ride has been successfully cancelled.</p>
      <button
        onClick={() => router.push('/customer-dashboard')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
