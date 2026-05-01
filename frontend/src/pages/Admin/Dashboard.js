function Dashboard() {
  const stats = [
    { label: "Total Projects", value: "25", hint: "↑ 4 new this month" },
    { label: "Total Budget", value: "₹25,00,00,000", hint: "Allocated" },
    { label: "Total Released", value: "₹12,50,00,000", hint: "↑ ₹2.5 Cr this month" },
    { label: "Total Utilised", value: "₹7,80,00,000", hint: "62% utilisation" },
  ];

  const projects = [
    { id: "PJT001", name: "Road Construction", dept: "PWD", budget: "₹5,00,00,000", status: "In Progress", progress: 60 },
    { id: "PJT002", name: "School Building", dept: "Education", budget: "₹3,00,00,000", status: "In Progress", progress: 40 },
    { id: "PJT003", name: "Water Supply", dept: "Water Dept", budget: "₹2,00,00,000", status: "In Progress", progress: 70 },
    { id: "PJT004", name: "Community Hall", dept: "Rural Dev", budget: "₹1,25,00,000", status: "Planning", progress: 20 },
    { id: "PJT005", name: "Drainage System", dept: "PWD", budget: "₹1,20,00,000", status: "In Progress", progress: 50 },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {stats.map((s) => (
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
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Showing 5 of 25 projects</div>
          </div>
          <button style={{ padding: "8px 14px", border: "none", borderRadius: 8, background: "#1a3260", color: "#fff", fontWeight: 600 }}>
            + New Project
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Project ID", "Project Name", "Department", "Budget", "Status", "Progress"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 12, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: "#2563eb", borderBottom: "1px solid #f1f5f9" }}>{p.id}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>{p.name}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>{p.dept}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>{p.budget}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>{p.status}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 100, height: 7, background: "#e2e8f0", borderRadius: 8 }}>
                      <div style={{ width: `${p.progress}%`, height: "100%", borderRadius: 8, background: "#2563eb" }} />
                    </div>
                    <span style={{ fontSize: 12 }}>{p.progress}%</span>
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

export default Dashboard;
