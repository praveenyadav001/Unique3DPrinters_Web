// ─── Cart Service ────────────────────────────────────────────
// Per-user cart stored as subcollection: cart/{userId}/items

import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp, getDocs, writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CartItemDoc } from "@/types/firebase.types";

function cartItemsRef(userId: string) {
  return collection(db, "cart", userId, "items");
}

// ─── Subscribe to Cart (Real-time) ──────────────────────────
export function subscribeToCart(
  userId: string,
  callback: (items: CartItemDoc[]) => void
): Unsubscribe {
  return onSnapshot(cartItemsRef(userId), (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CartItemDoc));
    callback(items);
  });
}

// ─── Add Item to Cart ───────────────────────────────────────
export async function addToCart(
  userId: string,
  item: Omit<CartItemDoc, "id" | "addedAt">
): Promise<string> {
  const docRef = await addDoc(cartItemsRef(userId), {
    ...item,
    addedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Update Cart Item Quantity ──────────────────────────────
export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
): Promise<void> {
  const ref = doc(db, "cart", userId, "items", itemId);
  await updateDoc(ref, { quantity });
}

// ─── Remove Item from Cart ──────────────────────────────────
export async function removeFromCart(
  userId: string,
  itemId: string
): Promise<void> {
  const ref = doc(db, "cart", userId, "items", itemId);
  await deleteDoc(ref);
}

// ─── Clear Entire Cart ──────────────────────────────────────
export async function clearCart(userId: string): Promise<void> {
  const snap = await getDocs(cartItemsRef(userId));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}
