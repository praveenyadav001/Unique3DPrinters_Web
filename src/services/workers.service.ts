// ─── Workers Service ─────────────────────────────────────────
// Real-time worker list, status management, task queries

import {
  collection, doc, updateDoc, onSnapshot,
  query, where, serverTimestamp,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserDoc } from "@/types/firebase.types";

const usersRef = collection(db, "users");

function toMillis(value: Timestamp | Date | string | number | undefined): number {
  if (!value) return 0;
  const date = value instanceof Date ? value : typeof value === "object" && "toDate" in value ? value.toDate() : new Date(value);
  return date.getTime();
}

// ─── Subscribe to All Workers (Admin) ───────────────────────
export function subscribeToWorkers(
  callback: (workers: UserDoc[]) => void
): Unsubscribe {
  const q = query(usersRef, where("role", "==", "worker"));
  return onSnapshot(q, (snap) => {
    const workers = snap.docs.map((d) => ({ ...d.data(), uid: d.id } as UserDoc));
    workers.sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""));
    callback(workers);
  }, (error) => {
    console.error("Error fetching workers:", error);
    callback([]);
  });
}

// ─── Subscribe to All Customers (Admin) ─────────────────────
export function subscribeToCustomers(
  callback: (customers: UserDoc[]) => void
): Unsubscribe {
  const q = query(usersRef, where("role", "==", "customer"));
  return onSnapshot(q, (snap) => {
    const customers = snap.docs.map((d) => ({ ...d.data(), uid: d.id } as UserDoc));
    customers.sort((a, b) => {
      return toMillis(b.createdAt) - toMillis(a.createdAt);
    });
    callback(customers);
  }, (error) => {
    console.error("Error fetching customers:", error);
    callback([]);
  });
}

// ─── Subscribe to All Users (Admin) ─────────────────────────
export function subscribeToAllUsers(
  callback: (users: UserDoc[]) => void
): Unsubscribe {
  const q = query(usersRef);
  return onSnapshot(q, (snap) => {
    const users = snap.docs.map((d) => ({ ...d.data(), uid: d.id } as UserDoc));
    callback(users);
  }, (error) => {
    console.error("Error fetching all users:", error);
    callback([]);
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
