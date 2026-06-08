// ─── useOrders Hook ──────────────────────────────────────────
// Real-time orders filtered by user role

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import type { OrderDoc } from "@/types/firebase.types";
import {
  subscribeToCustomerOrders,
  subscribeToWorkerOrders,
  subscribeToAllOrders,
} from "@/services/orders.service";

export function useOrders() {
  const { user, role } = useAuth();
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !role) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let unsubscribe: (() => void) | undefined;

    if (role === "customer") {
      unsubscribe = subscribeToCustomerOrders(user.uid, (data) => {
        setOrders(data);
        setLoading(false);
      });
    } else if (role === "worker") {
      unsubscribe = subscribeToWorkerOrders(user.uid, (data) => {
        setOrders(data);
        setLoading(false);
      });
    } else if (role === "admin") {
      unsubscribe = subscribeToAllOrders((data) => {
        setOrders(data);
        setLoading(false);
      });
    }

    return () => unsubscribe?.();
  }, [user, role]);

  return { orders, loading };
}
