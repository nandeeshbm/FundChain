import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const fmt = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;

export default function ContractorProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/admin/projects`, authHeader());
        if (res.data.success) setProjects(res.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const statusStyle = (s) => {
    const map = {
      active:       { bg: 'rgba(16,185,129,0.1)',  color: '#10b981' },
      in_progress:  { bg: 'rgba(37,99,235,0.1)',   color: '#2563eb' },
      completed:    { bg: 'rgba(16,185,129,0.15)', color: '#059669' },
      planning:     { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
      flagged:      { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
    };
    return map[s] || { bg: '#f1f5f9', color: '#94a3b8' };
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#94a3b8' }}>
      Loading projects...
    </div>
  );

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>Assigned Projects</h2>
        <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>All public infrastructure projects you are associated with</p>
      </div>

      {projects.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏗️</div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>No projects assigned yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Contact your admin to be assigned to a project</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {projects.map(p => {
            const sc = statusStyle(p.status);
            return (
              <div key={p._id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                {/* Left: icon */}
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏗️</div>
                
                {/* Middle: details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: '#2563eb', background: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: 6 }}>{p.projectId}</span>
                    <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{p.projectName}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{p.department}</div>
                  
                  {/* Progress bar */}
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 5 }}>
                      <span>Milestone Progress</span>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{p.progress || 0}%</span>
                    </div>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.progress || 0}%`, background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: 4, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                </div>

                {/* Right: budget */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Budget</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{fmt(p.totalBudget)}</div>
                  <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>Released: {fmt(p.releasedAmount)}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Remaining: {fmt(p.remainingAmount)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
