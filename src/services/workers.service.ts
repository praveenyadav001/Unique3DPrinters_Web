// ─── Workers Service ─────────────────────────────────────────
// Real-time worker list, status management, task queries

import {
  collection, doc, updateDoc, onSnapshot,
  query, where, orderBy, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserDoc } from "@/types/firebase.types";

const usersRef = collection(db, "users");

// ─── Subscribe to All Workers (Admin) ───────────────────────
export function subscribeToWorkers(
  callback: (workers: UserDoc[]) => void
): Unsubscribe {
  const q = query(usersRef, where("role", "==", "worker"), orderBy("displayName"));
  return onSnapshot(q, (snap) => {
    const workers = snap.docs.map((d) => ({ ...d.data(), uid: d.id } as UserDoc));
    callback(workers);
  });
}

// ─── Subscribe to All Customers (Admin) ─────────────────────
export function subscribeToCustomers(
  callback: (customers: UserDoc[]) => void
): Unsubscribe {
  const q = query(usersRef, where("role", "==", "customer"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const customers = snap.docs.map((d) => ({ ...d.data(), uid: d.id } as UserDoc));
    callback(customers);
  });
}

// ─── Update Worker Status ───────────────────────────────────
export async function updateWorkerStatus(
  workerId: string,
  status: "Online" | "Busy" | "Offline"
): Promise<void> {
  const ref = doc(db, "users", workerId);
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
}

// ─── Update Worker Active Tasks Count ───────────────────────
export async function updateWorkerTaskCount(
  workerId: string,
  count: number
): Promise<void> {
  const ref = doc(db, "users", workerId);
  await updateDoc(ref, { activeTasks: count, updatedAt: serverTimestamp() });
}
