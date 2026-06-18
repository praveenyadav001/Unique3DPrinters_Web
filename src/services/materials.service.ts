import { collection, doc, onSnapshot, query, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MaterialDoc } from "@/types/firebase.types";

export function subscribeToMaterials(callback: (data: MaterialDoc[]) => void) {
  const q = query(collection(db, "materials"));
  return onSnapshot(q, (snap) => {
    const materials = snap.docs.map(d => ({ id: d.id, ...d.data() } as MaterialDoc));
    callback(materials);
  }, (error) => {
    console.error("Error fetching materials:", error);
    callback([]);
  });
}

export async function createMaterial(data: Omit<MaterialDoc, "id">) {
  const ref = doc(collection(db, "materials"));
  await setDoc(ref, {
    ...data,
    id: ref.id,
  });
  return ref.id;
}

export async function updateMaterial(id: string, data: Partial<MaterialDoc>) {
  const ref = doc(db, "materials", id);
  await updateDoc(ref, data);
}

export async function deleteMaterial(id: string) {
  await deleteDoc(doc(db, "materials", id));
}
