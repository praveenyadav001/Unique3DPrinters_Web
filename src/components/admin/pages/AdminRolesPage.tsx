import { useState } from "react";
import { Shield, Plus, Edit2, Trash2 } from "lucide-react";

const ROLES = [
  { id: "R1", name: "Super Admin", users: 2, description: "Full access to all system features." },
  { id: "R2", name: "Admin", users: 5, description: "Access to orders, products, and users." },
  { id: "R3", name: "Worker", users: 12, description: "Access to assigned tasks and printer status." },
  { id: "R4", name: "Support", users: 3, description: "Access to customer queries and basic orders." },
];

export default function AdminRolesPage() {
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
            {ROLES.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem" }}>
                  <Shield size={14} style={{ display: "inline", marginRight: 8, color: "var(--accent)" }} />
                  {r.name}
                </td>
                <td style={{ padding: "12px 16px", color: "#888" }}>{r.description}</td>
                <td style={{ padding: "12px 16px", color: "#ccc", fontWeight: 600 }}>{r.users} Users</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="dashboard-icon-btn" style={{ width: 28, height: 28 }} title="Edit Permissions">
                      <Edit2 size={12} />
                    </button>
                    <button className="dashboard-icon-btn" style={{ width: 28, height: 28, color: "#EF4444" }} title="Delete Role">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
