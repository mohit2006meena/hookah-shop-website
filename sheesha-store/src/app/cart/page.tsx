import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="lux-shell pb-16 pt-6 sm:pt-10">
      <section className="lux-card p-6 text-center">
        <h1 className="text-3xl text-white">Cart</h1>
        <p className="mt-2 text-sm text-white/70">Use the cart drawer from top-right or bottom bar to edit quantities instantly.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link href="/shop" className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-white">
            Continue Shopping
          </Link>
          <Link href="/checkout" className="inline-flex rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] px-4 py-2 text-sm font-semibold text-black">
            Go to Checkout
          </Link>
        </div>
      </section>
    </div>
  );
}
