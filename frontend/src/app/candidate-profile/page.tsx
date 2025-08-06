'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CandidateProfileRoot() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home or show a message
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      Redirecting...
    </div>
  );
}
