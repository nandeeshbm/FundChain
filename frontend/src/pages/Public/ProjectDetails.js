import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API}/public/projects/${id}`);
        if (res.data.success) {
          setProject(res.data.data.project);
          setMilestones(res.data.data.milestones);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProject();
  }, [id]);

  const fmt = (n) => `₹ ${Number(n).toLocaleString('en-IN')}`;

  const statusColor = (s) => {
    if (s === 'released' || s === 'completed') return '#10b981';
    if (s === 'in_progress' || s === 'verified') return '#2563eb';
    if (s === 'flagged') return '#ef4444';
    return '#f59e0b';
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Loading project details...</div>;
  if (!project) return <div style={{ padding: 60, textAlign: 'center', color: '#ef4444' }}>Project not found</div>;

  const progress = project.totalBudget > 0 ? Math.round((project.releasedAmount / project.totalBudget) * 100) : 0;

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e4db7 100%)', padding: '40px', color: 'white' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>← Back</button>
          <button
            onClick={() => navigate(`/public/report-issue?projectId=${project.projectId}`)}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}
          >
            Report Issue
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>{project.projectId} · {project.department}</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{project.projectName}</h1>
            <div style={{ opacity: 0.7, fontSize: 14 }}>Contractor: {project.contractorId?.companyName || 'N/A'}</div>
          </div>
          <span style={{ background: `${statusColor(project.status)}25`, color: statusColor(project.status), padding: '6px 16px', borderRadius: 20, fontWeight: 600, fontSize: 13 }}>
            {project.status}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 28 }}>
        {/* Fund Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Budget', value: fmt(project.totalBudget), color: '#1e293b' },
            { label: 'Released', value: fmt(project.releasedAmount), color: '#10b981' },
            { label: 'Remaining', value: fmt(project.remainingAmount), color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Fund Utilization Progress</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>{progress}%</span>
          </div>
          <div style={{ height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #2563eb, #10b981)', borderRadius: 5, transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* Blockchain Info */}
        {project.contractAddress && (
          <div style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', marginBottom: 4 }}>🔗 On-Chain Escrow Vault</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#475569' }}>
              {project.contractAddress} ({project.contractNetwork})
            </div>
            <a href={`https://sepolia.etherscan.io/address/${project.contractAddress}`} target="_blank" rel="noreferrer"
              style={{ fontSize: 11, color: '#2563eb', textDecoration: 'none', marginTop: 4, display: 'inline-block' }}>
              View on Etherscan →
            </a>
          </div>
        )}

        {/* Milestones */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 14 }}>📋 Milestone Phases</div>
          {milestones.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: '#94a3b8' }}>No milestones found</div>
          ) : milestones.map((m) => (
            <div key={m._id} style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${statusColor(m.status)}15`, color: statusColor(m.status), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {m.phaseNumber}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  Budget: <strong>{fmt(m.amount)}</strong> · Deadline: {m.estimatedDeadline ? new Date(m.estimatedDeadline).toLocaleDateString() : 'N/A'}
                </div>
                {m.actualReleaseDate && (
                  <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>Released: {new Date(m.actualReleaseDate).toLocaleDateString()}</div>
                )}
              </div>
              <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${statusColor(m.status)}15`, color: statusColor(m.status) }}>
                {m.status}
              </span>
            </div>
          ))}
        </div>

        {/* Location Info */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, marginTop: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>📍 Official Project Location</div>
          <div style={{ fontSize: 13, color: '#475569' }}>
            {project.officialLocation?.latitude}° N, {project.officialLocation?.longitude}° E
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Geofence Radius: {project.allowedRadiusMeters}m</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
