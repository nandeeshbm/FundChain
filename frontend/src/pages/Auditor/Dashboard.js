import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const AuditorDashboard = () => {
  const [stats, setStats] = useState({ totalProjects: 0, totalTransactions: 0, flagged: 0, approved: 0 });
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flagRes, auditRes] = await Promise.all([
          axios.get(`${API}/auditor/flagged-transactions?limit=5`, authHeader()),
          axios.get(`${API}/transactions?limit=5`, authHeader()),
        ]);
        if (flagRes.data.success) {
          setFlaggedItems(flagRes.data.data);
          setStats(s => ({ ...s, flagged: flagRes.data.pagination.total }));
        }
        if (auditRes.data.success) {
          setAuditLogs(auditRes.data.data);
          setStats(s => ({ ...s, totalTransactions: auditRes.data.pagination.total }));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Sentinel Dashboard...</div>;

  return (
    <div style={styles.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>
      <div style={styles.content}>
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Active Projects', value: stats.totalProjects, color: '#1e293b' },
            { label: 'Total Transactions', value: stats.totalTransactions, color: '#1e293b' },
            { label: 'Anomalies Flagged', value: stats.flagged, color: '#ef4444' },
            { label: 'Clean Transactions', value: Math.max(0, stats.totalTransactions - stats.flagged), color: '#10b981' },
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={styles.grid2}>
          {/* Real-Time Alerts */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>🚨 Real-Time Security Alerts</span>
              <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>{flaggedItems.length} FLAGGED</span>
            </div>
            {flaggedItems.length === 0 ? (
              <div style={{ color: '#10b981', textAlign: 'center', padding: 20, fontSize: 13 }}>✅ No anomalies detected</div>
            ) : flaggedItems.map((item) => (
              <div key={item._id} style={styles.flaggedItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={styles.flaggedId}>{item.txnId} — {item.sentinelStatus === 'flagged' ? 'Sentinel Flag' : 'Status Flag'}</div>
                    <div style={styles.flaggedProj}>{item.projectNameSnapshot || item.projectId?.projectName}</div>
                    <div style={styles.flaggedDate}>{new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span style={styles.flaggedBadge}>🚩 High Risk</span>
                </div>
              </div>
            ))}
          </div>

          {/* Vault Integrity Overview */}
          <div style={styles.card}>
            <div style={styles.cardHeader}><span style={styles.cardTitle}>Vault Integrity Overview</span></div>
            <div style={styles.donutWrap}>
              <div style={styles.donut}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#f1f5f9" strokeWidth="18" />
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#10b981" strokeWidth="18" strokeDasharray="254" strokeDashoffset="0" />
                  {stats.flagged > 0 && <circle cx="60" cy="60" r="45" fill="none" stroke="#ef4444" strokeWidth="18" strokeDasharray={`${(stats.flagged / Math.max(stats.totalTransactions, 1)) * 283} 283`} strokeDashoffset="-254" opacity="0.9" />}
                </svg>
                <div style={styles.donutCenter}>
                  <div style={styles.donutPct}>{stats.totalTransactions}</div>
                  <div style={styles.donutSub}>Total</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <LegendItem color="#10b981" label="Clean" val={`${Math.max(0, stats.totalTransactions - stats.flagged)}`} />
                <LegendItem color="#ef4444" label="Flagged" val={`${stats.flagged}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={styles.card}>
          <div style={styles.cardHeader}><span style={styles.cardTitle}>Audit Ledger (Recent Transactions)</span></div>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Txn ID', 'Project', 'Amount', 'Type', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: '#64748b', textTransform: 'uppercase', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No transactions yet</td></tr>
              ) : auditLogs.map(t => (
                <tr key={t._id}>
                  <td style={styles.monospaceBlue}>{t.txnId}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12 }}>{t.projectNameSnapshot}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600 }}>₹ {Number(t.amount).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12 }}>{t.type}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ ...getStatusStyle(t.status) }}>{t.status}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#94a3b8' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const getStatusStyle = (s) => {
  const base = { display: 'inline-flex', padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600 };
  if (s === 'success') return { ...base, background: 'rgba(16,185,129,0.1)', color: '#10b981' };
  if (s === 'flagged') return { ...base, background: 'rgba(239,68,68,0.1)', color: '#ef4444' };
  return { ...base, background: 'rgba(245,158,11,0.1)', color: '#f59e0b' };
};

const LegendItem = ({ color, label, val }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
    <div>
      <div style={{ fontSize: 11, color: '#6b7280' }}>{label}</div>
      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 12 }}>{val}</div>
    </div>
  </div>
);

const styles = {
  container: { fontFamily: "'Sora', sans-serif", background: '#f8fafc', minHeight: '100vh' },
  content: { padding: '24px 28px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: 'white', borderRadius: 14, padding: 20, border: '1px solid #e2e8f0' },
  statLabel: { fontSize: 11, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' },
  statValue: { fontSize: 24, fontWeight: 700, color: '#1e293b', marginTop: 4 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
  card: { background: 'white', borderRadius: 14, padding: 20, border: '1px solid #e2e8f0', marginBottom: 20 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: '#1e293b' },
  flaggedItem: { padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 10 },
  flaggedId: { fontFamily: 'monospace', fontSize: 11, color: '#ef4444', fontWeight: 600 },
  flaggedProj: { fontSize: 13, fontWeight: 600, color: '#1e293b', marginTop: 2 },
  flaggedDate: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  flaggedBadge: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' },
  donutWrap: { display: 'flex', alignItems: 'center', gap: 20 },
  donut: { position: 'relative', width: 120, height: 120, flexShrink: 0 },
  donutCenter: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' },
  donutPct: { fontSize: 24, fontWeight: 700, color: '#1e293b' },
  donutSub: { fontSize: 10, color: '#94a3b8' },
  table: { width: '100%', borderCollapse: 'collapse' },
  monospaceBlue: { padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: '#2563eb' },
};

export default AuditorDashboard;
