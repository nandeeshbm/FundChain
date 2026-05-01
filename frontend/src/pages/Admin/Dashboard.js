import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/admin/dashboard-stats`, authHeader());
        if (res.data.success) {
          setStats(res.data.data.stats);
          setProjects(res.data.data.recentProjects);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const fmt = (n) => n != null ? `₹ ${Number(n).toLocaleString("en-IN")}` : "₹ 0";

  const statCards = stats
    ? [
        { label: "Total Projects", value: stats.totalProjects, hint: `${stats.activeProjects} active` },
        { label: "Total Budget", value: fmt(stats.totalBudget), hint: "Allocated" },
        { label: "Total Released", value: fmt(stats.totalReleased), hint: "Disbursed" },
        { label: "Remaining", value: fmt(stats.totalRemaining), hint: "In vault" },
      ]
    : [
        { label: "Total Projects", value: "—", hint: "" },
        { label: "Total Budget", value: "—", hint: "" },
        { label: "Total Released", value: "—", hint: "" },
        { label: "Remaining", value: "—", hint: "" },
      ];

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading dashboard...</div>;
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
            <div style={{ color: "#94a3b8", fontSize: 12 }}>{s.label}</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: "#1e293b", marginTop: 4 }}>{s.value}</div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{s.hint}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <div>
            <div style={{ fontWeight: 700, color: "#1e293b" }}>Recent Projects</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Showing {projects.length} projects</div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Project ID", "Project Name", "Department", "Budget", "Status", "Progress"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 12, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>No projects yet. Create one from the Projects page.</td></tr>
            ) : (
              projects.map((p) => (
                <tr key={p.projectId}>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: "#2563eb", borderBottom: "1px solid #f1f5f9" }}>{p.projectId}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>{p.projectName}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>{p.department}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>{fmt(p.totalBudget)}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>{p.status}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 100, height: 7, background: "#e2e8f0", borderRadius: 8 }}>
                        <div style={{ width: `${p.progress || 0}%`, height: "100%", borderRadius: 8, background: "#2563eb" }} />
                      </div>
                      <span style={{ fontSize: 12 }}>{p.progress || 0}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
