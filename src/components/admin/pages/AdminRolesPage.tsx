import { useState } from "react";
import { Shield, Plus, Edit2, Trash2, Loader } from "lucide-react";
import { useAllUsers } from "@/hooks/useWorkers";

export default function AdminRolesPage() {
  const { users, loading } = useAllUsers();

  const ROLES = [
    { 
      id: "R1", 
      name: "Admin", 
      users: users.filter(u => u.role === "admin").length, 
      description: "Full access to all system features, orders, and settings.",
      editable: false
    },
    { 
      id: "R2", 
      name: "Worker", 
      users: users.filter(u => u.role === "worker").length, 
      description: "Access to assigned tasks, printer status, and basic orders.",
      editable: false
    },
    { 
      id: "R3", 
      name: "Customer", 
      users: users.filter(u => u.role === "customer").length, 
      description: "Standard access to view personal orders and store.",
      editable: false
    },
  ];
  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Roles & Permissions</h2>
          <p>Manage access levels and system permissions for staff.</p>
        </div>
        <button className="dash-btn-primary">
          <Plus size={16} /> Create Role
        </button>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
          <thead>
            <tr>
              {["Role Name", "Description", "Assigned Users", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: "16px", textAlign: "center", color: "#666" }}><Loader size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading roles...</td></tr>
            ) : ROLES.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem" }}>
                  <Shield size={14} style={{ display: "inline", marginRight: 8, color: "var(--accent)" }} />
                  {r.name}
                </td>
                <td style={{ padding: "12px 16px", color: "#888" }}>{r.description}</td>
                <td style={{ padding: "12px 16px", color: "#ccc", fontWeight: 600 }}>{r.users} Users</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {r.editable ? (
                      <>
                        <button className="dashboard-icon-btn" style={{ width: 28, height: 28 }} title="Edit Permissions">
                          <Edit2 size={12} />
                        </button>
                        <button className="dashboard-icon-btn" style={{ width: 28, height: 28, color: "#EF4444" }} title="Delete Role">
                          <Trash2 size={12} />
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: "0.6rem", color: "#555", fontFamily: "'DM Mono', monospace" }}>SYSTEM ROLE</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
