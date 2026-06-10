import { collection, doc, onSnapshot, query, setDoc, updateDoc, deleteDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MaintenanceLogDoc } from "@/types/firebase.types";

export function subscribeToMaintenanceLogs(callback: (data: MaintenanceLogDoc[]) => void) {
  const q = query(collection(db, "maintenance_logs"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const logs = snap.docs.map(d => ({ id: d.id, ...d.data() } as MaintenanceLogDoc));
    callback(logs);
  });
}

export async function createMaintenanceLog(data: Omit<MaintenanceLogDoc, "id" | "createdAt" | "updatedAt">) {
  const ref = doc(collection(db, "maintenance_logs"));
  await setDoc(ref, {
    ...data,
    id: ref.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMaintenanceLog(id: string, data: Partial<MaintenanceLogDoc>) {
  const ref = doc(db, "maintenance_logs", id);
  const updates: any = { ...data, updatedAt: serverTimestamp() };
  if (data.status === "Completed") {
    updates.resolvedAt = serverTimestamp();
  }
  await updateDoc(ref, updates);
}

export async function deleteMaintenanceLog(id: string) {
  await deleteDoc(doc(db, "maintenance_logs", id));
}
