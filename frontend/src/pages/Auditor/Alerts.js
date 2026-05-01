import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function AuditorAlerts() {
  const [flagged, setFlagged] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [resolving, setResolving] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [f, t] = await Promise.all([
          axios.get(`${API}/auditor/flagged-transactions?limit=50`, authHeader()),
          axios.get(`${API}/transactions?limit=50`, authHeader()),
        ]);
        if (f.data.success) setFlagged(f.data.data || []);
        if (t.data.success) setAll(t.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const resolve = async (status) => {
    if (!note.trim()) return alert('Enter a resolution note first');
    setResolving(true);
    try {
      await axios.post(`${API}/auditor/transactions/${selected.txnId}/resolve`, { resolutionStatus: status, resolutionNote: note }, authHeader());
      setSelected(null); setNote('');
      const f = await axios.get(`${API}/auditor/flagged-transactions?limit=50`, authHeader());
      if (f.data.success) setFlagged(f.data.data || []);
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed';
      const details = e.response?.data?.errors?.join('\n');
      alert(details ? `${msg}\n\n${details}` : msg);
    }
    finally { setResolving(false); }
  };

  const fmt = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;
  const timeAgo = (d) => {
    if (!d) return '—';
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return new Date(d).toLocaleDateString('en-IN');
  };

  const displayed = filter === 'flagged' ? flagged : filter === 'all_txn' ? all : flagged;
  const highCount = flagged.filter(f => (f.sentinelReasons?.length || 0) >= 2).length;
  const medCount  = flagged.filter(f => (f.sentinelReasons?.length || 0) === 1).length;
  const resolvedCount = all.filter(t => t.status === 'success').length;

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Alerts...</div>;

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '🚨', label: 'High Priority', val: highCount, bg: '#fee2e2', col: '#ef4444' },
          { icon: '⚠️', label: 'Medium Priority', val: medCount, bg: '#ffedd5', col: '#f59e0b' },
          { icon: '📋', label: 'Total Flagged', val: flagged.length, bg: '#dbeafe', col: '#2563eb' },
          { icon: '✅', label: 'Resolved', val: resolvedCount, bg: '#f0fdf4', col: '#10b981' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.col }}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['flagged', '🚩 Flagged'], ['all_txn', '📋 All Transactions']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              borderColor: filter === k ? '#ef4444' : '#e2e8f0',
              background: filter === k ? '#ef4444' : 'white',
              color: filter === k ? 'white' : '#64748b' }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1.2fr 1fr' : '1fr', gap: 20 }}>
        {/* Table */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Txn ID', 'Project', 'Type', 'Amount', 'Sentinel', 'Status', 'Time', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, color: '#94a3b8', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                  No alerts — system is clean
                </td></tr>
              ) : displayed.map(t => {
                const isFl = t.sentinelStatus === 'flagged' || t.status === 'flagged';
                return (
                  <tr key={t._id} style={{ borderBottom: '1px solid #f1f5f9', background: selected?._id === t._id ? '#eff6ff' : 'white' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 11, color: '#2563eb', fontWeight: 700 }}>{t.txnId}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.projectNameSnapshot || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748b', textTransform: 'capitalize' }}>{(t.type || '').replace('_', ' ')}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 700 }}>{fmt(t.amount)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700,
                        background: isFl ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                        color: isFl ? '#ef4444' : '#10b981' }}>
                        {t.sentinelStatus || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700,
                        background: t.status === 'success' ? 'rgba(16,185,129,0.1)' : t.status === 'flagged' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        color: t.status === 'success' ? '#10b981' : t.status === 'flagged' ? '#ef4444' : '#f59e0b' }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#94a3b8' }}>{timeAgo(t.createdAt)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => { setSelected(t); setNote(''); }}
                        style={{ padding: '5px 12px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                        👁️ Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Review panel */}
        {selected && (
          <div style={{ background: 'white', borderRadius: 14, border: '2px solid #2563eb', padding: 20, position: 'sticky', top: 24, alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>🔍 Review Panel</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>
            {[
              ['Txn ID', selected.txnId],
              ['Project', selected.projectNameSnapshot],
              ['Type', (selected.type || '').replace('_', ' ')],
              ['Amount', fmt(selected.amount)],
              ['Sentinel', selected.sentinelStatus],
              ['Status', selected.status],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>{k}</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{v || '—'}</span>
              </div>
            ))}
            {selected.sentinelReasons?.length > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: 12, marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>🚩 Flag Reasons</div>
                {selected.sentinelReasons.map((r, i) => <div key={i} style={{ fontSize: 11, color: '#475569', padding: '2px 0' }}>• {r}</div>)}
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Resolution Note * (min 2 chars)</div>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Enter reason for this decision..."
                style={{ width: '100%', padding: 10, border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, minHeight: 70, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button disabled={resolving} onClick={() => resolve('resolved')}
                style={{ flex: 1, padding: 10, background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
                ✅ Approve
              </button>
              <button disabled={resolving} onClick={() => resolve('frozen')}
                style={{ flex: 1, padding: 10, background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
                🔒 Freeze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
