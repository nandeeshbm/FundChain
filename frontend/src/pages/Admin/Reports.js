import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const fmt = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;

const ReportsModule = () => {
  const [stats, setStats] = useState({ totalProjects: 0, totalBudget: 0, totalReleased: 0, totalRemaining: 0 });
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [byStatus, setByStatus] = useState({ active: 0, in_progress: 0, completed: 0, planning: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, projRes, txnRes] = await Promise.all([
          axios.get(`${API}/admin/dashboard-stats`, authHeader()),
          axios.get(`${API}/admin/projects?limit=50`, authHeader()),
          axios.get(`${API}/transactions?limit=10`, authHeader()),
        ]);
        if (dashRes.data.success) setStats(dashRes.data.data.stats);
        if (projRes.data.success) {
          const p = projRes.data.data;
          setProjects(p);
          const statusCount = { active: 0, in_progress: 0, completed: 0, planning: 0 };
          p.forEach(proj => { if (statusCount[proj.status] !== undefined) statusCount[proj.status]++; });
          setByStatus(statusCount);
        }
        if (txnRes.data.success) setTransactions(txnRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const utilPct = stats.totalBudget > 0 ? Math.round((stats.totalReleased / stats.totalBudget) * 100) : 0;
  const maxBarCount = Math.max(byStatus.active, byStatus.in_progress, byStatus.completed, byStatus.planning, 1);

  const handleDownloadCSV = () => {
    const headers = ['Project ID', 'Name', 'Department', 'Budget', 'Released', 'Status', 'Progress'];
    const rows = projects.map(p => [p.projectId, p.projectName, p.department, p.totalBudget, p.releasedAmount, p.status, `${p.progress || 0}%`]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `report_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading reports...</div>;

  const barColors = { active: '#2563eb', in_progress: '#f59e0b', completed: '#10b981', planning: '#94a3b8' };

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", padding: 24, background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>📈 Analytics & Reports</h1>
        <button onClick={handleDownloadCSV} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
          ⬇ Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Projects', value: stats.totalProjects, icon: '📄', color: '#eff6ff' },
          { label: 'Total Budget', value: fmt(stats.totalBudget), icon: '💰', color: '#f5f3ff' },
          { label: 'Funds Released', value: fmt(stats.totalReleased), icon: '✅', color: '#f0fdf4' },
          { label: 'Remaining Vault', value: fmt(stats.totalRemaining), icon: '🏦', color: '#fff7ed' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Donut */}
        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Fund Utilization</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="48" fill="none" stroke="#e2e8f0" strokeWidth="18" />
                <circle cx="60" cy="60" r="48" fill="none" stroke="#2563eb" strokeWidth="18"
                  strokeDasharray={`${(utilPct / 100) * 301} 301`} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1e293b' }}>{utilPct}%</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>UTILIZED</div>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb' }} />
                <div style={{ fontSize: 12 }}>Released: {fmt(stats.totalReleased)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e2e8f0' }} />
                <div style={{ fontSize: 12 }}>Remaining: {fmt(stats.totalRemaining)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart by Status */}
        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Projects by Status</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 100 }}>
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{count}</div>
                <div style={{ width: '100%', height: `${Math.round((count / maxBarCount) * 80)}px`, minHeight: 4, background: barColors[status], borderRadius: '4px 4px 0 0' }} />
                <div style={{ fontSize: 10, color: '#64748b', textTransform: 'capitalize' }}>{status.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 14 }}>Project Wise Report</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'Project Name', 'Department', 'Budget', 'Released', 'Progress', 'Status'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No projects yet. Create one in Projects tab.</td></tr>
            ) : projects.map(p => (
              <tr key={p._id}>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: '#2563eb' }}>{p.projectId}</td>
                <td style={{ padding: '12px 16px', fontWeight: 500, fontSize: 13 }}>{p.projectName}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{p.department}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600 }}>{fmt(p.totalBudget)}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#10b981', fontWeight: 600 }}>{fmt(p.releasedAmount)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.progress || 0}%`, background: '#2563eb', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, width: 30 }}>{p.progress || 0}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: p.status === 'completed' ? 'rgba(16,185,129,0.1)' : p.status === 'active' ? 'rgba(37,99,235,0.1)' : 'rgba(245,158,11,0.1)', color: p.status === 'completed' ? '#10b981' : p.status === 'active' ? '#2563eb' : '#f59e0b' }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Log */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 14 }}>Recent Transactions</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Txn ID', 'Project', 'Amount', 'Type', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No transactions yet.</td></tr>
            ) : transactions.map(t => (
              <tr key={t._id}>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 11, color: '#2563eb', fontWeight: 700 }}>{t.txnId}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{t.projectNameSnapshot}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>{fmt(t.amount)}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{t.type}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: t.status === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: t.status === 'success' ? '#10b981' : '#ef4444' }}>{t.status}</span></td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsModule;
