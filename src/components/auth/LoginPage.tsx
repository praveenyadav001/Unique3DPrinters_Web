import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LoginPageProps {
  onGoToSignup: () => void;
  onGoToLanding: () => void;
}

export default function LoginPage({ onGoToSignup, onGoToLanding }: LoginPageProps) {
  const { login, loginWithGoogle, resetPassword, error, loading, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch {
      // error is set in context
    }
  };

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
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#161616 1px, transparent 1px), linear-gradient(90deg, #161616 1px, transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.3, pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 30% 40%, rgba(var(--accent-rgb), 0.06) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(var(--accent-rgb), 0.04) 0%, transparent 40%)",
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
          transition: "all 0.2s",
        }}
      >
        <ArrowLeft size={14} /> Back to Home
      </button>

      {/* Login Card */}
      <div style={{
        background: "#111", border: "1px solid #1a1a1a", borderRadius: 20,
        padding: "48px 40px", width: "100%", maxWidth: 420,
        position: "relative", zIndex: 2,
        boxShadow: "0 0 80px rgba(var(--accent-rgb), 0.04)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "0.05em", marginBottom: 8 }}>
            <span style={{ color: "var(--accent)" }}>UNIQUE</span>
            <span style={{ color: "#fff" }}>3D</span>
            <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
          </div>
          <h2 style={{
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 800,
            fontSize: "1.6rem", color: "#fff", margin: "0 0 4px",
          }}>
            {resetMode ? "Reset Password" : "Welcome Back!"}
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
            color: "#555", margin: 0,
          }}>
            {resetMode
              ? "Enter your email to receive a reset link"
              : "Login to continue to your account"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", marginBottom: 18,
            background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 8,
          }}>
            <AlertCircle size={14} style={{ color: "#EF4444", flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#EF4444" }}>
              {error}
            </span>
            <button onClick={clearError} style={{
              marginLeft: "auto", background: "none", border: "none",
              color: "#EF4444", cursor: "pointer", fontSize: "1.1rem", padding: 0, lineHeight: 1,
            }}>×</button>
          </div>
        )}

        {/* Reset Sent Success */}
        {resetSent && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", marginBottom: 18,
            background: "rgba(16, 185, 129, 0.06)", border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: 8,
          }}>
            <CheckCircle2 size={14} style={{ color: "#10B981", flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#10B981" }}>
              Password reset email sent! Check your inbox.
            </span>
          </div>
        )}

        {resetMode ? (
          /* ── Reset Password Form ─────────────────────────── */
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: "block", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                fontSize: "0.85rem", color: "#ccc", marginBottom: 8,
              }}>Email Address</label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#0A0A0A", border: "1px solid #222", borderRadius: 8,
                padding: "10px 14px",
              }}>
                <Mail size={16} style={{ color: "#444", flexShrink: 0 }} />
                <input
                  type="email" placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    background: "none", border: "none", outline: "none", color: "#fff",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", width: "100%",
                  }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px 0", background: "var(--accent)",
              color: "#000", border: "none", borderRadius: 8,
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
              fontSize: "1rem", letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading && <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />}
              Send Reset Link
            </button>

            <button type="button" onClick={() => { setResetMode(false); setResetSent(false); clearError(); }}
              style={{
                width: "100%", padding: "10px 0", marginTop: 12,
                background: "none", border: "1px solid #222", borderRadius: 8,
                color: "#888", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                fontSize: "0.85rem", cursor: "pointer",
              }}>
              Back to Login
            </button>
          </form>
        ) : (
          /* ── Login Form ──────────────────────────────────── */
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: "block", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                fontSize: "0.85rem", color: "#ccc", marginBottom: 8,
              }}>Email Address</label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#0A0A0A", border: "1px solid #222", borderRadius: 8,
                padding: "10px 14px",
              }}>
                <Mail size={16} style={{ color: "#444", flexShrink: 0 }} />
                <input
                  type="email" placeholder="Enter your email"
                  value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  required
                  style={{
                    background: "none", border: "none", outline: "none", color: "#fff",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", width: "100%",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: "block", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                fontSize: "0.85rem", color: "#ccc", marginBottom: 8,
              }}>Password</label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#0A0A0A", border: "1px solid #222", borderRadius: 8,
                padding: "10px 14px",
              }}>
                <Lock size={16} style={{ color: "#444", flexShrink: 0 }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  required
                  style={{
                    background: "none", border: "none", outline: "none", color: "#fff",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", width: "100%",
                  }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <button type="button" onClick={() => { setResetMode(true); clearError(); }}
                style={{
                  background: "none", border: "none",
                  fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
                  color: "var(--accent)", cursor: "pointer",
                }}>
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px 0", background: "var(--accent)",
              color: "#000", border: "none", borderRadius: 8,
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
              fontSize: "1rem", letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
            }}>
              {loading && <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />}
              Login
            </button>
          </form>
        )}

        {/* Divider */}
        {!resetMode && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#222" }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#444" }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "#222" }} />
            </div>

            {/* Google Sign In */}
            <button onClick={handleGoogleLogin} disabled={loading} style={{
              width: "100%", padding: "11px 0", background: "#0D0D0D",
              border: "1px solid #222", borderRadius: 8, color: "#ccc",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "border-color 0.2s",
            }}>
              <span style={{ color: "#4285F4", fontWeight: 800, fontSize: "1rem" }}>G</span>
              Continue with Google
            </button>

            {/* Sign Up */}
            <p style={{
              textAlign: "center", marginTop: 24,
              fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555",
            }}>
              Don't have an account?{" "}
              <button onClick={onGoToSignup} style={{
                background: "none", border: "none", color: "var(--accent)",
                cursor: "pointer", fontFamily: "inherit", fontSize: "inherit",
              }}>
                Sign up
              </button>
            </p>
          </>
        )}

        {/* Security badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          marginTop: 24, padding: "10px 14px",
          background: "rgba(16, 185, 129, 0.04)", border: "1px solid rgba(16, 185, 129, 0.12)",
          borderRadius: 8,
        }}>
          <CheckCircle2 size={14} style={{ color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
            Secure & encrypted login
          </span>
        </div>
      </div>

      {/* Spinner animation */}
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
