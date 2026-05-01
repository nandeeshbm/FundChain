import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const Transactions = () => {
  const [txnData, setTxnData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.append("status", statusFilter);
      if (typeFilter) params.append("type", typeFilter);
      const res = await axios.get(`${API}/transactions?${params}`, authHeader());
      if (res.data.success) {
        setTxnData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) { console.error("Error fetching:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTransactions(); }, [page, statusFilter, typeFilter]);

  const filteredTxns = txnData.filter(
    (txn) =>
      (txn.projectNameSnapshot || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.txnId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeStyle = (status) => {
    const base = { display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 };
    if (status === "success") return { ...base, backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981" };
    if (status === "pending") return { ...base, backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b" };
    if (status === "flagged") return { ...base, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" };
    if (status === "failed") return { ...base, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" };
    return base;
  };

  const getTypeIcon = (type) => {
    if (type === "fund_lock") return "🔒";
    if (type === "fund_release") return "💸";
    return "📥";
  };

  if (loading && txnData.length === 0) {
    return <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: '#475569' }}>Loading transactions...</div>
    </div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.toolbar}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input type="text" placeholder="Search transactions..." style={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div style={styles.toolbarRight}>
            <select style={styles.btnFilter} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
              <option value="failed">Failed</option>
            </select>
            <select style={styles.btnFilter} value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
              <option value="">All Types</option>
              <option value="fund_lock">Fund Lock</option>
              <option value="fund_release">Fund Release</option>
              <option value="utilization">Utilization</option>
            </select>
          </div>
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                {["Txn ID", "Project", "Date", "Type", "Amount (₹)", "Status", "Sentinel", "Block #"].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTxns.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>No transactions found</td></tr>
              ) : filteredTxns.map((txn) => (
                <tr key={txn._id}>
                  <td style={styles.txnId}>{txn.txnId}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{txn.projectNameSnapshot || txn.projectId?.projectName || 'N/A'}</td>
                  <td style={styles.td}>{new Date(txn.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={styles.typeTag}>{getTypeIcon(txn.type)} {txn.type.replace("_", " ")}</span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>₹ {Number(txn.amount).toLocaleString("en-IN")}</td>
                  <td style={styles.td}><span style={getStatusBadgeStyle(txn.status)}>{txn.status}</span></td>
                  <td style={styles.td}><span style={getStatusBadgeStyle(txn.sentinelStatus)}>{txn.sentinelStatus}</span></td>
                  <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 11 }}>{txn.blockNumber || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <span style={styles.paginationText}>Showing {filteredTxns.length} of {pagination.total} entries</span>
            <div style={styles.pageBtns}>
              <button style={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => (
                <button key={i + 1} style={{ ...styles.pageBtn, ...(page === i + 1 ? styles.pageBtnActive : {}) }} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
              <button style={styles.pageBtn} disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: "'Sora', sans-serif", background: "#f8fafc", minHeight: "100vh" },
  content: { padding: "24px 28px" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  searchWrap: { position: "relative", width: 280 },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 14 },
  searchInput: { width: "100%", padding: "10px 14px 10px 38px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", background: "white" },
  toolbarRight: { display: "flex", gap: 10 },
  btnFilter: { padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "white", color: "#475569" },
  tableCard: { background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "13px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #e2e8f0" },
  td: { padding: "14px 16px", fontSize: 13, color: "#1e293b", borderBottom: "1px solid #f1f5f9" },
  txnId: { padding: "14px 16px", fontFamily: "monospace", fontWeight: 600, color: "#2563eb", fontSize: 12, borderBottom: "1px solid #f1f5f9" },
  typeTag: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 },
  pagination: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid #e2e8f0" },
  paginationText: { fontSize: 12, color: "#94a3b8" },
  pageBtns: { display: "flex", gap: 4 },
  pageBtn: { width: 30, height: 30, borderRadius: 7, border: "1px solid #e2e8f0", background: "white", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  pageBtnActive: { background: "#2563eb", color: "white", borderColor: "#2563eb" },
};

export default Transactions;
