import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    projectName: "", department: "PWD", otherDepartmentName: "",
    contractorId: "", totalBudget: "",
    milestoneBreakdown: [
      { title: "", description: "", amount: "", estimatedDeadline: "" },
      { title: "", description: "", amount: "", estimatedDeadline: "" },
      { title: "", description: "", amount: "", estimatedDeadline: "" },
    ],
    officialLocation: { latitude: "", longitude: "" },
    allowedRadiusMeters: "500",
    requiredProofs: { sitePhoto: true, materialReceipt: true, completionCertificate: true },
  });

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API}/admin/projects?search=${search}`, authHeader());
      if (res.data.success) setProjects(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API}/admin/vendors`, authHeader());
      if (res.data.success) setVendors(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProjects(); }, [search]);

  const openModal = () => { fetchVendors(); setShowModal(true); };

  const updateMilestone = (idx, field, val) => {
    const m = [...form.milestoneBreakdown];
    m[idx] = { ...m[idx], [field]: val };
    setForm({ ...form, milestoneBreakdown: m });
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const payload = {
        ...form,
        totalBudget: Number(form.totalBudget),
        allowedRadiusMeters: Number(form.allowedRadiusMeters),
        officialLocation: {
          latitude: Number(form.officialLocation.latitude),
          longitude: Number(form.officialLocation.longitude),
        },
        milestoneBreakdown: form.milestoneBreakdown.map(m => ({
          ...m, amount: Number(m.amount),
        })),
      };
      const res = await axios.post(`${API}/admin/projects`, payload, authHeader());
      if (res.data.success) {
        setShowModal(false);
        fetchProjects();
        alert("Project created successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    } finally { setCreating(false); }
  };

  const getStatusStyle = (s) => ({
    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
    background: s === "active" ? "rgba(16,185,129,0.1)" : s === "in_progress" ? "rgba(37,99,235,0.1)" : "rgba(245,158,11,0.1)",
    color: s === "active" ? "#10b981" : s === "in_progress" ? "#2563eb" : "#f59e0b",
  });

  const fmt = (n) => `₹ ${Number(n).toLocaleString("en-IN")}`;

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ position: "relative", width: 280 }}>
          <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px 10px 38px", border: "1.5px solid #e2e8f0", borderRadius: 10, outline: "none" }} />
          <span style={{ position: "absolute", left: 12, top: 10 }}>🔍</span>
        </div>
        <button onClick={openModal} style={{ padding: "9px 18px", background: "#10b981", color: "white", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>+ New Project</button>
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Project ID", "Name", "Department", "Budget", "Status", "Progress"].map(h => (
                <th key={h} style={{ background: "#f8fafc", padding: "13px 16px", textAlign: "left", fontSize: 12, color: "#475569", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>No projects found</td></tr>
            ) : projects.map(p => (
              <tr key={p.projectId}>
                <td style={{ padding: "14px 16px", fontFamily: "monospace", color: "#2563eb", fontWeight: 600, borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>{p.projectId}</td>
                <td style={{ padding: "14px 16px", fontWeight: 600, borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>{p.projectName}</td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>{p.department}</td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>{fmt(p.totalBudget)}</td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}><span style={getStatusStyle(p.status)}>{p.status}</span></td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3 }}>
                      <div style={{ width: `${p.progress || 0}%`, background: "#2563eb", height: "100%", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{p.progress || 0}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: 700, maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Create New Project</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={lbl}>Project Name *</label>
                <input style={inp} value={form.projectName} onChange={e => setForm({...form, projectName: e.target.value})} />
              </div>
              <div>
                <label style={lbl}>Department *</label>
                <select style={inp} value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                  <option>PWD</option><option>Water Dept</option><option>Education</option><option>Others</option>
                </select>
              </div>
              {form.department === "Others" && <div><label style={lbl}>Other Dept Name</label><input style={inp} value={form.otherDepartmentName} onChange={e => setForm({...form, otherDepartmentName: e.target.value})} /></div>}
              <div>
                <label style={lbl}>Contractor *</label>
                <select style={inp} value={form.contractorId} onChange={e => setForm({...form, contractorId: e.target.value})}>
                  <option value="">Select contractor</option>
                  {vendors.map(v => <option key={v._id} value={v._id}>{v.companyName} ({v.registryId})</option>)}
                </select>
              </div>
              <div><label style={lbl}>Total Budget (₹) *</label><input style={inp} type="number" value={form.totalBudget} onChange={e => setForm({...form, totalBudget: e.target.value})} /></div>
              <div><label style={lbl}>Latitude *</label><input style={inp} type="number" step="any" value={form.officialLocation.latitude} onChange={e => setForm({...form, officialLocation: {...form.officialLocation, latitude: e.target.value}})} /></div>
              <div><label style={lbl}>Longitude *</label><input style={inp} type="number" step="any" value={form.officialLocation.longitude} onChange={e => setForm({...form, officialLocation: {...form.officialLocation, longitude: e.target.value}})} /></div>
              <div><label style={lbl}>Allowed Radius (m)</label><input style={inp} type="number" value={form.allowedRadiusMeters} onChange={e => setForm({...form, allowedRadiusMeters: e.target.value})} /></div>
            </div>

            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Milestones (3 Phases)</h4>
            {form.milestoneBreakdown.map((m, i) => (
              <div key={i} style={{ background: "#f8fafc", padding: 14, borderRadius: 10, marginBottom: 10, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 8 }}>Phase {i + 1}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><label style={lbl}>Title</label><input style={inp} value={m.title} onChange={e => updateMilestone(i, "title", e.target.value)} /></div>
                  <div><label style={lbl}>Amount (₹)</label><input style={inp} type="number" value={m.amount} onChange={e => updateMilestone(i, "amount", e.target.value)} /></div>
                  <div><label style={lbl}>Description</label><input style={inp} value={m.description} onChange={e => updateMilestone(i, "description", e.target.value)} /></div>
                  <div><label style={lbl}>Deadline</label><input style={inp} type="date" value={m.estimatedDeadline} onChange={e => updateMilestone(i, "estimatedDeadline", e.target.value)} /></div>
                </div>
              </div>
            ))}

            <button onClick={handleCreate} disabled={creating} style={{ width: "100%", padding: 14, background: "#2563eb", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 10 }}>
              {creating ? "Creating..." : "Deploy & Create Project"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

const lbl = { fontSize: 11, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 };
const inp = { width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none" };

export default ProjectList;
