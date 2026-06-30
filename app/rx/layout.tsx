import type { Metadata } from "next";

import { CartProvider } from "@/lib/regen/cart-context";
import { RegenCartDrawer } from "@/components/regen/RegenCartDrawer";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function RxLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <RegenCartDrawer />
    </CartProvider>
  );
}
