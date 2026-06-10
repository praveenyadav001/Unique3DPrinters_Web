// ─── useWorkers Hook ─────────────────────────────────────────
// Real-time worker and customer lists for admin

import { useState, useEffect } from "react";
import type { UserDoc } from "@/types/firebase.types";
import { subscribeToWorkers, subscribeToCustomers, subscribeToAllUsers } from "@/services/workers.service";

export function useWorkers() {
  const [workers, setWorkers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToWorkers((data) => {
      setWorkers(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { workers, loading };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToCustomers((data) => {
      setCustomers(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { customers, loading };
}

export function useAllUsers() {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAllUsers((data) => {
      setUsers(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { users, loading };
}
