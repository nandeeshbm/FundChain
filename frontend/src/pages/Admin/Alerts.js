import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const AlertsModule = () => {
  const navigate = useNavigate();
  const [flagged, setFlagged] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [freezeLogs, setFreezeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ high: 0, medium: 0, low: 0, resolved: 0 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [flagRes, auditRes, freezeRes] = await Promise.all([
          axios.get(`${API}/auditor/flagged-transactions?limit=20`, authHeader()),
          axios.get(`${API}/transactions?limit=10`, authHeader()),
          axios.get(`${API}/admin/audit-logs?action=PROJECT_FROZEN&limit=10`, authHeader()),
        ]);
        if (flagRes.data.success) {
          const items = flagRes.data.data;
          setFlagged(items);
          setCounts({
            high: items.length,
            medium: 0,
            low: 0,
            resolved: auditRes.data.data?.filter(t => t.sentinelStatus === 'success').length || 0,
          });
        }
        if (auditRes.data.success) setAuditLogs(auditRes.data.data);
        if (freezeRes.data.success) setFreezeLogs(freezeRes.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const timeAgo = (d) => {
    const secs = Math.floor((Date.now() - new Date(d)) / 1000);
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return new Date(d).toLocaleDateString('en-IN');
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading alerts...</div>;

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", padding: 24, background: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>🚨 Security Alerts & Anomaly Monitor</h1>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'High Priority', value: counts.high, color: '#ef4444', bg: '#fef2f2' },
          { label: 'Medium Risk', value: counts.medium, color: '#d97706', bg: '#fffbeb' },
          { label: 'Low Risk', value: counts.low, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Resolved', value: counts.resolved, color: '#16a34a', bg: '#f0fdf4' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ marginTop: 8, padding: '3px 10px', display: 'inline-block', borderRadius: 12, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600 }}>
              {s.value > 0 ? 'Action Required' : 'All Clear'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Active Flagged Table */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Active AI-Flagged Anomalies</span>
            {flagged.length > 0 && <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{flagged.length} Open</span>}
          </div>
          {flagged.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#10b981', fontWeight: 600 }}>✅ No active anomalies detected</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Txn ID', 'Project', 'Amount', 'Priority', 'Vault Status', 'Time', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flagged.map((item) => (
                  <tr key={item._id}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 11, color: '#ef4444', fontWeight: 700 }}>{item.txnId}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>{item.projectNameSnapshot || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>₹ {Number(item.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: '#fef2f2', color: '#dc2626' }}>🔴 High</span></td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: '#fef2f2', color: '#dc2626' }}>Frozen</span></td>
                    <td style={{ padding: '12px 16px', fontSize: 11, color: '#94a3b8' }}>{timeAgo(item.createdAt)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => navigate(`/admin/projects/${item.projectId?.projectId || ''}`)}
                        disabled={!item.projectId?.projectId}
                        style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: 11, cursor: item.projectId?.projectId ? 'pointer' : 'not-allowed', opacity: item.projectId?.projectId ? 1 : 0.5 }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          {/* Auditor Freeze Notifications */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 14 }}>
              🧾 Auditor Freeze Notifications
            </div>
            <div style={{ padding: 16 }}>
              {freezeLogs.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>No recent freeze actions</div>
              ) : freezeLogs.map((log) => (
                <div key={log._id} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>🚨 Vault Frozen</div>
                  <div style={{ fontSize: 12, color: '#1e293b', marginTop: 6 }}>{log.reason || 'Auditor froze a project vault'}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{timeAgo(log.createdAt)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 14 }}>
              🔒 24/7 Security Guard Log
            </div>
            <div style={{ padding: 16 }}>
              {auditLogs.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>No recent activity</div>
              ) : auditLogs.map((log) => (
                <div key={log._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: log.sentinelStatus === 'flagged' ? '#ef4444' : '#10b981' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
                      {log.sentinelStatus === 'flagged' ? '🚨 Sentinel Flag' : '✅ Clean Transaction'} — {log.type}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{log.projectNameSnapshot} · {timeAgo(log.createdAt)}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>₹ {Number(log.amount).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsModule;
