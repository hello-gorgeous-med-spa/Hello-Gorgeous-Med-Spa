const SHOP_RX_TRUST_ITEMS = [
  "NP-supervised telehealth",
  "Ship to home",
  "Transparent pricing",
  "Licensed U.S. compounding partners",
] as const;

export function ShopRxTrustBar() {
  return (
    <div
      className="border-b border-white/10 bg-[#1c1c1c]"
      role="region"
      aria-label="Hello Gorgeous RX trust highlights"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5 md:gap-x-10 md:px-8">
        {SHOP_RX_TRUST_ITEMS.map((item) => (
          <span
            key={item}
            className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/75 md:text-[10px]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
