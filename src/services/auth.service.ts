// ─── Auth Service ────────────────────────────────────────────
// Handles Firebase Authentication + Firestore user profile creation

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword,
  getAuth,
  type User,
} from "firebase/auth";
import { initializeApp, deleteApp } from "firebase/app";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db, firebaseConfig } from "@/lib/firebase";
import type { UserDoc, UserRole } from "@/types/firebase.types";

const googleProvider = new GoogleAuthProvider();

// ─── Check if any admin exists (for first-user-is-admin logic) ──
async function isFirstUser(): Promise<boolean> {
  const q = query(collection(db, "users"), where("role", "==", "admin"));
  const snap = await getDocs(q);
  return snap.empty;
}

// ─── Create Firestore user document ─────────────────────────
async function createUserDoc(
  user: User,
  extra: { firstName: string; lastName: string; role?: UserRole }
): Promise<UserDoc> {
  const role = extra.role || (await isFirstUser() ? "admin" : "customer");

  const userDoc: UserDoc = {
    uid: user.uid,
    email: user.email || "",
    displayName: `${extra.firstName} ${extra.lastName}`,
    firstName: extra.firstName,
    lastName: extra.lastName,
    phone: "",
    address: "",
    city: "",
    pincode: "",
    photoURL: user.photoURL || null,
    role,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  };

  if (role === "worker") {
    userDoc.status = "Offline";
    userDoc.activeTasks = 0;
  }

  await setDoc(doc(db, "users", user.uid), userDoc);
  return userDoc;
}

// ─── Get user profile from Firestore ────────────────────────
export async function getUserProfile(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

// ─── Sign Up with Email & Password ──────────────────────────
export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ user: User; profile: UserDoc }> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const profile = await createUserDoc(cred.user, { firstName, lastName });
  return { user: cred.user, profile };
}

// ─── Sign In with Email & Password ──────────────────────────
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User; profile: UserDoc | null }> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(cred.user.uid);
  return { user: cred.user, profile };
}

// ─── Sign In with Google ────────────────────────────────────
export async function signInWithGoogle(): Promise<{
  user: User;
  profile: UserDoc;
  isNew: boolean;
}> {
  const cred = await signInWithPopup(auth, googleProvider);
  const existing = await getUserProfile(cred.user.uid);

  if (existing) {
    return { user: cred.user, profile: existing, isNew: false };
  }

  // First time Google sign-in — create profile
  const displayName = cred.user.displayName || "";
  const [firstName, ...rest] = displayName.split(" ");
  const lastName = rest.join(" ") || "";

  const profile = await createUserDoc(cred.user, { firstName, lastName });
  return { user: cred.user, profile, isNew: true };
}

// ─── Sign Out ───────────────────────────────────────────────
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// ─── Password Reset ─────────────────────────────────────────
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// ─── Change Password ────────────────────────────────────────
export async function changePassword(newPassword: string): Promise<void> {
  if (!auth.currentUser) throw new Error("Not authenticated");
  await updatePassword(auth.currentUser, newPassword);
}

// ─── Update Profile ─────────────────────────────────────────
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserDoc, "uid" | "email" | "role" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── Admin: Create Worker Account ───────────────────────────
export async function createWorkerAccount(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ user: User; profile: UserDoc }> {
  // Use a secondary app to prevent logging out the current admin user
  const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp_" + Date.now());
  const secondaryAuth = getAuth(secondaryApp);
  
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const profile = await createUserDoc(cred.user, {
      firstName,
      lastName,
      role: "worker",
    });
    return { user: cred.user, profile };
  } finally {
    await secondaryAuth.signOut();
    await deleteApp(secondaryApp);
  }
}
