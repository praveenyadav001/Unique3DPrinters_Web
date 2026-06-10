import { useState } from "react";
import { Plus, Search, Loader, Mail, UserPlus, Users } from "lucide-react";
import { useWorkers, useCustomers } from "@/hooks/useWorkers";
import type { UserDoc } from "@/types/firebase.types";

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
          <button className="dash-btn-secondary">
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
                    <button className="dash-btn-secondary dash-btn-small" style={{ padding: "4px 10px", fontSize: "0.6rem" }}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
