// ─── Auth Context ────────────────────────────────────────────
// Provides authentication state throughout the app.
// Listens to Firebase Auth changes and fetches Firestore profile.

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserDoc, UserRole } from "@/types/firebase.types";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle as googleSignIn,
  signOut as doSignOut,
  resetPassword as doResetPassword,
} from "@/services/auth.service";

interface AuthContextValue {
  // State
  user: User | null;
  userProfile: UserDoc | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to Auth state changes
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  // When user is set, listen to their Firestore profile
  useEffect(() => {
    if (!user) return;

    const unsubProfile = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        if (snap.exists()) {
          setUserProfile(snap.data() as UserDoc);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      },
      () => {
        // Error reading profile
        setLoading(false);
      }
    );
    return () => unsubProfile();
  }, [user]);

  // ─── Actions ──────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // onAuthStateChanged will handle the rest
    } catch (err: any) {
      setLoading(false);
      const code = err?.code || "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.");
      } else {
        setError(err?.message || "Login failed");
      }
    }
  }, []);

  const signup = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      setError(null);
      setLoading(true);
      try {
        await signUpWithEmail(email, password, firstName, lastName);
      } catch (err: any) {
        setLoading(false);
        const code = err?.code || "";
        if (code === "auth/email-already-in-use") {
          setError("Email is already registered");
        } else if (code === "auth/weak-password") {
          setError("Password must be at least 6 characters");
        } else {
          setError(err?.message || "Signup failed");
        }
      }
    },
    []
  );

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await googleSignIn();
    } catch (err: any) {
      setLoading(false);
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "Google sign-in failed");
      }
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await doSignOut();
      setUserProfile(null);
    } catch (err: any) {
      setError(err?.message || "Logout failed");
    }
  }, []);

  const resetPasswordFn = useCallback(async (email: string) => {
    setError(null);
    try {
      await doResetPassword(email);
    } catch (err: any) {
      setError(err?.message || "Password reset failed");
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: AuthContextValue = {
    user,
    userProfile,
    role: userProfile?.role || null,
    loading,
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword: resetPasswordFn,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
