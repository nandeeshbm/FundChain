import { useState, useEffect } from "react";
import axios from "axios";

const Transactions = () => {
  const [txnData, setTxnData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/transactions");
        setTxnData(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Search logic
  const filteredTxns = txnData.filter(
    (txn) =>
      (txn.project?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.txnId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: '600', color: '#475569' }}>Loading transactions...</div>
      </div>
    );
  }

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
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search transactions..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={styles.toolbarRight}>
            <button style={styles.btnFilter} type="button">
              🔽 Filter
            </button>
            <button style={styles.btnExport} type="button">
              📤 Export
            </button>
          </div>
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Txn ID</th>
                <th style={styles.th}>Project Name</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Amount (₹)</th>
                <th style={styles.th}>By</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((txn) => (
                <tr key={txn._id} style={styles.tr}>
                  <td style={styles.txnId}>{txn.txnId}</td>
                  <td style={{ ...styles.td, fontWeight: "600" }}>{txn.project?.name || 'N/A'}</td>
                  <td style={styles.td}>{new Date(txn.date).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={styles.typeTag}>
                      {txn.type === 'Fund Release' ? '💸' : '📥'} {txn.type}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: "600" }}>₹ {txn.amount.toLocaleString()}</td>
                  <td style={styles.td}>{txn.by}</td>
                  <td style={styles.td}>
                    <span style={getStatusBadgeStyle(txn.status)}>{txn.status}</span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.btnView} type="button">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <span style={styles.paginationText}>
              Showing {filteredTxns.length} of 120 entries
            </span>
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

const getStatusBadgeStyle = (status) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  };
  if (status === "Success") {
    return { ...base, backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981" };
  }
  if (status === "Pending") {
    return { ...base, backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b" };
  }
  if (status === "Flagged") {
    return { ...base, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" };
  }
  return base;
};

const styles = {
  container: { fontFamily: "'Sora', sans-serif", background: "#f8fafc", minHeight: "100vh" },
  content: { padding: "24px 28px" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" },
  searchWrap: { position: "relative", width: "280px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "14px" },
  searchInput: {
    width: "100%",
    padding: "10px 14px 10px 38px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "13px",
    outline: "none",
    background: "white",
  },
  toolbarRight: { display: "flex", gap: "10px" },
  btnFilter: {
    padding: "9px 18px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    background: "white",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#475569",
  },
  btnExport: {
    padding: "9px 18px",
    background: "#2563eb",
    color: "white",
    border: "1.5px solid #2563eb",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
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
  tr: {},
  td: { padding: "14px 16px", fontSize: "13px", color: "#1e293b", borderBottom: "1px solid #f1f5f9" },
  txnId: {
    padding: "14px 16px",
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#2563eb",
    fontSize: "12px",
    borderBottom: "1px solid #f1f5f9",
  },
  btnView: {
    padding: "5px 14px",
    background: "rgba(37,99,235,0.08)",
    color: "#2563eb",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },
  typeTag: { display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px" },
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

export default Transactions;
