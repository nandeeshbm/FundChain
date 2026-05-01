import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function LiveMap() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/public/projects?limit=50`);
        if (res.data.success && res.data.data?.length > 0) {
          const valid = res.data.data.filter(p => p.officialLocation?.latitude && p.officialLocation?.longitude);
          setProjects(valid);
          if (valid.length > 0) setSelected(valid[0]);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const fmt = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;

  const mapUrl = selected
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${selected.officialLocation.longitude - 0.05},${selected.officialLocation.latitude - 0.05},${selected.officialLocation.longitude + 0.05},${selected.officialLocation.latitude + 0.05}&layer=mapnik&marker=${selected.officialLocation.latitude},${selected.officialLocation.longitude}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=72.70,19.00,73.00,19.30&layer=mapnik`;

  const statusColor = (s) => ({
    active: { bg: 'rgba(16,185,129,0.1)', col: '#10b981' },
    in_progress: { bg: 'rgba(37,99,235,0.1)', col: '#2563eb' },
    completed: { bg: 'rgba(16,185,129,0.15)', col: '#059669' },
  }[s] || { bg: '#f1f5f9', col: '#94a3b8' });

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>🗺️ Live Construction Map</h2>
        <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
          {loading ? 'Loading projects...' : projects.length === 0
            ? 'No active projects with GPS coordinates yet'
            : `${projects.length} active project${projects.length > 1 ? 's' : ''} on the map`}
        </p>
      </div>

      {projects.length === 0 && !loading ? (
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>No projects on the map yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Create a project with GPS coordinates to see it here</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, minHeight: '72vh' }}>
          {/* Map */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', background: '#fff' }}>
            <iframe
              key={selected?._id}
              title="live-construction-map"
              src={mapUrl}
              style={{ width: '100%', height: '100%', minHeight: 520, border: 'none' }}
              loading="lazy"
            />
          </div>

          {/* Sidebar */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, background: '#fff', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Active Projects</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 230, overflowY: 'auto' }}>
              {projects.map(p => {
                const sc = statusColor(p.status);
                return (
                  <button key={p._id} type="button" onClick={() => setSelected(p)}
                    style={{ textAlign: 'left', border: `1.5px solid ${selected?._id === p._id ? '#2563eb' : '#e2e8f0'}`,
                      borderRadius: 10, background: selected?._id === p._id ? '#eff6ff' : '#f8fafc',
                      padding: '10px 12px', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 12 }}>{p.projectName}</div>
                    <div style={{ color: '#64748b', fontSize: 11, marginTop: 3, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span>{p.projectId}</span>
                      <span style={{ padding: '1px 6px', borderRadius: 8, background: sc.bg, color: sc.col, fontSize: 10, fontWeight: 700 }}>{p.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {selected && (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, background: '#f8fafc', flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>{selected.projectName}</div>
                {[
                  ['Project ID', selected.projectId],
                  ['Department', selected.department],
                  ['Total Budget', fmt(selected.totalBudget)],
                  ['Released', fmt(selected.releasedAmount)],
                  ['Remaining', fmt(selected.remainingAmount)],
                  ['Lat/Lng', `${selected.officialLocation.latitude}°N, ${selected.officialLocation.longitude}°E`],
                  ['Radius', `${selected.allowedRadiusMeters || 500}m`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f1f5f9', fontSize: 11 }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>{k}</span>
                    <span style={{ fontWeight: 700, color: '#1e293b', textAlign: 'right', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</span>
                  </div>
                ))}

                {/* Progress */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>
                    <span>Progress</span>
                    <span>{selected.progress || 0}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${selected.progress || 0}%`, background: 'linear-gradient(90deg, #2563eb, #1d4ed8)', borderRadius: 4 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button type="button"
                    onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${selected.officialLocation.latitude}&mlon=${selected.officialLocation.longitude}#map=15/${selected.officialLocation.latitude}/${selected.officialLocation.longitude}`, '_blank')}
                    style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: 8, background: '#fff', padding: '9px 0', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                    🔗 Open Map
                  </button>
                  <a href={`/public/project-details/${selected.projectId}`}
                    style={{ flex: 1, border: 'none', borderRadius: 8, background: '#2563eb', color: '#fff', padding: '9px 0', cursor: 'pointer', fontWeight: 700, fontSize: 11, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    📋 Details
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
