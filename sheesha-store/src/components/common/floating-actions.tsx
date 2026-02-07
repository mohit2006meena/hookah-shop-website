'use client';

import { useEffect, useState } from 'react';

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 360);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-40 flex flex-col gap-2 md:bottom-6">
      {showTop ? (
        <button
          type="button"
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ^
        </button>
      ) : null}

      <a
        href="https://wa.me/917790813469"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
        aria-label="Chat on WhatsApp"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M20.5 11.9A8.5 8.5 0 0 0 6.9 4.7a8.4 8.4 0 0 0-2.5 8.5L3 21l7.9-1.4A8.5 8.5 0 0 0 20.5 11.9Zm-8.4 6.8c-1.2 0-2.3-.3-3.4-.9l-.2-.1-3.2.6.6-3.1-.1-.2a6.8 6.8 0 1 1 6.3 3.7Zm3.7-5.1c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1-.1.2-.5.7-.6.8-.1.1-.2.2-.5.1-.2-.1-.9-.3-1.6-1-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3.1-.1.1-.2.1-.3l-.6-1.5c-.1-.2-.3-.2-.4-.2h-.3c-.1 0-.3.1-.5.3-.2.2-.7.7-.7 1.7s.7 2 1 2.3c.1.1 1.4 2.2 3.4 3 .5.2.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1-.1-.1-.2-.1-.4-.2Z" />
        </svg>
      </a>
    </div>
  );
}
