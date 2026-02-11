'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function AgeCheckClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const nextPath = useMemo(() => params.get('next') || '/', [params]);

  async function confirmAge(eligible: boolean) {
    setLoading(true);
    try {
      await fetch('/api/age/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eligible })
      });

      if (eligible) {
        router.replace(nextPath);
      } else {
        setBlocked(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lux-shell flex min-h-[75vh] items-center justify-center py-10">
      <section className="lux-card w-full max-w-2xl p-5 sm:p-7">
        <p className="text-xs uppercase tracking-[0.16em] text-[#1bb8a0]">Age Verification</p>
        <h1 className="mt-2 text-3xl text-white sm:text-4xl">18+ Entry Required</h1>
        <p className="mt-3 text-sm text-white/75">
          This website sells tobacco-related products. You must be 18 years or older to browse or place orders.
        </p>
        <p className="mt-2 rounded-2xl border border-[#c9a24f]/35 bg-[#c9a24f]/10 p-3 text-sm text-[#f5d895]">
          Tobacco consumption is injurious to health. Please use responsibly and follow local regulations.
        </p>

        {blocked ? (
          <div className="mt-5 rounded-2xl border border-[#f2a6a6]/40 bg-[#f2a6a6]/10 p-4 text-sm text-[#ffd7d7]">
            Access denied. This store is restricted to adults only.
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => confirmAge(true)}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] text-sm font-semibold text-black disabled:opacity-60"
            >
              I am 18+ | Enter Site
            </button>
            <button
              type="button"
              onClick={() => confirmAge(false)}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-medium text-white disabled:opacity-60"
            >
              I am under 18
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
