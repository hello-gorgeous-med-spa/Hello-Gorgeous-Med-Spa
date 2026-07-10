import { CartProvider } from "@/lib/regen/cart-context";
import { RegenCartDrawer } from "@/components/regen/RegenCartDrawer";

export default function AdminRegenPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
      <RegenCartDrawer />
    </CartProvider>
  );
}
