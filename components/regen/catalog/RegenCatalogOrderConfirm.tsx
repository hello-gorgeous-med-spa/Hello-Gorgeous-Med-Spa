"use client";

import Link from "next/link";

import { useCart } from "@/lib/regen/cart-context";

type Props = {
  orderNo: string;
  onClose: () => void;
};

export function RegenCatalogOrderConfirm({ orderNo, onClose }: Props) {
  const { clearCart } = useCart();

  const handleBack = () => {
    clearCart();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/50" onClick={onClose} aria-hidden />
      <div
        className="fixed left-1/2 top-1/2 z-[90] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
        role="dialog"
        aria-modal
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FF2D8E] text-2xl text-white">
          ✓
        </div>
        <h2 className="mt-5 font-serif text-2xl font-extrabold">You&apos;re all set!</h2>
        <p className="mt-2 text-sm text-black/60">Order reference {orderNo}</p>
        <p className="mt-4 text-sm leading-relaxed text-black/75">
          Complete your intake so Ryan Kent, FNP-BC can review your plan. Approved orders
          ship with flat $30 Illinois shipping.
        </p>
        <Link
          href="/rx/request"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full rounded-full bg-[#0a0a0a] py-3.5 text-sm font-bold text-white hover:bg-[#FF2D8E]"
        >
          Complete my intake →
        </Link>
        <button
          type="button"
          onClick={handleBack}
          className="mt-3 w-full py-2 text-sm font-semibold text-black/55 hover:text-[#E6007E]"
        >
          Back to shop
        </button>
      </div>
    </>
  );
}
