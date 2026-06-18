// ─── useCart Hook ────────────────────────────────────────────
// Real-time cart for the current user

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import type { CartItemDoc } from "@/types/firebase.types";
import {
  subscribeToCart,
  addToCart as addToCartService,
  removeFromCart as removeService,
  updateCartItemQuantity as updateQtyService,
  clearCart as clearCartService,
} from "@/services/cart.service";

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeToCart(user.uid, (items) => {
      setCartItems(items);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const addItem = useCallback(
    async (item: Omit<CartItemDoc, "id" | "addedAt">) => {
      if (!user) throw new Error("You must be logged in to add items to cart.");
      await addToCartService(user.uid, item);
    },
    [user]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!user) return;
      await removeService(user.uid, itemId);
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!user) return;
      await updateQtyService(user.uid, itemId, quantity);
    },
    [user]
  );

  const clearAll = useCallback(async () => {
    if (!user) return;
    await clearCartService(user.uid);
  }, [user]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearAll,
  };
}
