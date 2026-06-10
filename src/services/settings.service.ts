import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SystemSettingsDoc, WebsiteSettingsDoc } from "@/types/firebase.types";

export function subscribeToSystemSettings(callback: (data: SystemSettingsDoc | null) => void) {
  return onSnapshot(doc(db, "settings", "system"), (snap) => {
    callback(snap.exists() ? (snap.data() as SystemSettingsDoc) : null);
  }, (error) => {
    console.error("Error fetching system settings:", error);
    callback(null);
  });
}

export function subscribeToWebsiteSettings(callback: (data: WebsiteSettingsDoc | null) => void) {
  return onSnapshot(doc(db, "settings", "website"), (snap) => {
    callback(snap.exists() ? (snap.data() as WebsiteSettingsDoc) : null);
  }, (error) => {
    console.error("Error fetching website settings:", error);
    callback(null);
  });
}

export async function updateSystemSettings(data: Partial<SystemSettingsDoc>) {
  const ref = doc(db, "settings", "system");
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function updateWebsiteSettings(data: Partial<WebsiteSettingsDoc>) {
  const ref = doc(db, "settings", "website");
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
