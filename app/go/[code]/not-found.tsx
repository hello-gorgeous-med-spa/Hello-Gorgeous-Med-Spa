import Link from "next/link";

export default function PartnerDoorNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#E6007E]">Hello Gorgeous RE GEN</p>
      <h1 className="mt-3 text-2xl font-black">This referral code isn&apos;t active.</h1>
      <p className="mt-2 max-w-md text-black/70">
        Ask the front desk for a new card, or start as a Hello Gorgeous patient here.
      </p>
      <Link
        href="/rx/request"
        className="mt-6 rounded-full bg-[#E6007E] px-6 py-3 text-sm font-bold text-white"
      >
        Start a request
      </Link>
    </div>
  );
}
