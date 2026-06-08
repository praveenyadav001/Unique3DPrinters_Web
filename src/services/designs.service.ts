// ─── Designs Service ─────────────────────────────────────────
// CRUD for design catalog + categories with real-time listeners

import {
  collection, doc, addDoc, updateDoc,
  onSnapshot, query, where, orderBy, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { DesignDoc, CategoryDoc } from "@/types/firebase.types";

const designsRef = collection(db, "designs");
const categoriesRef = collection(db, "categories");

// ─── Designs ─────────────────────────────────────────────────

export function subscribeToDesigns(
  callback: (designs: DesignDoc[]) => void
): Unsubscribe {
  const q = query(designsRef, where("isActive", "==", true), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const designs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DesignDoc));
    callback(designs);
  });
}

export function subscribeToDesignsByCategory(
  category: string,
  callback: (designs: DesignDoc[]) => void
): Unsubscribe {
  const q = query(
    designsRef,
    where("isActive", "==", true),
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const designs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DesignDoc));
    callback(designs);
  });
}

export async function createDesign(
  data: Omit<DesignDoc, "id" | "createdAt" | "updatedAt" | "salesCount">
): Promise<string> {
  const docRef = await addDoc(designsRef, {
    ...data,
    salesCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateDesign(
  designId: string,
  data: Partial<DesignDoc>
): Promise<void> {
  const ref = doc(db, "designs", designId);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDesign(designId: string): Promise<void> {
  // Soft delete: mark as inactive
  const ref = doc(db, "designs", designId);
  await updateDoc(ref, { isActive: false, updatedAt: serverTimestamp() });
}

// ─── Categories ──────────────────────────────────────────────

export function subscribeToCategories(
  callback: (categories: CategoryDoc[]) => void
): Unsubscribe {
  const q = query(categoriesRef, where("isActive", "==", true), orderBy("order", "asc"));
  return onSnapshot(q, (snap) => {
    const categories = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CategoryDoc));
    callback(categories);
  });
}

export async function createCategory(
  data: Omit<CategoryDoc, "id" | "designCount">
): Promise<string> {
  const docRef = await addDoc(categoriesRef, { ...data, designCount: 0 });
  return docRef.id;
}

export async function updateCategory(
  categoryId: string,
  data: Partial<CategoryDoc>
): Promise<void> {
  await updateDoc(doc(db, "categories", categoryId), data);
}
