'use client';

import { FormEvent, useState } from 'react';

const waText = encodeURIComponent('Hi SHEESHA HOOKAH, I want to book a lounge slot. Please share available timings.');

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  function handleMailto(event: FormEvent) {
    event.preventDefault();
    const subject = encodeURIComponent('Lounge inquiry from website');
    const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nMessage: ${message}`);
    window.location.href = `mailto:sheeshahookahshop@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="lux-shell pb-16 pt-6 sm:pt-10 space-y-6">
      <section className="lux-card p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Contact</p>
        <h1 className="mt-2 text-3xl text-white">Visit or book your slot</h1>
        <p className="mt-2 text-sm text-white/70">Prefer instant response? Use WhatsApp booking.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="lux-card p-4 sm:p-5 space-y-4">
          <div>
            <h2 className="text-2xl text-white">Store Details</h2>
            <p className="text-sm text-white/70">SHEESHA HOOKAH, Jaipur</p>
            <p className="mt-1 text-sm text-white/70">Open daily: 11:00 AM - 10:00 PM</p>
          </div>

          <a
            href={`https://wa.me/917790813469?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#25D366] to-[#1bb8a0] px-5 text-sm font-semibold text-black"
          >
            Book lounge slot on WhatsApp
          </a>

          <form onSubmit={handleMailto} className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-sm font-semibold text-white">Email fallback</p>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="h-10 w-full rounded-xl border border-white/15 bg-black/25 px-3 text-sm text-white"
            />
            <input
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone"
              className="h-10 w-full rounded-xl border border-white/15 bg-black/25 px-3 text-sm text-white"
            />
            <textarea
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Message"
              className="min-h-24 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-sm text-white"
            />
            <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 px-4 text-sm text-white">
              Open Email Client
            </button>
          </form>
        </article>

        <article className="lux-card p-4 sm:p-5 space-y-4">
          <h2 className="text-2xl text-white">Location</h2>
          <iframe
            title="SHEESHA HOOKAH map"
            src="https://maps.google.com/maps?q=Sheesha%20Hookah%20Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="h-64 w-full rounded-2xl border border-white/10"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a href="https://share.google/YnWp1UfxyE2ImFTRb" target="_blank" rel="noopener noreferrer" className="text-sm text-[#f5d895]">
            Open in Google Maps
          </a>
        </article>
      </section>

      <section className="lux-card p-4 sm:p-5">
        <h2 className="text-2xl text-white">Quick FAQ</h2>
        <div className="mt-3 space-y-2 text-sm">
          <details className="rounded-xl border border-white/10 bg-black/20 p-3">
            <summary className="cursor-pointer text-white">Legal age requirement</summary>
            <p className="mt-2 text-white/70">18+ only. Valid ID may be requested in-store.</p>
          </details>
          <details className="rounded-xl border border-white/10 bg-black/20 p-3">
            <summary className="cursor-pointer text-white">Payment options</summary>
            <p className="mt-2 text-white/70">UPI payments are supported.</p>
          </details>
          <details className="rounded-xl border border-white/10 bg-black/20 p-3">
            <summary className="cursor-pointer text-white">Delivery radius</summary>
            <p className="mt-2 text-white/70">Same-day dispatch in Jaipur, extended shipping outside city.</p>
          </details>
        </div>
      </section>
    </div>
  );
}
