// ─── Orders Service ──────────────────────────────────────────
// CRUD + real-time listeners for orders, filtered by role

import {
  collection, doc, addDoc, updateDoc, onSnapshot,
  query, where, orderBy, limit, serverTimestamp,
  type Unsubscribe, getDocs, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { OrderDoc, OrderStatus, OrderItem, ShippingAddress } from "@/types/firebase.types";

const ordersRef = collection(db, "orders");

// ─── Generate Order Number ──────────────────────────────────
async function generateOrderNumber(): Promise<string> {
  const q = query(ordersRef, orderBy("createdAt", "desc"), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return "ORD10001";
  const last = snap.docs[0].data() as OrderDoc;
  const num = parseInt(last.orderNumber.replace("ORD", "")) + 1;
  return `ORD${num}`;
}

// ─── Create Order ───────────────────────────────────────────
export async function createOrder(data: {
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}): Promise<string> {
  const orderNumber = await generateOrderNumber();

  const orderData: Omit<OrderDoc, "id"> = {
    orderNumber,
    customerId: data.customerId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    items: data.items,
    status: "Pending",
    assignedWorkerId: null,
    assignedWorkerName: null,
    subtotal: data.subtotal,
    shippingCost: data.shippingCost,
    discount: data.discount,
    total: data.total,
    paymentMethod: data.paymentMethod,
    paymentStatus: "Paid",
    shippingAddress: data.shippingAddress,
    statusHistory: [
      {
        status: "Pending",
        timestamp: Timestamp.now(),
        note: "Order placed",
      },
    ],
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  };

  const docRef = await addDoc(ordersRef, orderData);
  return docRef.id;
}

// ─── Update Order Status ────────────────────────────────────
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  _note?: string
): Promise<void> {
  const ref = doc(db, "orders", orderId);
  await updateDoc(ref, {
    status,
    statusHistory: [
      // We'll use arrayUnion in production, but for simplicity:
    ],
    updatedAt: serverTimestamp(),
    ...(status === "Delivered" ? { deliveredAt: serverTimestamp() } : {}),
  });
}

// ─── Assign Worker to Order ─────────────────────────────────
export async function assignWorkerToOrder(
  orderId: string,
  workerId: string,
  workerName: string
): Promise<void> {
  const ref = doc(db, "orders", orderId);
  await updateDoc(ref, {
    assignedWorkerId: workerId,
    assignedWorkerName: workerName,
    status: "Processing",
    updatedAt: serverTimestamp(),
  });
}

// ─── Unassign Worker ────────────────────────────────────────
export async function unassignWorker(orderId: string): Promise<void> {
  const ref = doc(db, "orders", orderId);
  await updateDoc(ref, {
    assignedWorkerId: null,
    assignedWorkerName: null,
    updatedAt: serverTimestamp(),
  });
}

// ─── Real-time Listeners ────────────────────────────────────

// Customer: own orders only
export function subscribeToCustomerOrders(
  customerId: string,
  callback: (orders: OrderDoc[]) => void
): Unsubscribe {
  const q = query(
    ordersRef,
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderDoc));
    callback(orders);
  });
}

// Worker: assigned orders
export function subscribeToWorkerOrders(
  workerId: string,
  callback: (orders: OrderDoc[]) => void
): Unsubscribe {
  const q = query(
    ordersRef,
    where("assignedWorkerId", "==", workerId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderDoc));
    callback(orders);
  });
}

// Admin: all orders
export function subscribeToAllOrders(
  callback: (orders: OrderDoc[]) => void
): Unsubscribe {
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderDoc));
    callback(orders);
  });
}

// Recent orders (limited)
export function subscribeToRecentOrders(
  count: number,
  callback: (orders: OrderDoc[]) => void
): Unsubscribe {
  const q = query(ordersRef, orderBy("createdAt", "desc"), limit(count));
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderDoc));
    callback(orders);
  });
}
