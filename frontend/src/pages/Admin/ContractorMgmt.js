import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const ContractorManagement = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    vendorName: "", companyName: "", walletAddress: "",
    email: "", phone: "", taxId: "", departmentTags: [], notes: "",
  });

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API}/admin/vendors?search=${search}`, authHeader());
      if (res.data.success) setContractors(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVendors(); }, [search]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const payload = { ...form };
      if (!payload.walletAddress) delete payload.walletAddress; // optional
      const res = await axios.post(`${API}/admin/vendors`, payload, authHeader());
      if (res.data.success) {
        setShowModal(false);
        setForm({ vendorName: "", companyName: "", walletAddress: "", email: "", phone: "", taxId: "", departmentTags: [], notes: "" });
        fetchVendors();
        alert("Contractor onboarded successfully!");
      }
    } catch (err) { alert(err.response?.data?.message || "Failed to onboard contractor"); }
    finally { setCreating(false); }
  };

  const handleSuspend = async (id) => {
    if (!window.confirm("Suspend this contractor?")) return;
    try {
      await axios.put(`${API}/admin/vendors/${id}/suspend`, { reason: "Admin action" }, authHeader());
      fetchVendors();
    } catch (err) { alert("Failed to suspend"); }
  };

  const handleBlock = async (id) => {
    if (!window.confirm("Block this contractor permanently?")) return;
    try {
      await axios.put(`${API}/admin/vendors/${id}/block`, { reason: "Admin action" }, authHeader());
      fetchVendors();
    } catch (err) { alert("Failed to block"); }
  };

  const handleReactivate = async (id) => {
    try {
      await axios.put(`${API}/admin/vendors/${id}`, { status: "Active", isWhitelisted: true }, authHeader());
      fetchVendors();
    } catch (err) { alert("Failed to reactivate"); }
  };

  const getStatusStyle = (status) => {
    const base = { display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 };
    if (status === "Active") return { ...base, backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981" };
    if (status === "Suspended") return { ...base, backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b" };
    return { ...base, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" };
  };

  const getInitials = (name) => name ? name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() : "??";
  const colors = ["#2563eb", "#10b981", "#ef4444", "#f59e0b", "#1e4db7", "#8b5cf6"];

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.toolbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={styles.toolbarTitle}>Verified Ecosystem Partners</span>
            <div style={{ position: "relative" }}>
              <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: "7px 12px 7px 30px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 12, outline: "none", width: 200 }} />
              <span style={{ position: "absolute", left: 10, top: 7, fontSize: 12 }}>🔍</span>
            </div>
          </div>
          <button style={styles.btnAdd} onClick={() => setShowModal(true)}>+ Onboard New Contractor</button>
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                {["Registry ID", "Contractor", "Email", "Phone", "GSTIN", "Wallet", "Anomaly Score", "Status", "Actions"].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contractors.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>No contractors found</td></tr>
              ) : contractors.map((c, i) => (
                <tr key={c._id} style={styles.tr}>
                  <td style={styles.idCell}>{c.registryId}</td>
                  <td style={styles.td}>
                    <div style={styles.nameWithAvatar}>
                      <div style={{ ...styles.contractorAvatar, backgroundColor: colors[i % colors.length] }}>{getInitials(c.companyName)}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.companyName}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.vendorName}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.emailCell}>{c.email}</td>
                  <td style={styles.phoneCell}>{c.phone}</td>
                  <td style={{ ...styles.td, fontSize: 11, fontFamily: "monospace" }}>{c.taxId || "—"}</td>
                  <td style={{ ...styles.td, fontSize: 10, fontFamily: "monospace", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.walletAddress ? `${c.walletAddress.substring(0, 8)}...${c.walletAddress.slice(-6)}` : "—"}
                  </td>
                  <td style={{ ...styles.td, fontWeight: 700, color: c.anomalyScore > 3 ? "#ef4444" : c.anomalyScore > 0 ? "#f59e0b" : "#10b981" }}>{c.anomalyScore || 0}</td>
                  <td style={styles.td}><span style={getStatusStyle(c.status)}>{c.status}</span></td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => setEditModal(c)} style={{ ...styles.btnView, fontSize: 11, padding: "4px 10px" }}>View</button>
                      {c.status === "Active" && <button onClick={() => handleSuspend(c._id)} style={{ ...styles.btnView, color: "#f59e0b", background: "rgba(245,158,11,0.08)", fontSize: 11, padding: "4px 8px" }}>Suspend</button>}
                      {c.status === "Active" && <button onClick={() => handleBlock(c._id)} style={{ ...styles.btnView, color: "#ef4444", background: "rgba(239,68,68,0.08)", fontSize: 11, padding: "4px 8px" }}>Block</button>}
                      {c.status !== "Active" && <button onClick={() => handleReactivate(c._id)} style={{ ...styles.btnView, color: "#10b981", background: "rgba(16,185,129,0.08)", fontSize: 11, padding: "4px 8px" }}>Reactivate</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Onboard New Contractor</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={lbl}>Contact Name *</label><input style={inp} value={form.vendorName} onChange={e => setForm({...form, vendorName: e.target.value})} /></div>
              <div><label style={lbl}>Company Name *</label><input style={inp} value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} /></div>
              <div><label style={lbl}>Email *</label><input style={inp} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div><label style={lbl}>Phone *</label><input style={inp} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div><label style={lbl}>Wallet Address <span style={{color:'#94a3b8',fontWeight:400}}>(optional)</span></label><input style={inp} placeholder="0x... (leave blank if not applicable)" value={form.walletAddress} onChange={e => setForm({...form, walletAddress: e.target.value})} /></div>
              <div><label style={lbl}>GSTIN / Tax ID</label><input style={inp} value={form.taxId} onChange={e => setForm({...form, taxId: e.target.value})} /></div>
              <div style={{ gridColumn: "1/3" }}><label style={lbl}>Notes</label><input style={inp} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <button onClick={handleCreate} disabled={creating} style={{ width: "100%", padding: 12, background: "#10b981", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 14 }}>
              {creating ? "Onboarding..." : "Register Contractor"}
            </button>
          </div>
        </div>
      )}

      {/* View/Edit Modal */}
      {editModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Contractor Profile — {editModal.registryId}</h3>
              <button onClick={() => setEditModal(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label style={lbl}>Company</label><div style={val}>{editModal.companyName}</div></div>
              <div><label style={lbl}>Contact</label><div style={val}>{editModal.vendorName}</div></div>
              <div><label style={lbl}>Email</label><div style={val}>{editModal.email}</div></div>
              <div><label style={lbl}>Phone</label><div style={val}>{editModal.phone}</div></div>
              <div><label style={lbl}>Wallet</label><div style={{ ...val, fontFamily: "monospace", fontSize: 11 }}>{editModal.walletAddress}</div></div>
              <div><label style={lbl}>GSTIN</label><div style={val}>{editModal.taxId || "—"}</div></div>
              <div><label style={lbl}>Status</label><div><span style={getStatusStyle(editModal.status)}>{editModal.status}</span></div></div>
              <div><label style={lbl}>Anomaly Score</label><div style={{ ...val, fontWeight: 700, color: editModal.anomalyScore > 3 ? "#ef4444" : "#10b981" }}>{editModal.anomalyScore || 0} flags</div></div>
              <div style={{ gridColumn: "1/3" }}><label style={lbl}>Notes</label><div style={val}>{editModal.notes || "—"}</div></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {editModal.status === "Active" && (
                <>
                  <button onClick={() => { handleSuspend(editModal._id); setEditModal(null); }} style={{ flex: 1, padding: 10, background: "#f59e0b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Suspend</button>
                  <button onClick={() => { handleBlock(editModal._id); setEditModal(null); }} style={{ flex: 1, padding: 10, background: "#ef4444", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Block</button>
                </>
              )}
              {editModal.status !== "Active" && (
                <button onClick={() => { handleReactivate(editModal._id); setEditModal(null); }} style={{ flex: 1, padding: 10, background: "#10b981", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Reactivate</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const lbl = { fontSize: 11, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 };
const inp = { width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none" };
const val = { fontSize: 13, fontWeight: 500, color: "#1e293b", padding: "6px 0" };
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalBox = { background: "white", borderRadius: 16, padding: 28, width: 600, maxHeight: "90vh", overflow: "auto" };

const styles = {
  container: { fontFamily: "'Sora', sans-serif", background: "#f8fafc", minHeight: "100vh" },
  content: { padding: "24px 28px" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  toolbarTitle: { fontSize: 14, color: "#475569", fontWeight: 500 },
  btnAdd: { padding: "9px 18px", background: "#10b981", color: "white", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" },
  tableCard: { background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "13px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #e2e8f0" },
  td: { padding: "14px 16px", fontSize: 13, color: "#1e293b", borderBottom: "1px solid #f1f5f9" },
  tr: { transition: "background 0.2s" },
  idCell: { padding: "14px 16px", fontFamily: "monospace", fontWeight: 600, color: "#2563eb", fontSize: 12, borderBottom: "1px solid #f1f5f9" },
  nameWithAvatar: { display: "flex", alignItems: "center", gap: 10 },
  contractorAvatar: { width: 32, height: 32, borderRadius: "50%", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 },
  emailCell: { padding: "14px 16px", color: "#475569", fontSize: 12, borderBottom: "1px solid #f1f5f9" },
  phoneCell: { padding: "14px 16px", fontSize: 12, borderBottom: "1px solid #f1f5f9" },
  btnView: { padding: "5px 14px", background: "rgba(37,99,235,0.08)", color: "#2563eb", border: "none", borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer" },
};

export default ContractorManagement;
