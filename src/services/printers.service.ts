import { collection, doc, onSnapshot, query, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PrinterDoc } from "@/types/firebase.types";

export function subscribeToPrinters(callback: (data: PrinterDoc[]) => void) {
  const q = query(collection(db, "printers"));
  return onSnapshot(q, (snap) => {
    const printers = snap.docs.map(d => ({ id: d.id, ...d.data() } as PrinterDoc));
    callback(printers);
  }, (error) => {
    console.error("Error fetching printers:", error);
    callback([]);
  });
}

export async function createPrinter(data: Omit<PrinterDoc, "id" | "createdAt" | "updatedAt">) {
  const ref = doc(collection(db, "printers"));
  await setDoc(ref, {
    ...data,
    id: ref.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePrinter(id: string, data: Partial<PrinterDoc>) {
  const ref = doc(db, "printers", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePrinter(id: string) {
  await deleteDoc(doc(db, "printers", id));
}
