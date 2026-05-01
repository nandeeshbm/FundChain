import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const ReviewsLedger = () => {
  const [auditHistory, setAuditHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 20 });
        if (statusFilter) params.append('status', statusFilter);
        const res = await axios.get(`${API}/transactions?${params}`, authHeader());
        if (res.data.success) {
          setAuditHistory(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [page, statusFilter]);

  const filtered = auditHistory.filter(t =>
    (t.txnId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.projectNameSnapshot || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const theme = {
    blueLight: '#2563eb', green: '#10b981', amber: '#f59e0b', red: '#ef4444',
    gray50: '#f8fafc', gray100: '#f1f5f9', gray200: '#e2e8f0', gray600: '#475569', text: '#1e293b',
  };

  const badge = (status) => {
    const base = { padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 };
    if (status === 'success') return { ...base, background: 'rgba(16,185,129,0.1)', color: theme.green };
    if (status === 'flagged') return { ...base, background: 'rgba(239,68,68,0.1)', color: theme.red };
    if (status === 'pending') return { ...base, background: 'rgba(245,158,11,0.1)', color: theme.amber };
    if (status === 'failed') return { ...base, background: 'rgba(239,68,68,0.1)', color: theme.red };
    return { ...base, background: 'rgba(148,163,184,0.1)', color: theme.gray600 };
  };

  const sentinelBadge = (s) => {
    const base = { padding: '3px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600 };
    if (s === 'flagged') return { ...base, background: 'rgba(239,68,68,0.1)', color: theme.red };
    if (s === 'success') return { ...base, background: 'rgba(16,185,129,0.1)', color: theme.green };
    return { ...base, background: 'rgba(148,163,184,0.1)', color: theme.gray600 };
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Audit Ledger...</div>;

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: theme.gray50, minHeight: '100vh', padding: '24px 28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>Audit Reviews & Governance Ledger</h1>
        <div style={{ fontSize: 13, color: theme.gray600 }}>Total: {pagination.total} records</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 14 }}>🔍</span>
          <input type="text" placeholder="Search by Txn ID or Project..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 38px', border: `1.5px solid ${theme.gray200}`, borderRadius: 10, outline: 'none', fontSize: 13 }} />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${theme.gray200}`, outline: 'none', cursor: 'pointer', fontSize: 13 }}>
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: `1px solid ${theme.gray200}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Txn ID', 'Project', 'Amount', 'Type', 'Status', 'Sentinel', 'Date', 'Action'].map(h => (
                <th key={h} style={{ background: theme.gray50, padding: '13px 16px', textAlign: 'left', fontSize: 11, color: theme.gray600, textTransform: 'uppercase', borderBottom: `1px solid ${theme.gray200}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 30, textAlign: 'center', color: '#94a3b8' }}>No records found</td></tr>
            ) : filtered.map((item) => (
              <tr key={item._id}>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: theme.blueLight, fontSize: 11, borderBottom: `1px solid ${theme.gray100}` }}>{item.txnId}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${theme.gray100}` }}>{item.projectNameSnapshot}</td>
                <td style={{ padding: '14px 16px', fontSize: 12, fontWeight: 600, borderBottom: `1px solid ${theme.gray100}` }}>₹ {Number(item.amount).toLocaleString('en-IN')}</td>
                <td style={{ padding: '14px 16px', fontSize: 12, borderBottom: `1px solid ${theme.gray100}` }}>{item.type}</td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.gray100}` }}><span style={badge(item.status)}>{item.status}</span></td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.gray100}` }}><span style={sentinelBadge(item.sentinelStatus)}>{item.sentinelStatus}</span></td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: theme.gray600, borderBottom: `1px solid ${theme.gray100}` }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.gray100}` }}>
                  <button style={{ padding: '6px 14px', background: 'rgba(37,99,235,0.08)', color: theme.blueLight, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderTop: `1px solid ${theme.gray200}` }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Page {page} of {pagination.totalPages}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              style={{ padding: '4px 12px', border: `1px solid ${theme.gray200}`, background: 'white', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>‹</button>
            <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}
              style={{ padding: '4px 12px', border: `1px solid ${theme.gray200}`, background: 'white', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsLedger;
