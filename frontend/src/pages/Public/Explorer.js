import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const Explorer = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projRes, txnRes] = await Promise.all([
          axios.get(`${API}/public/projects?page=${page}&limit=6&search=${search}`),
          axios.get(`${API}/public/transactions?limit=5`),
        ]);
        if (projRes.data.success) {
          setProjects(projRes.data.data);
          setPagination(projRes.data.pagination);
        }
        if (txnRes.data.success) setTransactions(txnRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const fmt = (n) => `₹ ${Number(n).toLocaleString('en-IN')}`;

  const statusColor = (s) => {
    if (s === 'completed') return '#10b981';
    if (s === 'in_progress') return '#2563eb';
    return '#f59e0b';
  };

  const totalBudget = projects.reduce((s, p) => s + p.totalBudget, 0);
  const totalReleased = projects.reduce((s, p) => s + p.releasedAmount, 0);
  const utilPct = totalBudget > 0 ? Math.round((totalReleased / totalBudget) * 100) : 0;

  return (
    <div style={styles.container}>
      {/* Hero */}
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroH1}>Transparency. <span style={{ color: '#f59e0b' }}>Accountability.</span> Trust.</h1>
          <p style={styles.heroP}>Monitor public fund utilization in real-time. Every Rupee secured by the Robotic Bank Vault.</p>
        </div>
        <div style={{ fontSize: 100, opacity: 0.15 }}>🏗️</div>
      </header>

      {/* Search */}
      <div style={styles.searchSection}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input type="text" placeholder="Search by Project Name or ID..." style={styles.searchInput} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      <main style={styles.mainContent}>
        {/* Projects */}
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Active Infrastructure Assets ({pagination.total} total)</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No projects found. {search && `Try clearing search.`}</div>
        ) : (
          <div style={styles.projectsGrid}>
            {projects.map((p) => (
              <div key={p.projectId} style={styles.projCard} onClick={() => navigate(`/public/project-details/${p.projectId}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: '#2563eb' }}>{p.projectId}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 12, background: `${statusColor(p.status)}15`, color: statusColor(p.status), fontWeight: 600 }}>{p.status}</span>
                </div>
                <div style={styles.projName}>{p.projectName}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{p.department} • {p.contractorId?.companyName || 'N/A'}</div>
                <div style={styles.projBudgetLabel}>Authorized Budget</div>
                <div style={styles.projBudget}>{fmt(p.totalBudget)}</div>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${p.progress || 0}%`, background: statusColor(p.status) }} />
                </div>
                <div style={styles.projFooter}>
                  <span style={styles.projPct}>{p.progress || 0}% Progress</span>
                  <button style={styles.btnView} onClick={e => { e.stopPropagation(); navigate(`/public/project-details/${p.projectId}`); }}>View Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '20px 0' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer' }}>‹</button>
            <span style={{ padding: '6px 12px', fontSize: 13, color: '#64748b' }}>Page {page} of {pagination.totalPages}</span>
            <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer' }}>›</button>
          </div>
        )}

        <div style={styles.bottomGrid}>
          {/* Vault Utilization */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Global Vault Utilization</div>
            <div style={styles.donutWrap}>
              <div style={styles.donut}>
                <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="55" cy="55" r="40" fill="none" stroke="#e2e8f0" strokeWidth="18" />
                  <circle cx="55" cy="55" r="40" fill="none" stroke="#2563eb" strokeWidth="18"
                    strokeDasharray={`${(utilPct / 100) * 251} 251`} strokeLinecap="round" />
                </svg>
                <div style={styles.donutCenter}>
                  <div style={styles.donutPct}>{utilPct}%</div>
                  <div style={styles.donutSub}>UTILIZED</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb' }} />
                  <div style={{ fontSize: 13, color: '#64748b' }}>Released: {fmt(totalReleased)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e2e8f0' }} />
                  <div style={{ fontSize: 13, color: '#64748b' }}>Remaining: {fmt(Math.max(0, totalBudget - totalReleased))}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Verification Log */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Real-Time Transaction Log</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {transactions.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: 20 }}>No transactions yet</div>
              ) : transactions.map((t) => (
                <div key={t._id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 4, height: 40, borderRadius: 2, background: t.type === 'fund_release' ? '#10b981' : '#2563eb', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.type === 'fund_release' ? '💸' : '🔒'} {t.projectNameSnapshot}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{t.txnId} • {new Date(t.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#1e293b', flexShrink: 0 }}>{fmt(t.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { background: 'transparent', minHeight: '100vh', fontFamily: "'Sora', sans-serif" },
  hero: { background: 'linear-gradient(135deg, #0f1f3d 0%, #1e4db7 100%)', padding: '48px 40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  heroInner: { maxWidth: 700 },
  heroH1: { fontSize: 42, fontWeight: 800, marginBottom: 16, letterSpacing: '-1px' },
  heroP: { fontSize: 18, opacity: 0.85, lineHeight: 1.6 },
  searchSection: { padding: '0 40px', marginTop: -30 },
  searchWrap: { background: 'white', padding: '16px 24px', borderRadius: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 16 },
  searchIcon: { fontSize: 20, color: '#94a3b8' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: 16, fontWeight: 500 },
  mainContent: { padding: 40 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: '#1e293b' },
  projectsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, marginBottom: 40 },
  projCard: { background: 'white', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'box-shadow 0.2s' },
  projName: { fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 4 },
  projBudgetLabel: { fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginTop: 12 },
  projBudget: { fontSize: 22, fontWeight: 800, color: '#1e293b', marginTop: 4 },
  progressBar: { height: 8, background: '#f1f5f9', borderRadius: 4, margin: '16px 0', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  projFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  projPct: { fontSize: 13, color: '#64748b', fontWeight: 500 },
  btnView: { padding: '8px 16px', background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  bottomGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  card: { background: 'white', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0' },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 20 },
  donutWrap: { display: 'flex', alignItems: 'center', gap: 40 },
  donut: { position: 'relative', width: 110, height: 110 },
  donutCenter: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  donutPct: { fontSize: 20, fontWeight: 800, color: '#1e293b' },
  donutSub: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 },
};

export default Explorer;
