import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const fmt = (n) => `INR ${Number(n || 0).toLocaleString("en-IN")}`;

const statusStyle = (status) => {
  const base = { padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700 };
  if (status === "completed") return { ...base, color: "#10b981", background: "rgba(16,185,129,0.12)" };
  if (status === "active") return { ...base, color: "#2563eb", background: "rgba(37,99,235,0.12)" };
  if (status === "in_progress") return { ...base, color: "#f59e0b", background: "rgba(245,158,11,0.12)" };
  if (status === "flagged") return { ...base, color: "#ef4444", background: "rgba(239,68,68,0.12)" };
  return { ...base, color: "#94a3b8", background: "rgba(148,163,184,0.12)" };
};

const AdminProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API}/admin/projects/${projectId}`, authHeader());
        if (res.data.success) {
          setProject(res.data.data.project);
          setMilestones(res.data.data.milestones || []);
          setTransactions(res.data.data.transactions || []);
        } else {
          setError(res.data.message || "Unable to load project details");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load project details");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading project...</div>;
  if (error) return <div style={{ padding: 40, textAlign: "center", color: "#ef4444" }}>{error}</div>;
  if (!project) return <div style={{ padding: 40, textAlign: "center", color: "#ef4444" }}>Project not found</div>;

  const progress = project.totalBudget > 0 ? Math.round((project.releasedAmount / project.totalBudget) * 100) : 0;
  const contractor = project.contractorId || {};

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
            {project.projectId} - {project.department || "Department"}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", margin: 0 }}>{project.projectName}</h1>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
            Contractor: {contractor.companyName || contractor.vendorName || "N/A"}
          </div>
        </div>
        <span style={statusStyle(project.status)}>{project.status || "unknown"}</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button
          onClick={() => navigate("/admin/projects")}
          style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", fontWeight: 600, cursor: "pointer" }}
        >
          Back to Projects
        </button>
        <button
          onClick={() => navigate(`/public/project-details/${project.projectId}`)}
          style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", fontWeight: 700, cursor: "pointer" }}
        >
          Open Public View
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Total Budget", value: fmt(project.totalBudget), color: "#1e293b" },
          { label: "Released", value: fmt(project.releasedAmount), color: "#10b981" },
          { label: "Remaining", value: fmt(project.remainingAmount), color: "#f59e0b" },
          { label: "Progress", value: `${progress}%`, color: "#2563eb" },
        ].map((item) => (
          <div key={item.label} style={{ background: "white", borderRadius: 12, padding: 18, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Project Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12, color: "#475569" }}>
            <div><strong>Status:</strong> {project.status || "N/A"}</div>
            <div><strong>Department:</strong> {project.department || "N/A"}</div>
            <div><strong>Created By:</strong> {project.createdBy?.name || "N/A"}</div>
            <div><strong>Created At:</strong> {project.createdAt ? new Date(project.createdAt).toLocaleDateString("en-IN") : "N/A"}</div>
            <div><strong>Contract Address:</strong> {project.contractAddress || "N/A"}</div>
            <div><strong>Network:</strong> {project.contractNetwork || "N/A"}</div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Contractor</div>
          <div style={{ fontSize: 12, color: "#475569", display: "grid", gap: 8 }}>
            <div><strong>Company:</strong> {contractor.companyName || contractor.vendorName || "N/A"}</div>
            <div><strong>Registry ID:</strong> {contractor.registryId || "N/A"}</div>
            <div><strong>Email:</strong> {contractor.email || "N/A"}</div>
            <div><strong>Phone:</strong> {contractor.phone || "N/A"}</div>
            <div><strong>Wallet:</strong> {contractor.walletAddress || "N/A"}</div>
          </div>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", fontWeight: 700, fontSize: 14 }}>Milestones</div>
        {milestones.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>No milestones found</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Phase", "Title", "Amount", "Status", "Deadline", "Released"].map((h) => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#94a3b8", background: "#f8fafc", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) => (
                <tr key={m._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700 }}>{m.phaseNumber}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12 }}>{m.title}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700 }}>{fmt(m.amount)}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12 }}>{m.status}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12 }}>{m.estimatedDeadline ? new Date(m.estimatedDeadline).toLocaleDateString("en-IN") : "N/A"}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12 }}>{m.actualReleaseDate ? new Date(m.actualReleaseDate).toLocaleDateString("en-IN") : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", fontWeight: 700, fontSize: 14 }}>Recent Transactions</div>
        {transactions.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>No transactions found</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Txn ID", "Type", "Amount", "Status", "Sentinel", "Date"].map((h) => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#94a3b8", background: "#f8fafc", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 11, color: "#2563eb", fontWeight: 700 }}>{t.txnId}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12 }}>{(t.type || "").replace("_", " ")}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700 }}>{fmt(t.amount)}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12 }}>{t.status || "N/A"}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12 }}>{t.sentinelStatus || "N/A"}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12 }}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-IN") : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProjectDetails;
