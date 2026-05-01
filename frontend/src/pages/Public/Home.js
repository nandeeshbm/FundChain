import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const PublicHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalBudget: 0, totalReleased: 0, totalProjects: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/public/projects?limit=3`);
        if (res.data.success) {
          const projects = res.data.data;
          setRecentProjects(projects);
          const totalBudget = projects.reduce((s, p) => s + p.totalBudget, 0);
          const totalReleased = projects.reduce((s, p) => s + p.releasedAmount, 0);
          setStats({ totalBudget, totalReleased, totalProjects: res.data.pagination.total });
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const fmt = (n) => `₹ ${Number(n).toLocaleString('en-IN')}`;

  const statusColor = (s) => {
    if (s === 'completed') return '#10b981';
    if (s === 'in_progress') return '#2563eb';
    return '#f59e0b';
  };

  return (
    <div style={styles.container}>
      {/* Hero */}
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>TRACKING PUBLIC FUNDS IN REAL-TIME</h1>
          <p style={styles.heroSub}>See Where Your Tax Money Goes — Secured by Blockchain</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={styles.heroBtn} onClick={() => navigate('/public/explorer')}>🔍 Explore Projects</button>
            <button style={{ ...styles.heroBtn, background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => navigate('/public/map')}>🗺️ Live Map</button>
          </div>
        </div>
      </header>

      {/* National Stats */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 LIVE NATIONAL STATISTICS</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>TOTAL BUDGET ALLOCATED</div>
            <div style={styles.statValue}>{loading ? '...' : fmt(stats.totalBudget)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>FUNDS RELEASED</div>
            <div style={{ ...styles.statValue, color: '#10b981' }}>{loading ? '...' : fmt(stats.totalReleased)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>TOTAL PROJECTS</div>
            <div style={styles.statValue}>{loading ? '...' : stats.totalProjects}</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ ...styles.section, background: '#f1f5f9', maxWidth: '100%', padding: '64px 10%' }}>
        <h2 style={styles.sectionTitle}>EXPLORE BY CATEGORY:</h2>
        <div style={styles.categoryGrid}>
          {[
            { icon: '🏗️', name: 'INFRASTRUCTURE', color: '#2563eb' },
            { icon: '💧', name: 'WATER SUPPLY', color: '#10b981' },
            { icon: '🎓', name: 'EDUCATION', color: '#7c3aed' },
            { icon: '🏥', name: 'HEALTHCARE', color: '#ef4444' },
            { icon: '🌾', name: 'AGRICULTURE', color: '#f59e0b' },
            { icon: '💼', name: 'OTHER', color: '#64748b' },
          ].map((cat, idx) => (
            <div key={idx} style={styles.categoryCard} onClick={() => navigate('/public/explorer')}>
              <div style={{ ...styles.categoryIcon, color: cat.color }}>{cat.icon}</div>
              <div style={styles.categoryName}>{cat.name}</div>
              <button style={{ ...styles.exploreBtn, color: cat.color }}>Explore →</button>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🔥 RECENTLY ACTIVE PROJECTS</h2>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading projects...</div>
        ) : recentProjects.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>No projects yet. Admin will create projects soon.</div>
        ) : (
          <div style={styles.projectGrid}>
            {recentProjects.map((proj) => (
              <div key={proj.projectId} style={styles.projectCard} onClick={() => navigate(`/public/project-details/${proj.projectId}`)}>
                <div style={{ ...styles.projectTag, background: statusColor(proj.status) }}>{proj.projectId}</div>
                <h3 style={styles.projectName}>{proj.projectName}</h3>
                <div style={styles.projectMeta}>Department: <strong>{proj.department}</strong></div>
                <div style={styles.projectMeta}>Budget: <strong>{fmt(proj.totalBudget)}</strong></div>
                <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, margin: '12px 0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: statusColor(proj.status), borderRadius: 3, width: `${proj.progress || 0}%` }} />
                </div>
                <div style={{ ...styles.projectStatus, color: statusColor(proj.status) }}>
                  {proj.progress || 0}% {proj.status}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button style={styles.viewAllBtn} onClick={() => navigate('/public/explorer')}>View All Projects →</button>
        </div>
      </section>

      {/* Transparency Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e4db7 100%)', padding: '60px 10%', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>🔒 Secured by Ethereum Blockchain</h2>
        <p style={{ opacity: 0.7, fontSize: 16, marginBottom: 24, maxWidth: 600, margin: '0 auto 24px' }}>Every fund release is verified by GPS geofencing, Tax API handshakes, and recorded permanently on the Sepolia blockchain.</p>
        <button style={styles.heroBtn} onClick={() => navigate('/public/explorer')}>Verify Transactions →</button>
      </section>
    </div>
  );
};

const styles = {
  container: { fontFamily: "'Sora', sans-serif", background: '#fff' },
  hero: { background: 'linear-gradient(135deg, #0f1f3d 0%, #1e4db7 100%)', padding: '80px 20px', color: 'white', textAlign: 'center' },
  heroInner: { maxWidth: 800, margin: '0 auto' },
  heroTitle: { fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' },
  heroSub: { fontSize: 18, opacity: 0.8, marginBottom: 32 },
  heroBtn: { background: '#f59e0b', color: '#0f1f3d', padding: '16px 32px', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 15px rgba(245,158,11,0.3)' },
  section: { padding: '64px 40px', maxWidth: 1200, margin: '0 auto' },
  sectionTitle: { fontSize: 14, fontWeight: 800, color: '#64748b', letterSpacing: '1px', marginBottom: 32, textTransform: 'uppercase' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  statCard: { background: 'white', padding: 32, borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  statLabel: { fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: 800, color: '#1e293b' },
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  categoryCard: { background: 'white', padding: 32, borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' },
  categoryIcon: { fontSize: 40, marginBottom: 16 },
  categoryName: { fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 16 },
  exploreBtn: { background: 'transparent', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
  projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  projectCard: { background: 'white', padding: 24, borderRadius: 20, border: '1px solid #e2e8f0', position: 'relative', cursor: 'pointer', transition: 'transform 0.2s' },
  projectTag: { position: 'absolute', top: 24, right: 24, padding: '4px 10px', borderRadius: 6, color: 'white', fontSize: 10, fontWeight: 700 },
  projectName: { fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 12, marginTop: 8 },
  projectMeta: { fontSize: 14, color: '#64748b', marginBottom: 6 },
  projectStatus: { fontSize: 13, fontWeight: 600 },
  viewAllBtn: { padding: '12px 24px', borderRadius: 10, border: '1px solid #2563eb', color: '#2563eb', background: 'transparent', fontWeight: 700, cursor: 'pointer' },
};

export default PublicHome;
