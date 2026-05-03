import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const fmt = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;

const ReportsModule = () => {
  const [stats, setStats] = useState({ totalProjects: 0, totalBudget: 0, totalReleased: 0, totalRemaining: 0 });
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [issueReports, setIssueReports] = useState([]);
  const [reportArchives, setReportArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveError, setArchiveError] = useState('');
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [byStatus, setByStatus] = useState({ active: 0, in_progress: 0, completed: 0, planning: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, projRes, txnRes, issueRes, archiveRes] = await Promise.all([
          axios.get(`${API}/admin/dashboard-stats`, authHeader()),
          axios.get(`${API}/admin/projects?limit=50`, authHeader()),
          axios.get(`${API}/transactions?limit=10`, authHeader()),
          axios.get(`${API}/admin/report-issues?limit=50`, authHeader()),
          axios.get(`${API}/admin/report-archives?limit=20`, authHeader()),
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
        if (issueRes.data.success) setIssueReports(issueRes.data.data);
        if (archiveRes.data.success) setReportArchives(archiveRes.data.data);
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
    const a = document.createElement('a'); a.href = url; a.download = `project_report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadIssuesCSV = () => {
    const headers = ['Report ID', 'Project ID', 'Project Name', 'Observation', 'Description', 'Anonymous', 'Reporter Email', 'Status', 'Submitted At'];
    const rows = issueReports.map(r => [
      r._id,
      r.projectId,
      r.projectName,
      r.observation,
      r.description.replace(/\n/g, ' '),
      r.anonymous ? 'Yes' : 'No',
      r.reporterEmail || '',
      r.status,
      new Date(r.createdAt).toLocaleString('en-IN'),
    ]);
    const csv = [headers, ...rows].map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `issue_reports_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewArchive = async (archiveId) => {
    setArchiveLoading(true);
    setArchiveError('');
    try {
      const res = await axios.get(`${API}/admin/report-archives/${archiveId}`, authHeader());
      if (res.data.success) {
        setSelectedArchive(res.data.data);
      } else {
        setArchiveError('Unable to load archive details.');
      }
    } catch (err) {
      setArchiveError(err.response?.data?.message || 'Unable to load archive details.');
    } finally {
      setArchiveLoading(false);
    }
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

      {/* Issue Report Log */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', marginTop: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Recent Issue Reports</span>
          <button onClick={handleDownloadIssuesCSV} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
            ⬇ Export Issues
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Report ID', 'Project', 'Observation', 'Anonymous', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {issueReports.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No issue reports have been submitted yet.</td></tr>
            ) : issueReports.map((report) => (
              <tr key={report._id}>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 11, color: '#2563eb', fontWeight: 700 }}>{report._id.slice(-8)}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{report.projectName || report.projectId}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>{report.observation}</td>
                <td style={{ padding: '12px 16px', fontSize: 12 }}>{report.anonymous ? 'Yes' : 'No'}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: report.status === 'validated' ? 'rgba(16,185,129,0.12)' : report.status === 'dismissed' ? 'rgba(239,68,68,0.12)' : 'rgba(234,179,8,0.12)', color: report.status === 'validated' ? '#10b981' : report.status === 'dismissed' ? '#ef4444' : '#b45309' }}>{report.status}</span></td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{new Date(report.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Forensic Report Archives */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', marginTop: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 14 }}>
          Forensic Report Archives
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Archive ID', 'Generated By', 'Project Filter', 'Txns', 'Flagged', 'Date Range', 'Generated At', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportArchives.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No forensic reports generated yet.</td></tr>
            ) : reportArchives.map((archive) => (
              <tr key={archive._id}>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 11, color: '#2563eb', fontWeight: 700 }}>{archive._id.slice(-8)}</td>
                <td style={{ padding: '12px 16px', fontSize: 12 }}>
                  {archive.generatedBy?.name || 'Auditor'}
                  {archive.generatedBy?.email ? ` (${archive.generatedBy.email})` : ''}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12 }}>{archive.filterParameters?.projectId || 'All'}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600 }}>{archive.summary?.totalTransactions ?? 0}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#ef4444', fontWeight: 700 }}>{archive.summary?.flaggedTransactions ?? 0}</td>
                <td style={{ padding: '12px 16px', fontSize: 12 }}>
                  {(archive.filterParameters?.startDate || 'Any')}
                  {' → '}
                  {(archive.filterParameters?.endDate || 'Any')}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{new Date(archive.generatedAt || archive.createdAt).toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 16px', fontSize: 12 }}>
                  <button
                    onClick={() => handleViewArchive(archive._id)}
                    style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Archive Detail Modal */}
      {selectedArchive && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div style={{ width: 'min(1100px, 95vw)', maxHeight: '85vh', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Forensic Report Detail</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  {selectedArchive.reportName || 'Forensic Audit Report'} | Total Txns: {selectedArchive.summary?.totalTransactions ?? 0} | Flagged: {selectedArchive.summary?.flaggedTransactions ?? 0}
                </div>
              </div>
              <button onClick={() => setSelectedArchive(null)} style={{ padding: '6px 12px', background: '#e2e8f0', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                Close
              </button>
            </div>
            <div style={{ overflow: 'auto', padding: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Txn ID', 'Project ID', 'Project', 'Amount', 'Type', 'Status', 'Reason', 'Date'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, color: '#94a3b8', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(selectedArchive.transactionSnapshots || []).length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 18, textAlign: 'center', color: '#94a3b8' }}>No transaction snapshots found in this archive.</td>
                    </tr>
                  ) : (selectedArchive.transactionSnapshots || []).map((txn, idx) => (
                    <tr key={`${txn.txnId || 'txn'}-${idx}`}>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 11, color: '#2563eb', fontWeight: 700 }}>{txn.txnId || '—'}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12 }}>{txn.projectId || '—'}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12 }}>{txn.projectName || '—'}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, fontWeight: 600 }}>{fmt(txn.amount)}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12 }}>{txn.type || '—'}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: txn.status === 'flagged' || txn.sentinelStatus === 'flagged' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', color: txn.status === 'flagged' || txn.sentinelStatus === 'flagged' ? '#ef4444' : '#10b981' }}>
                          {(txn.status === 'flagged' || txn.sentinelStatus === 'flagged') ? 'Flagged' : (txn.status || '—')}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{txn.reason || '—'}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#94a3b8' }}>{txn.createdAt ? new Date(txn.createdAt).toLocaleString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {archiveLoading && (
        <div style={{ position: 'fixed', right: 20, bottom: 20, background: '#1e293b', color: '#fff', padding: '10px 14px', borderRadius: 10, fontSize: 12 }}>
          Loading archive details...
        </div>
      )}
      {archiveError && (
        <div style={{ position: 'fixed', right: 20, bottom: 20, background: '#ef4444', color: '#fff', padding: '10px 14px', borderRadius: 10, fontSize: 12 }}>
          {archiveError}
        </div>
      )}
    </div>
  );
};

export default ReportsModule;
