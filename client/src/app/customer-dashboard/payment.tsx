'use client';

import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Thank you for using our service!</h1>
      <p className="mb-6 text-gray-700">Your payment was successful and the ride is marked completed.</p>
      <button
        onClick={() => router.push('/customer-dashboard')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
