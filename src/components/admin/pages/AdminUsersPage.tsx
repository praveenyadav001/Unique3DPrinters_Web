import { useState } from "react";
import { Plus, Search, Loader, Mail, UserPlus, Users, X, Save } from "lucide-react";
import { useWorkers, useCustomers } from "@/hooks/useWorkers";
import type { UserDoc } from "@/types/firebase.types";
import { createWorkerAccount } from "@/services/auth.service";

function formatDate(ts: any): string {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminUsersPage() {
  const { workers, loading: workersLoading } = useWorkers();
  const { customers, loading: customersLoading } = useCustomers();
  const [tab, setTab] = useState<"all" | "workers" | "customers">("all");
  const [search, setSearch] = useState("");

  const allUsers = [...workers, ...customers];
  const loading = workersLoading || customersLoading;

  // Add Worker State
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [addWorkerForm, setAddWorkerForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [addingWorker, setAddingWorker] = useState(false);

  // Manage User State
  const [managingUser, setManagingUser] = useState<UserDoc | null>(null);

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addWorkerForm.firstName || !addWorkerForm.lastName || !addWorkerForm.email || !addWorkerForm.password) return;
    setAddingWorker(true);
    try {
      await createWorkerAccount(
        addWorkerForm.email,
        addWorkerForm.password,
        addWorkerForm.firstName,
        addWorkerForm.lastName
      );
      setShowAddWorker(false);
      setAddWorkerForm({ firstName: "", lastName: "", email: "", password: "" });
      alert("Worker account created successfully!");
    } catch (err: any) {
      alert("Error creating worker: " + err.message);
    } finally {
      setAddingWorker(false);
    }
  };

  const getFilteredUsers = () => {
    let list: UserDoc[] = [];
    if (tab === "workers") list = workers;
    else if (tab === "customers") list = customers;
    else list = allUsers;

    if (search) {
      const s = search.toLowerCase();
      list = list.filter(u => 
        u.displayName.toLowerCase().includes(s) || 
        u.email.toLowerCase().includes(s)
      );
    }
    
    // Sort by role (workers first) then by name
    return list.sort((a, b) => {
      if (a.role !== b.role) return a.role === "worker" ? -1 : 1;
      return a.displayName.localeCompare(b.displayName);
    });
  };

  const filtered = getFilteredUsers();

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>User Management</h2>
          <p>Manage system users, worker accounts, and customers.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="dash-btn-secondary" onClick={() => setShowAddWorker(true)}>
            <UserPlus size={16} /> Add Worker
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setTab("all")} className="dash-card" style={{ padding: "14px 16px", cursor: "pointer", textAlign: "left", borderColor: tab === "all" ? "var(--accent)" : undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Users size={14} style={{ color: "var(--accent)" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", textTransform: "uppercase" }}>Total Users</span>
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff" }}>{allUsers.length}</div>
        </button>
        <button onClick={() => setTab("workers")} className="dash-card" style={{ padding: "14px 16px", cursor: "pointer", textAlign: "left", borderColor: tab === "workers" ? "#EAB308" : undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <UserPlus size={14} style={{ color: "#EAB308" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", textTransform: "uppercase" }}>Workers</span>
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff" }}>{workers.length}</div>
        </button>
        <button onClick={() => setTab("customers")} className="dash-card" style={{ padding: "14px 16px", cursor: "pointer", textAlign: "left", borderColor: tab === "customers" ? "#00E5FF" : undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Users size={14} style={{ color: "#00E5FF" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", textTransform: "uppercase" }}>Customers</span>
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff" }}>{customers.length}</div>
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className="dashboard-topbar-search" style={{ maxWidth: 400 }}>
          <Search size={14} />
          <input 
            placeholder="Search users by name or email..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Loader size={20} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#333" }}>No users found</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
            <thead>
              <tr>
                {["Name", "Role", "Email", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.uid} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", fontSize: "0.95rem" }}>
                    {u.displayName}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`dash-badge ${u.role === "worker" ? "dash-badge-accent" : u.role === "admin" ? "dash-badge-red" : "dash-badge-blue"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Mail size={12} /> {u.email}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>{formatDate(u.createdAt)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {u.role === "worker" ? (
                      <span className={`dash-badge ${u.status === "Online" ? "dash-badge-green" : "dash-badge-yellow"}`}>
                        {u.status || "Offline"}
                      </span>
                    ) : (
                      <span style={{ color: "#555" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button 
                      className="dash-btn-secondary dash-btn-small" 
                      style={{ padding: "4px 10px", fontSize: "0.6rem" }}
                      onClick={() => setManagingUser(u)}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Add Worker Modal */}
      {showAddWorker && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="dash-card" style={{ width: 400, maxWidth: "90vw", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", color: "#fff", fontSize: "1.2rem", margin: 0 }}>Add New Worker</h3>
              <button onClick={() => setShowAddWorker(false)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleAddWorker} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="dash-label">First Name</label>
                  <input required type="text" className="dash-input" value={addWorkerForm.firstName} onChange={e => setAddWorkerForm({...addWorkerForm, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="dash-label">Last Name</label>
                  <input required type="text" className="dash-input" value={addWorkerForm.lastName} onChange={e => setAddWorkerForm({...addWorkerForm, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="dash-label">Email Address</label>
                <input required type="email" className="dash-input" value={addWorkerForm.email} onChange={e => setAddWorkerForm({...addWorkerForm, email: e.target.value})} />
              </div>
              <div>
                <label className="dash-label">Temporary Password</label>
                <input required type="password" className="dash-input" value={addWorkerForm.password} onChange={e => setAddWorkerForm({...addWorkerForm, password: e.target.value})} />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="button" className="dash-btn-primary" style={{ flex: 1, background: "transparent", border: "1px solid #333", color: "#ccc" }} onClick={() => setShowAddWorker(false)}>Cancel</button>
                <button type="submit" className="dash-btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={addingWorker}>
                  {addingWorker ? "Creating..." : "Create Worker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage User Modal */}
      {managingUser && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="dash-card" style={{ width: 400, maxWidth: "90vw", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", color: "#fff", fontSize: "1.2rem", margin: 0 }}>User Details</h3>
              <button onClick={() => setManagingUser(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}><X size={18} /></button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="dash-label">Name</label>
                <div style={{ color: "#fff", fontSize: "0.9rem" }}>{managingUser.displayName}</div>
              </div>
              <div>
                <label className="dash-label">Email</label>
                <div style={{ color: "#fff", fontSize: "0.9rem" }}>{managingUser.email}</div>
              </div>
              <div>
                <label className="dash-label">Role</label>
                <div style={{ textTransform: "capitalize", color: "var(--accent)", fontSize: "0.9rem", fontWeight: 600 }}>{managingUser.role}</div>
              </div>
              <div>
                <label className="dash-label">Joined On</label>
                <div style={{ color: "#ccc", fontSize: "0.9rem" }}>{formatDate(managingUser.createdAt)}</div>
              </div>
              {managingUser.role === "worker" && (
                <div>
                  <label className="dash-label">Worker Status</label>
                  <div style={{ color: managingUser.status === "Online" ? "#10B981" : "#EAB308", fontSize: "0.9rem" }}>{managingUser.status || "Offline"}</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 24, textAlign: "right" }}>
              <button className="dash-btn-primary" onClick={() => setManagingUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
