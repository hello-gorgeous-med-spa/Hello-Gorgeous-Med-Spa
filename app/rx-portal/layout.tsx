import type { Metadata } from "next";

import { CartProvider } from "@/lib/regen/cart-context";
import { RegenCartDrawer } from "@/components/regen/RegenCartDrawer";

export const metadata: Metadata = {
  title: "Hello Gorgeous RX Provider Portal",
  description:
    "Provider / Staff / Admin portal for RE GEN orders, invoices, patients, and pharmacy fulfillment.",
  robots: { index: false, follow: false },
};

export default function RxPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <RegenCartDrawer />
    </CartProvider>
  );
}
