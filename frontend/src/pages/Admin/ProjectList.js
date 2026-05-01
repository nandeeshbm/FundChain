const projects = [
  { id: "PJT001", name: "Road Construction", dept: "PWD", budget: "₹ 5,00,00,000", status: "In Progress", progress: 60, color: "#2563eb" },
  { id: "PJT002", name: "School Building", dept: "Education", budget: "₹ 3,00,00,000", status: "In Progress", progress: 40, color: "#2563eb" },
  { id: "PJT003", name: "Water Supply", dept: "Water Dept", budget: "₹ 2,00,00,000", status: "In Progress", progress: 70, color: "#10b981" },
  { id: "PJT004", name: "Community Hall", dept: "Rural Dev", budget: "₹ 1,25,00,000", status: "Planning", progress: 20, color: "#f59e0b" },
  { id: "PJT005", name: "Drainage System", dept: "PWD", budget: "₹ 1,20,00,000", status: "In Progress", progress: 50, color: "#2563eb" },
];

function getBadgeStyle(status) {
  return {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    background: status === "Planning" ? "rgba(245,158,11,0.1)" : "rgba(37,99,235,0.1)",
    color: status === "Planning" ? "#f59e0b" : "#2563eb",
  };
}

const styles = {
  toolbar: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  tableCard: { background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" },
  th: { background: "#f8fafc", padding: "13px 16px", textAlign: "left", fontSize: "12px", color: "#475569", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" },
  td: { padding: "14px 16px", fontSize: "13px", borderBottom: "1px solid #f1f5f9" },
};

const ProjectList = () => {
  return (
    <section>
      <div style={styles.toolbar}>
        <div style={{ position: "relative", width: "280px" }}>
          <input
            type="text"
            placeholder="Search projects..."
            style={{ width: "100%", padding: "10px 14px 10px 38px", border: "1.5px solid #e2e8f0", borderRadius: "10px", outline: "none" }}
          />
          <span style={{ position: "absolute", left: "12px", top: "10px" }}>🔍</span>
        </div>
        <button style={{ padding: "9px 18px", background: "#10b981", color: "white", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>
          + New Project
        </button>
      </div>

      <div style={styles.tableCard}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Project ID", "Project Name", "Department", "Budget", "Status", "Progress", "Action"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td style={{ ...styles.td, fontFamily: "monospace", color: "#2563eb", fontWeight: "600" }}>{p.id}</td>
                <td style={{ ...styles.td, fontWeight: "600" }}>{p.name}</td>
                <td style={styles.td}>{p.dept}</td>
                <td style={styles.td}>{p.budget}</td>
                <td style={styles.td}>
                  <span style={getBadgeStyle(p.status)}>{p.status}</span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "3px" }}>
                      <div style={{ width: `${p.progress}%`, background: p.color, height: "100%", borderRadius: "3px" }} />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "600" }}>{p.progress}%</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <button style={{ padding: "5px 14px", background: "rgba(37,99,235,0.08)", color: "#2563eb", border: "none", borderRadius: "7px", fontWeight: "600", cursor: "pointer" }}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProjectList;
