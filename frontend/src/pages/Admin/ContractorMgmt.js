import { useState } from "react";

const ContractorManagement = () => {
  // Mock data representing the shared source of truth for vendors
  const [contractors] = useState([
    {
      id: "CT001",
      initials: "AB",
      name: "ABC Infra Pvt Ltd",
      email: "abc.infra@govtrack.in",
      phone: "9876543210",
      status: "Active",
      color: "#2563eb",
    },
    {
      id: "CT002",
      initials: "BL",
      name: "BuildWell Ltd",
      email: "buildwell@govtrack.in",
      phone: "9823456712",
      status: "Active",
      color: "#10b981",
    },
    {
      id: "CT003",
      initials: "UC",
      name: "UrbanCraft Engineers",
      email: "urban@govtrack.in",
      phone: "9912345678",
      status: "Blocked",
      color: "#ef4444",
    },
    {
      id: "CT004",
      initials: "RD",
      name: "Rivera Developers",
      email: "rivera@govtrack.in",
      phone: "9765432109",
      status: "Active",
      color: "#f59e0b",
    },
    {
      id: "CT005",
      initials: "MN",
      name: "Metro Nexus",
      email: "metronexus@govtrack.in",
      phone: "9898989898",
      status: "Active",
      color: "#1e4db7",
    },
  ]);

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        :root {
          --navy: #0f1f3d; --blue: #1e4db7; --blue-light: #2563eb;
          --green: #10b981; --amber: #f59e0b; --red: #ef4444;
          --white: #fff; --gray-50: #f8fafc; --gray-100: #f1f5f9;
          --gray-200: #e2e8f0; --gray-400: #94a3b8; --gray-600: #475569;
          --text: #1e293b;
        }
      `}</style>

      <div style={styles.content}>
        <div style={styles.toolbar}>
          <span style={styles.toolbarTitle}>Verified Ecosystem Partners</span>
          <button style={styles.btnAdd} type="button">
            + Onboard New Contractor
          </button>
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Contractor ID</th>
                <th style={styles.th}>Contractor Name</th>
                <th style={styles.th}>Email Address</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>System Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {contractors.map((c) => (
                <tr key={c.id} style={styles.tr}>
                  <td style={styles.idCell}>{c.id}</td>
                  <td style={styles.td}>
                    <div style={styles.nameWithAvatar}>
                      <div style={{ ...styles.contractorAvatar, backgroundColor: c.color }}>
                        {c.initials}
                      </div>
                      <span style={styles.nameCell}>{c.name}</span>
                    </div>
                  </td>
                  <td style={styles.emailCell}>{c.email}</td>
                  <td style={styles.phoneCell}>{c.phone}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(c.status)}>{c.status}</span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.btnView} type="button">
                      Audit Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <span style={styles.paginationText}>Showing 1 to 5 of 45 verified entities</span>
            <div style={styles.pageBtns}>
              <button style={styles.pageBtn} type="button">
                ‹
              </button>
              <button style={{ ...styles.pageBtn, ...styles.pageBtnActive }} type="button">
                1
              </button>
              <button style={styles.pageBtn} type="button">
                2
              </button>
              <button style={styles.pageBtn} type="button">
                3
              </button>
              <button style={styles.pageBtn} type="button">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  };
  return status === "Active"
    ? { ...base, backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981" }
    : { ...base, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" };
};

const styles = {
  container: { fontFamily: "'Sora', sans-serif", background: "#f8fafc", minHeight: "100vh" },
  content: { padding: "24px 28px" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" },
  toolbarTitle: { fontSize: "14px", color: "#475569", fontWeight: "500" },
  btnAdd: {
    padding: "9px 18px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  },
  tableCard: { background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: {
    padding: "13px 16px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #e2e8f0",
  },
  td: { padding: "14px 16px", fontSize: "13px", color: "#1e293b", borderBottom: "1px solid #f1f5f9" },
  tr: { transition: "background 0.2s" },
  idCell: {
    padding: "14px 16px",
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#2563eb",
    fontSize: "12px",
    borderBottom: "1px solid #f1f5f9",
  },
  nameWithAvatar: { display: "flex", alignItems: "center", gap: "10px" },
  contractorAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
  },
  nameCell: { fontWeight: "600" },
  emailCell: { padding: "14px 16px", color: "#475569", fontSize: "12px", borderBottom: "1px solid #f1f5f9" },
  phoneCell: { padding: "14px 16px", fontSize: "12px", borderBottom: "1px solid #f1f5f9" },
  btnView: {
    padding: "5px 14px",
    background: "rgba(37,99,235,0.08)",
    color: "#2563eb",
    border: "none",
    borderRadius: "7px",
    fontWeight: "600",
    fontSize: "12px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderTop: "1px solid #e2e8f0",
  },
  paginationText: { fontSize: "12px", color: "#94a3b8" },
  pageBtns: { display: "flex", gap: "4px" },
  pageBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    border: "1px solid #e2e8f0",
    background: "white",
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnActive: { background: "#2563eb", color: "white", borderColor: "#2563eb" },
};

export default ContractorManagement;
