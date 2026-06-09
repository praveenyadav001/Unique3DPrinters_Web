// ─── Orders Service ──────────────────────────────────────────
// CRUD + real-time listeners for orders, filtered by role

import {
  collection, doc, addDoc, updateDoc, onSnapshot, getDoc,
  query, where, orderBy, limit, serverTimestamp,
  type Unsubscribe, getDocs, Timestamp, arrayUnion, runTransaction
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { OrderDoc, OrderStatus, OrderItem, ShippingAddress } from "@/types/firebase.types";

const ordersRef = collection(db, "orders");

// ─── Generate Order Number ──────────────────────────────────
async function generateOrderNumber(): Promise<string> {
  const counterRef = doc(db, "counters", "orders");
  let nextNum = 10001;
  await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    if (!counterDoc.exists()) {
      transaction.set(counterRef, { lastNumber: 10001 });
      nextNum = 10001;
    } else {
      nextNum = counterDoc.data().lastNumber + 1;
      transaction.update(counterRef, { lastNumber: nextNum });
    }
  });
  return `ORD${nextNum}`;
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
    statusHistory: arrayUnion({
      status,
      timestamp: Timestamp.now(),
      note: _note || `Status changed to ${status}`,
    }),
    updatedAt: serverTimestamp(),
    ...(status === "Delivered" ? { deliveredAt: serverTimestamp() } : {}),
  });

  // Trigger email via Vercel Serverless Function if Shipped or Delivered
  if (status === "Shipped" || status === "Delivered") {
    try {
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const orderData = docSnap.data();
        if (orderData.customerEmail) {
          await fetch("/api/sendEmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              orderId: orderData.orderNumber || orderId,
              status: status,
              customerEmail: orderData.customerEmail,
              customerName: orderData.customerName,
            })
          });
        }
      }
    } catch (e) {
      console.error("Failed to trigger email API", e);
    }
  }
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

// ─── Get Order by Number ──────────────────────────────────────
export async function getOrderByNumber(orderNumber: string): Promise<OrderDoc | null> {
  const cleanNumber = orderNumber.replace("-", "").toUpperCase();
  const q = query(ordersRef, where("orderNumber", "==", cleanNumber), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as OrderDoc;
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
