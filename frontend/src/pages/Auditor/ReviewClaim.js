import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function ReviewClaim() {
  const [transactions, setTransactions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [note, setNote] = useState('');
  const [resolving, setResolving] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/transactions?limit=50`, authHeader());
        if (res.data.success) setTransactions(res.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const viewDetail = async (txn) => {
    setSelected(txn);
    setDetail(null);
    setNote('');
    setDetailLoading(true);
    try {
      const res = await axios.get(`${API}/auditor/transactions/${txn.txnId}/review`, authHeader());
      if (res.data.success) setDetail(res.data.data);
    } catch (err) { console.error(err); }
    finally { setDetailLoading(false); }
  };

  const resolve = async (status) => {
    if (!note.trim()) return alert('Enter a resolution note');
    setResolving(true);
    try {
      await axios.post(`${API}/auditor/transactions/${selected.txnId}/resolve`,
        { resolutionStatus: status, resolutionNote: note }, authHeader());
      alert(`✅ ${status === 'resolved' ? 'Approved' : 'Flagged'} successfully`);
      setSelected(null); setDetail(null); setNote('');
      const res = await axios.get(`${API}/transactions?limit=50`, authHeader());
      if (res.data.success) setTransactions(res.data.data || []);
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    finally { setResolving(false); }
  };

  const fmt = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;
  const filtered = filter === 'all' ? transactions
    : transactions.filter(t => t.sentinelStatus === filter || t.status === filter);

  const sc = (s) => ({
    flagged: { bg: 'rgba(239,68,68,0.1)', col: '#ef4444' },
    success: { bg: 'rgba(16,185,129,0.1)', col: '#10b981' },
    pending: { bg: 'rgba(245,158,11,0.1)', col: '#f59e0b' },
  }[s] || { bg: '#f1f5f9', col: '#94a3b8' });

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading transactions...</div>;

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: 0 }}>Transaction Audit & Forensic Review</h2>
        <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Click "View" to inspect any transaction and take resolution action</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['all', 'All'], ['flagged', '🚩 Flagged'], ['success', '✅ Success'], ['pending', '⏳ Pending']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              borderColor: filter === k ? '#2563eb' : '#e2e8f0',
              background: filter === k ? '#2563eb' : 'white',
              color: filter === k ? 'white' : '#64748b' }}>
            {l}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 12, alignSelf: 'center' }}>{filtered.length} transactions</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1.1fr 1fr' : '1fr', gap: 20 }}>
        {/* Table */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Txn ID', 'Project', 'Type', 'Amount', 'Sentinel', 'Status', 'Time', ''].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, color: '#94a3b8', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No transactions found</td></tr>
              ) : filtered.map(t => {
                const s = sc(t.sentinelStatus);
                const ts = sc(t.status);
                return (
                  <tr key={t._id} style={{ borderBottom: '1px solid #f1f5f9', background: selected?._id === t._id ? '#eff6ff' : 'white' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 11, color: '#2563eb', fontWeight: 700 }}>{t.txnId}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.projectNameSnapshot || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748b', textTransform: 'capitalize' }}>{(t.type || '').replace('_', ' ')}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{fmt(t.amount)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: s.bg, color: s.col }}>{t.sentinelStatus || '—'}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: ts.bg, color: ts.col }}>{t.status}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#94a3b8' }}>
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => viewDetail(t)}
                        style={{ padding: '5px 12px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ background: 'white', borderRadius: 14, border: '2px solid #2563eb', padding: 20, position: 'sticky', top: 24, alignSelf: 'start', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>🔍 Transaction Detail</span>
              <button onClick={() => { setSelected(null); setDetail(null); }}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            {detailLoading ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>Loading detail...</div>
            ) : detail ? (
              <>
                {/* Transaction info */}
                {[
                  ['Txn ID', detail.transaction?.txnId],
                  ['Project', detail.transaction?.projectNameSnapshot],
                  ['Type', (detail.transaction?.type || '').replace('_', ' ')],
                  ['Amount', fmt(detail.transaction?.amount)],
                  ['Sentinel', detail.transaction?.sentinelStatus],
                  ['Status', detail.transaction?.status],
                  ['On-Chain Hash', detail.transaction?.onChainTxnHash ? detail.transaction.onChainTxnHash.slice(0, 16) + '...' : 'Off-chain'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>{k}</span>
                    <span style={{ fontWeight: 700, color: '#1e293b', fontFamily: k.includes('Hash') ? 'monospace' : 'inherit' }}>{v || '—'}</span>
                  </div>
                ))}

                {/* Proof submission */}
                {detail.proof && (
                  <div style={{ marginTop: 14, padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>📸 Submitted Proof</div>
                    {[
                      ['GPS Location', `${detail.proof.gpsLatitude?.toFixed(4) || '—'}°N, ${detail.proof.gpsLongitude?.toFixed(4) || '—'}°E`],
                      ['Distance from Site', `${detail.proof.distanceFromPin || 0}m`],
                      ['Site Photo', detail.proof.uploadedProofs?.sitePhoto ? '✅ Uploaded' : '❌ Missing'],
                      ['Material Receipt', detail.proof.uploadedProofs?.materialReceipt ? '✅ Uploaded' : '❌ Missing'],
                      ['Completion Cert', detail.proof.uploadedProofs?.completionCertificate ? '✅ Uploaded' : '❌ Missing'],
                      ['IPFS CID', detail.proof.ipfsPhotoCid || '—'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 11 }}>
                        <span style={{ color: '#64748b' }}>{k}</span>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sentinel flags */}
                {detail.flagReasons?.length > 0 && (
                  <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: 12, marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>🚩 Sentinel Flag Reasons</div>
                    {detail.flagReasons.map((r, i) => <div key={i} style={{ fontSize: 11, color: '#475569', padding: '2px 0' }}>• {r}</div>)}
                  </div>
                )}

                {/* Resolution */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Resolution Note *</div>
                  <textarea value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Reason for your decision..."
                    style={{ width: '100%', padding: 10, border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, minHeight: 60, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
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
              </>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>Failed to load detail</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
