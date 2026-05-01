import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });
const fmt = (n) => `₹ ${Number(n).toLocaleString("en-IN")}`;

const FundRelease = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [summary, setSummary] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [proofModal, setProofModal] = useState(null);
  const [releasing, setReleasing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API}/admin/projects`, authHeader());
        if (res.data.success) {
          setProjects(res.data.data);
          if (res.data.data.length > 0) loadProject(res.data.data[0].projectId);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProjects();
  }, []);

  const loadProject = async (projectId) => {
    setSelectedProject(projectId);
    try {
      const [sumRes, msRes] = await Promise.all([
        axios.get(`${API}/admin/projects/${projectId}/fund-summary`, authHeader()),
        axios.get(`${API}/admin/projects/${projectId}/milestones`, authHeader()),
      ]);
      if (sumRes.data.success) setSummary(sumRes.data.data);
      if (msRes.data.success) setMilestones(msRes.data.data.milestones);
    } catch (err) { console.error(err); }
  };

  const viewProof = async (milestoneId) => {
    try {
      const res = await axios.get(`${API}/admin/milestones/${milestoneId}/proof`, authHeader());
      if (res.data.success) setProofModal(res.data.data);
    } catch (err) { alert("Failed to load proof"); }
  };

  const releaseFunds = async (milestoneId) => {
    if (!window.confirm("Authorize fund release for this milestone?")) return;
    setReleasing(milestoneId);
    try {
      const res = await axios.post(`${API}/admin/milestones/${milestoneId}/release`, { remarks: "Admin authorized" }, authHeader());
      if (res.data.success) {
        alert(`Funds released! TX: ${res.data.data.txHash}`);
        loadProject(selectedProject);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Release failed");
    } finally { setReleasing(null); }
  };

  const getStatusStyle = (status) => {
    const base = { display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 };
    if (status === "released") return { ...base, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' };
    if (status === "verified") return { ...base, backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb' };
    if (status === "flagged") return { ...base, backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' };
    if (status === "submitted") return { ...base, backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' };
    return { ...base, backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' };
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={s.container}>
      <div style={s.content}>
        {/* Project Selector */}
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Select Project:</label>
          <select style={{ padding: "8px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13 }}
            value={selectedProject || ""} onChange={e => loadProject(e.target.value)}>
            {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName} ({p.projectId})</option>)}
          </select>
        </div>

        {/* Fund Summary */}
        {summary && (
          <div style={s.projectHeader}>
            <h3 style={s.headerTitle}>Fund Release — {selectedProject}</h3>
            <div style={s.projectStats}>
              <div style={s.projStat}><div style={s.label}>Total Budget</div><div style={s.value}>{fmt(summary.totalBudget)}</div></div>
              <div style={s.projStat}><div style={s.label}>Total Released</div><div style={s.value}>{fmt(summary.totalReleased)}</div></div>
              <div style={s.projStat}><div style={s.label}>Remaining in Vault</div><div style={{ ...s.value, color: '#f59e0b' }}>{fmt(summary.remainingInVault)}</div></div>
            </div>
            {summary.contractAddress && (
              <div style={{ marginTop: 10, fontSize: 11, color: "#94a3b8" }}>
                Contract: <span style={{ fontFamily: "monospace", color: "#2563eb" }}>{summary.contractAddress}</span> ({summary.contractNetwork})
              </div>
            )}
          </div>
        )}

        {/* Milestones Table */}
        <div style={s.card}>
          <h4 style={s.cardTitle}>Milestone Tracking</h4>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                {["Phase", "Title", "Amount", "Deadline", "Status", "Sentinel", "Action"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {milestones.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>No milestones. Create a project first.</td></tr>
              ) : milestones.map(m => (
                <tr key={m._id}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{m.phaseNumber}</td>
                  <td style={s.td}>{m.title}</td>
                  <td style={s.td}>{fmt(m.amount)}</td>
                  <td style={s.td}>{m.estimatedDeadline ? new Date(m.estimatedDeadline).toLocaleDateString() : "—"}</td>
                  <td style={s.td}><span style={getStatusStyle(m.status)}>{m.status}</span></td>
                  <td style={s.td}><span style={getStatusStyle(m.sentinelStatus)}>{m.sentinelStatus}</span></td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {m.proofSubmissionId && <button onClick={() => viewProof(m._id)} style={s.btnView}>View Proof</button>}
                      {(m.status === "verified" || m.status === "submitted") && m.sentinelStatus !== "flagged" && (
                        <button onClick={() => releaseFunds(m._id)} disabled={releasing === m._id}
                          style={s.btnRelease}>{releasing === m._id ? "..." : "Release"}</button>
                      )}
                      {m.status === "released" && m.blockchainReleaseTxHash && (
                        <span style={{ fontSize: 10, color: "#10b981" }}>✓ Released</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Modal */}
      {proofModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 24, width: 550, maxHeight: "80vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Proof Submission Details</h3>
              <button onClick={() => setProofModal(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            {proofModal.proof ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={lb}>GPS Latitude</label><div style={vl}>{proofModal.proof.gpsLatitude}</div></div>
                <div><label style={lb}>GPS Longitude</label><div style={vl}>{proofModal.proof.gpsLongitude}</div></div>
                <div><label style={lb}>Distance from Pin</label><div style={{ ...vl, color: proofModal.withinGeofence ? "#10b981" : "#ef4444" }}>{proofModal.proof.distanceFromOfficialPinMeters}m {proofModal.withinGeofence ? "✓ Within" : "✗ Outside"}</div></div>
                <div><label style={lb}>Sentinel Result</label><div style={vl}><span style={getStatusStyle(proofModal.proof.sentinelResult)}>{proofModal.proof.sentinelResult}</span></div></div>
                <div><label style={lb}>Site Photo</label><div style={vl}>{proofModal.proof.uploadedProofs?.sitePhoto ? "✓" : "✗"}</div></div>
                <div><label style={lb}>Material Receipt</label><div style={vl}>{proofModal.proof.uploadedProofs?.materialReceipt ? "✓" : "✗"}</div></div>
                <div><label style={lb}>Completion Cert</label><div style={vl}>{proofModal.proof.uploadedProofs?.completionCertificate ? "✓" : "✗"}</div></div>
                {proofModal.proof.ipfsPhotoUrl && <div><label style={lb}>IPFS Photo</label><div style={vl}><a href={proofModal.proof.ipfsPhotoUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>View</a></div></div>}
                {proofModal.proof.sentinelReasons?.length > 0 && (
                  <div style={{ gridColumn: "1/3" }}>
                    <label style={lb}>Flag Reasons</label>
                    {proofModal.proof.sentinelReasons.map((r, i) => <div key={i} style={{ fontSize: 12, color: "#ef4444", padding: "2px 0" }}>⚠ {r}</div>)}
                  </div>
                )}
              </div>
            ) : <div style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>No proof submitted yet</div>}
          </div>
        </div>
      )}
    </div>
  );
};

const lb = { fontSize: 11, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 2 };
const vl = { fontSize: 13, fontWeight: 500, color: "#1e293b" };

const s = {
  container: { fontFamily: "'Sora', sans-serif", background: '#f8fafc', minHeight: '100vh' },
  content: { padding: '24px 28px' },
  projectHeader: { background: 'white', borderRadius: 14, padding: '20px 24px', border: '1px solid #e2e8f0', marginBottom: 24 },
  headerTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 14 },
  projectStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  projStat: { background: '#f8fafc', borderRadius: 10, padding: 14 },
  label: { fontSize: 11, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' },
  value: { fontSize: 16, fontWeight: 700, color: '#1e293b', marginTop: 4 },
  card: { background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0', marginBottom: 20 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 18 },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '14px', fontSize: 13, color: '#1e293b', borderBottom: '1px solid #f1f5f9' },
  btnView: { padding: '5px 14px', background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: 12 },
  btnRelease: { padding: '5px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: 12 },
};

export default FundRelease;
