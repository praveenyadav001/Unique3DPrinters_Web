import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SignupPageProps {
  onGoToLogin: () => void;
  onGoToLanding: () => void;
}

export default function SignupPage({ onGoToLogin, onGoToLanding }: SignupPageProps) {
  const { signup, loginWithGoogle, error, loading, clearError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setLocalError("Please enter your full name");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    await signup(email, password, firstName.trim(), lastName.trim());
  };

  const displayError = localError || error;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#161616 1px, transparent 1px), linear-gradient(90deg, #161616 1px, transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.3, pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 70% 30%, rgba(var(--accent-rgb), 0.06) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(var(--accent-rgb), 0.04) 0%, transparent 40%)",
        pointerEvents: "none"
      }} />

      {/* Back to Home */}
      <button
        onClick={onGoToLanding}
        style={{
          position: "absolute", top: 24, left: 24, zIndex: 10,
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "1px solid #222", borderRadius: 8,
          padding: "8px 14px", color: "#888", cursor: "pointer",
          fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
        }}
      >
        <ArrowLeft size={14} /> Back to Home
      </button>

      {/* Signup Card */}
      <div style={{
        background: "#111", border: "1px solid #1a1a1a", borderRadius: 20,
        padding: "40px 40px", width: "100%", maxWidth: 420,
        position: "relative", zIndex: 2,
        boxShadow: "0 0 80px rgba(var(--accent-rgb), 0.04)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "0.05em", marginBottom: 8 }}>
            <span style={{ color: "var(--accent)" }}>UNIQUE</span>
            <span style={{ color: "#fff" }}>3D</span>
            <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
          </div>
          <h2 style={{
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 800,
            fontSize: "1.6rem", color: "#fff", margin: "0 0 4px",
          }}>
            Create Account
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
            color: "#555", margin: 0,
          }}>
            Join us and start 3D printing today
          </p>
        </div>

        {/* Error */}
        {displayError && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", marginBottom: 16,
            background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 8,
          }}>
            <AlertCircle size={14} style={{ color: "#EF4444", flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#EF4444" }}>
              {displayError}
            </span>
            <button onClick={() => { setLocalError(null); clearError(); }} style={{
              marginLeft: "auto", background: "none", border: "none",
              color: "#EF4444", cursor: "pointer", fontSize: "1.1rem", padding: 0, lineHeight: 1,
            }}>×</button>
          </div>
        )}

        <form onSubmit={handleSignup}>
          {/* Name Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#ccc", marginBottom: 6 }}>
                First Name
              </label>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#0A0A0A", border: "1px solid #222", borderRadius: 8, padding: "10px 12px",
              }}>
                <User size={14} style={{ color: "#444", flexShrink: 0 }} />
                <input type="text" placeholder="First" value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setLocalError(null); }} required
                  style={{ background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", width: "100%" }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#ccc", marginBottom: 6 }}>
                Last Name
              </label>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#0A0A0A", border: "1px solid #222", borderRadius: 8, padding: "10px 12px",
              }}>
                <input type="text" placeholder="Last" value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setLocalError(null); }} required
                  style={{ background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#ccc", marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#0A0A0A", border: "1px solid #222", borderRadius: 8, padding: "10px 14px",
            }}>
              <Mail size={16} style={{ color: "#444", flexShrink: 0 }} />
              <input type="email" placeholder="Enter your email" value={email}
                onChange={(e) => { setEmail(e.target.value); setLocalError(null); clearError(); }} required
                style={{ background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", width: "100%" }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#ccc", marginBottom: 6 }}>
              Password
            </label>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#0A0A0A", border: "1px solid #222", borderRadius: 8, padding: "10px 14px",
            }}>
              <Lock size={16} style={{ color: "#444", flexShrink: 0 }} />
              <input type={showPassword ? "text" : "password"} placeholder="Min 6 characters"
                value={password} onChange={(e) => { setPassword(e.target.value); setLocalError(null); }} required
                style={{ background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", width: "100%" }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 0 }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#ccc", marginBottom: 6 }}>
              Confirm Password
            </label>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#0A0A0A", border: "1px solid #222", borderRadius: 8, padding: "10px 14px",
            }}>
              <Lock size={16} style={{ color: "#444", flexShrink: 0 }} />
              <input type="password" placeholder="Re-enter password"
                value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setLocalError(null); }} required
                style={{ background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", width: "100%" }}
              />
            </div>
          </div>

          {/* Signup Button */}
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "13px 0", background: "var(--accent)",
            color: "#000", border: "none", borderRadius: 8,
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
            fontSize: "1rem", letterSpacing: "0.06em", textTransform: "uppercase",
            cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {loading && <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />}
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#222" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#444" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#222" }} />
        </div>

        {/* Google */}
        <button onClick={loginWithGoogle} disabled={loading} style={{
          width: "100%", padding: "11px 0", background: "#0D0D0D",
          border: "1px solid #222", borderRadius: 8, color: "#ccc",
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <span style={{ color: "#4285F4", fontWeight: 800, fontSize: "1rem" }}>G</span>
          Sign up with Google
        </button>

        {/* Login link */}
        <p style={{
          textAlign: "center", marginTop: 20,
          fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555",
        }}>
          Already have an account?{" "}
          <button onClick={onGoToLogin} style={{
            background: "none", border: "none", color: "var(--accent)",
            cursor: "pointer", fontFamily: "inherit", fontSize: "inherit",
          }}>
            Login
          </button>
        </p>

        {/* Security */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          marginTop: 16, padding: "10px 14px",
          background: "rgba(16, 185, 129, 0.04)", border: "1px solid rgba(16, 185, 129, 0.12)",
          borderRadius: 8,
        }}>
          <CheckCircle2 size={14} style={{ color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
            Your data is secure & encrypted
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center",
        padding: "16px 0", zIndex: 2,
      }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#333" }}>
          © 2024 <span style={{ color: "var(--accent)" }}>Unique3DPrinters</span>. All rights reserved.
        </p>
      </div>
    </div>
  );
}
