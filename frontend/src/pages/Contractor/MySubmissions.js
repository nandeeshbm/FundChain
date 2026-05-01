import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const statusColor = (s) => ({
  pending:    { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
  submitted:  { bg: 'rgba(37,99,235,0.1)',   color: '#2563eb' },
  verified:   { bg: 'rgba(16,185,129,0.1)',  color: '#10b981' },
  released:   { bg: 'rgba(16,185,129,0.15)', color: '#059669' },
  flagged:    { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
  rejected:   { bg: 'rgba(239,68,68,0.15)', color: '#dc2626' },
  in_progress:{ bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
}[s] || { bg: '#f1f5f9', color: '#94a3b8' });

export default function MySubmissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        // Contractor sees all transactions they are involved in
        const res = await axios.get(`${API}/transactions`, authHeader());
        if (res.data.success) setItems(res.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter || i.sentinelStatus === filter);

  const fmt = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;
  const timeAgo = (d) => {
    if (!d) return '—';
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return new Date(d).toLocaleDateString('en-IN');
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#94a3b8', fontSize: 15 }}>
      Loading submissions...
    </div>
  );

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>My Claim Submissions</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Track the status of your milestone proof submissions</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'success', 'pending', 'flagged'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                borderColor: filter === f ? '#f59e0b' : '#e2e8f0',
                background: filter === f ? '#f59e0b' : 'white',
                color: filter === f ? 'white' : '#64748b' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Claims', value: items.length, icon: '📋', color: '#2563eb', bg: '#eff6ff' },
          { label: 'Approved', value: items.filter(i => i.status === 'success').length, icon: '✅', color: '#10b981', bg: '#f0fdf4' },
          { label: 'Pending Review', value: items.filter(i => i.status === 'pending').length, icon: '⏳', color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Total Claimed', value: fmt(items.reduce((s, i) => s + (i.amount || 0), 0)), icon: '💰', color: '#6366f1', bg: '#f5f3ff' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: 20, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color, marginTop: 2 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Txn ID', 'Project', 'Type', 'Amount', 'Sentinel', 'Status', 'Submitted'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>No submissions yet</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Submit a milestone claim to see it here</div>
                </td>
              </tr>
            ) : filtered.map(item => {
              const sc = statusColor(item.sentinelStatus);
              const tc = statusColor(item.status);
              return (
                <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, color: '#2563eb', fontWeight: 700 }}>{item.txnId}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 500, color: '#1e293b', maxWidth: 180 }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.projectNameSnapshot || '—'}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{item.type?.replace('_', ' ')}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 13, color: '#1e293b' }}>{fmt(item.amount)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color }}>
                      {item.sentinelStatus || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.color }}>
                      {item.status || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>{timeAgo(item.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
