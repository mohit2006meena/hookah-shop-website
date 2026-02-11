import { Suspense } from 'react';
import { AgeCheckClient } from '@/components/compliance/age-check-client';

export const dynamic = 'force-dynamic';

export default function AgeCheckPage() {
  return (
    <Suspense
      fallback={
        <div className="lux-shell flex min-h-[75vh] items-center justify-center py-10">
          <section className="lux-card w-full max-w-2xl p-5 sm:p-7">
            <p className="text-sm text-white/75">Loading age verification...</p>
          </section>
        </div>
      }
    >
      <AgeCheckClient />
    </Suspense>
  );
}
