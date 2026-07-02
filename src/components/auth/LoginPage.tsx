import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Zap } from "lucide-react";
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
      display: "flex",
      backgroundColor: "#050505",
      color: "#fff",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* Decorative Grid & Globals */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px", zIndex: 0, pointerEvents: "none"
      }} />

      {/* Back Button */}
      <button onClick={onGoToLanding} style={{
        position: "absolute", top: 24, left: 24, zIndex: 20,
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(20,20,20,0.6)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
        padding: "10px 16px", color: "#ccc", cursor: "pointer",
        fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#000"; e.currentTarget.style.borderColor = "var(--accent)"; }}
      onMouseOut={(e) => { e.currentTarget.style.background = "rgba(20,20,20,0.6)"; e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
      >
        <ArrowLeft size={14} /> Back to Hub
      </button>

      {/* Left Panel - Visual */}
      <div style={{
        flex: 1, position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px",
        background: "radial-gradient(circle at center, rgba(255, 92, 0, 0.15) 0%, transparent 60%)"
      }}>
        {/* Animated Orbs */}
        <div style={{
          position: "absolute", top: "20%", left: "30%", width: 300, height: 300,
          background: "var(--accent)", borderRadius: "50%",
          filter: "blur(120px)", opacity: 0.4, animation: "floatSoft 8s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "20%", width: 250, height: 250,
          background: "#00E5FF", borderRadius: "50%",
          filter: "blur(100px)", opacity: 0.2, animation: "floatSoft 6s ease-in-out infinite reverse"
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 500, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(255, 92, 0, 0.1)", border: "1px solid rgba(255, 92, 0, 0.3)", borderRadius: 99, marginBottom: 32 }}>
            <Zap size={14} style={{ color: "var(--accent)" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Welcome to the Future of Making</span>
          </div>
          <h1 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "4.5rem", lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
            Create. <br />
            <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}>Print.</span> <br />
            <span style={{ background: "linear-gradient(90deg, var(--accent), #FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dominate.</span>
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", color: "#888", fontSize: "1rem", lineHeight: 1.6 }}>
            Access the most premium collection of 3D printing designs. Join our community of makers, designers, and innovators.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{
        width: "100%", maxWidth: 540, zIndex: 2,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px",
        background: "rgba(10, 10, 10, 0.6)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ width: "100%", maxWidth: 400, animation: "revealUp 0.6s ease forwards" }}>
          
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "2rem", color: "#fff", marginBottom: 8 }}>
              {resetMode ? "Reset Password" : "Login to Account"}
            </h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#666" }}>
              {resetMode ? "We'll send you instructions to reset it." : "Enter your credentials to access your dashboard."}
            </p>
          </div>

          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", marginBottom: 24,
              background: "rgba(239, 68, 68, 0.1)", borderLeft: "3px solid #EF4444", borderRadius: "0 8px 8px 0"
            }}>
              <AlertCircle size={16} style={{ color: "#EF4444", flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#EF4444" }}>{error}</span>
            </div>
          )}

          {resetSent && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", marginBottom: 24,
              background: "rgba(16, 185, 129, 0.1)", borderLeft: "3px solid #10B981", borderRadius: "0 8px 8px 0"
            }}>
              <CheckCircle2 size={16} style={{ color: "#10B981", flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#10B981" }}>Reset link sent! Check your email.</span>
            </div>
          )}

          {resetMode ? (
            <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="input-group">
                <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#555" }} />
                  <input type="email" required placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 16px 14px 44px", background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff",
                      fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", outline: "none", transition: "all 0.3s"
                    }}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
              </div>
              
              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "16px", background: "var(--accent)", color: "#000",
                border: "none", borderRadius: 12, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
                fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8,
                boxShadow: "0 8px 24px rgba(255, 92, 0, 0.25)", transition: "all 0.3s ease"
              }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Send Reset Link"}
              </button>

              <button type="button" onClick={() => { setResetMode(false); clearError(); }} style={{
                background: "none", border: "none", color: "#888", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", cursor: "pointer", marginTop: 8
              }}>
                Cancel & return to login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="input-group">
                <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#555" }} />
                  <input type="email" required placeholder="name@example.com" value={email} onChange={e => {setEmail(e.target.value); clearError();}}
                    style={{
                      width: "100%", padding: "14px 16px 14px 44px", background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff",
                      fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", outline: "none", transition: "all 0.3s"
                    }}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
              </div>

              <div className="input-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em" }}>Password</label>
                  <button type="button" onClick={() => setResetMode(true)} style={{ background: "none", border: "none", color: "var(--accent)", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", cursor: "pointer" }}>Forgot?</button>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#555" }} />
                  <input type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={e => {setPassword(e.target.value); clearError();}}
                    style={{
                      width: "100%", padding: "14px 44px 14px 44px", background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff",
                      fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", outline: "none", transition: "all 0.3s"
                    }}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer", display: "flex" }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "16px", background: "var(--accent)", color: "#000",
                border: "none", borderRadius: 12, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
                fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8,
                boxShadow: "0 8px 24px rgba(255, 92, 0, 0.25)", transition: "all 0.3s ease"
              }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
              </button>
            </form>
          )}

          {!resetMode && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "32px 0" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Or continue with</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
              </div>

              <button onClick={handleGoogleLogin} disabled={loading} style={{
                width: "100%", padding: "14px", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff",
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "1rem",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                transition: "all 0.3s ease"
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <div style={{ textAlign: "center", marginTop: 40 }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#666" }}>
                  New to Unique3DPrinters?{" "}
                  <button onClick={onGoToSignup} style={{
                    background: "none", border: "none", color: "var(--accent)",
                    fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "inherit",
                    padding: 0
                  }}>
                    Create an account
                  </button>
                </p>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Basic Mobile Responsive Styles via Style Tag */}
      <style>{`
        @media (max-width: 900px) {
          .input-group label {
            font-size: 0.65rem !important;
          }
          div[style*="flex-direction: column; justify-content: center;"] {
            display: none !important;
          }
          div[style*="border-left: 1px solid rgba(255,255,255,0.05)"] {
            border-left: none !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
