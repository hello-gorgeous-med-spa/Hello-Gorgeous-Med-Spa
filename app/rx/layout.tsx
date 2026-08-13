import type { Metadata } from "next";

import { CartProvider } from "@/lib/regen/cart-context";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Clients cannot buy prescriptions outright — every product routes to intake and an
 * NP consult, so the cart drawer is not mounted here. The provider stays so shared
 * catalog components keep working; staff portals (`/rx-portal`, `/admin/rx/portal`)
 * still mount the drawer for in-clinic sales.
 */
export default function RxLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
