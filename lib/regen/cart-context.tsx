"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { parseCatalogLineId } from "@/lib/regen/catalog/pricing";

export type CartItem = {
  id: string;
  name: string;
  priceUsd: number;
  quantity: number;
  category: string;
  rx?: boolean;
  image?: string;
  /** Catalog line: variant strength label */
  variantLabel?: string;
  /** Catalog line: 30 or 90 day supply */
  supplyDays?: 30 | 90;
};

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  subscribe: boolean;
  refillWeeks: 4 | 8 | 12;
  toggleSubscribe: () => void;
  setRefillWeeks: (weeks: 4 | 8 | 12) => void;
  hasCatalogItems: boolean;
};

const SHIPPING_FLAT = 30;
const CART_STORAGE_KEY = "hgrx_cart";
const REFILL_STORAGE_KEY = "hgrx_refill";

const CartContext = createContext<CartContextType | null>(null);

type StoredCartItem = {
  id: string;
  name: string;
  priceUsd: number;
  quantity: number;
  category: string;
  rx?: boolean;
  image?: string;
  variantLabel?: string;
  supplyDays?: 30 | 90;
};

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadRefill(): { subscribe: boolean; weeks: 4 | 8 | 12 } {
  if (typeof window === "undefined") {
    return { subscribe: false, weeks: 4 };
  }
  try {
    const raw = localStorage.getItem(REFILL_STORAGE_KEY);
    if (!raw) return { subscribe: false, weeks: 4 };
    const parsed = JSON.parse(raw) as { subscribe?: boolean; weeks?: number };
    const weeks = parsed.weeks === 8 || parsed.weeks === 12 ? parsed.weeks : 4;
    return { subscribe: !!parsed.subscribe, weeks };
  } catch {
    return { subscribe: false, weeks: 4 };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [refillWeeks, setRefillWeeksState] = useState<4 | 8 | 12>(4);

  useEffect(() => {
    setItems(loadCart());
    const refill = loadRefill();
    setSubscribe(refill.subscribe);
    setRefillWeeksState(refill.weeks);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota */
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        REFILL_STORAGE_KEY,
        JSON.stringify({ subscribe, weeks: refillWeeks }),
      );
    } catch {
      /* ignore */
    }
  }, [subscribe, refillWeeks, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleSubscribe = useCallback(() => {
    setSubscribe((prev) => !prev);
  }, []);

  const setRefillWeeks = useCallback((weeks: 4 | 8 | 12) => {
    setRefillWeeksState(weeks);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.priceUsd * i.quantity, 0);
  const shipping = items.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  const hasCatalogItems = useMemo(
    () => items.some((i) => parseCatalogLineId(i.id) !== null),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shipping,
        total,
        subscribe,
        refillWeeks,
        toggleSubscribe,
        setRefillWeeks,
        hasCatalogItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
