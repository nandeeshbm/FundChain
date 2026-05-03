import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const AuditorCommandCenter = () => {
  const [flaggedClaims, setFlaggedClaims] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [reviewDetail, setReviewDetail] = useState(null);
  const [publicReports, setPublicReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [f, t, r] = await Promise.all([
        axios.get(`${API}/auditor/flagged-transactions?limit=50`, authHeader()),
        axios.get(`${API}/transactions?limit=50`, authHeader()),
        axios.get(`${API}/auditor/report-issues?status=new&limit=50`, authHeader()),
      ]);
      if (f.data.success) setFlaggedClaims(f.data.data || []);
      if (t.data.success) setAllTransactions(t.data.data || []);
      if (r.data.success) setPublicReports(r.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchFlagged = fetchAll;

  const investigateClaim = async (claim) => {
    setSelectedClaim(claim);
    setSelectedReport(null);
    setResolutionNote('');
    try {
      const res = await axios.get(`${API}/auditor/transactions/${claim.txnId}/review`, authHeader());
      if (res.data.success) setReviewDetail(res.data.data);
    } catch (err) { console.error(err); }
  };

  const selectReport = (report) => {
    setSelectedReport(report);
    setSelectedClaim(null);
    setReviewDetail(null);
    setResolutionNote('');
  };

  const handleResolve = async (resolutionStatus) => {
    if (!resolutionNote.trim()) {
      alert('Please enter a resolution note before proceeding');
      return;
    }
    setResolving(true);
    try {
      const res = await axios.post(
        `${API}/auditor/transactions/${selectedClaim.txnId}/resolve`,
        { resolutionStatus, resolutionNote },
        authHeader()
      );
      if (res.data.success) {
        if (resolutionStatus === 'frozen') {
          await axios.post(
            `${API}/auditor/projects/${selectedClaim.projectId?.projectId || selectedClaim.projectId}/freeze`,
            { frozen: true, reason: resolutionNote, source: 'public_witness' },
            authHeader()
          );
        }
        alert(`✅ Resolution recorded: ${resolutionStatus}`);
        setSelectedClaim(null);
        setReviewDetail(null);
        fetchFlagged();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve');
    } finally { setResolving(false); }
  };

  const handleResolveReport = async (resolutionStatus) => {
    if (!resolutionNote.trim()) {
      alert('Please enter a resolution note before proceeding');
      return;
    }
    if (!selectedReport) return;

    setResolving(true);
    try {
      await axios.post(
        `${API}/auditor/report-issues/${selectedReport._id}/resolve`,
        { resolutionStatus, resolutionNote },
        authHeader()
      );

      if (resolutionStatus === 'frozen') {
        await axios.post(
          `${API}/auditor/projects/${selectedReport.projectId}/freeze`,
          { frozen: true, reason: resolutionNote, source: 'public_witness' },
          authHeader()
        );
      }

      alert('✅ Public report reviewed');
      setSelectedReport(null);
      setResolutionNote('');
      fetchFlagged();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve');
    } finally {
      setResolving(false);
    }
  };

  const theme = {
    navy: '#0f1f3d', blueLight: '#2563eb', green: '#10b981',
    amber: '#f59e0b', red: '#ef4444', gray50: '#f8fafc',
    gray100: '#f1f5f9', gray200: '#e2e8f0', gray600: '#475569', text: '#1e293b',
  };

  const styles = {
    container: { background: 'transparent', fontFamily: "'Sora', sans-serif" },
    grid: { display: 'grid', gridTemplateColumns: selectedClaim || selectedReport ? '1fr 1fr' : '1fr', gap: 24, transition: 'all 0.3s' },
    card: { background: 'white', borderRadius: 16, border: `1px solid ${theme.gray200}`, overflow: 'hidden' },
    th: { background: theme.gray50, padding: '12px 16px', textAlign: 'left', fontSize: 11, color: theme.gray600, textTransform: 'uppercase', borderBottom: `1px solid ${theme.gray200}` },
    td: { padding: 16, fontSize: 13, borderBottom: `1px solid ${theme.gray100}` },
    panel: { background: 'white', borderRadius: 16, border: `2px solid ${theme.blueLight}`, padding: 24, position: 'sticky', top: 24 },
    alertBanner: { background: 'rgba(239,68,68,0.08)', color: theme.red, padding: 12, borderRadius: 8, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 },
    verifyBox: { display: 'flex', justifyContent: 'space-between', padding: 12, background: theme.gray50, borderRadius: 8, marginBottom: 10 },
    verifyLabel: { fontSize: 12, color: theme.gray600, fontWeight: 500 },
    textarea: { width: '100%', padding: 10, border: `1.5px solid ${theme.gray200}`, borderRadius: 8, fontSize: 12, minHeight: 60, marginTop: 10, outline: 'none', resize: 'vertical', boxSizing: 'border-box' },
    btnApprove: { flex: 1, padding: 12, background: theme.green, color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 12 },
    btnFreeze: { flex: 1, padding: 12, background: theme.red, color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 12 },
    btnDismiss: { flex: 1, padding: 12, background: theme.amber, color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 12 },
  };

  const displayed = activeTab === 'flagged' ? flaggedClaims : allTransactions;
  const fmt = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Command Center...</div>;

  return (
    <div style={styles.container}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['all', `📋 All Transactions (${allTransactions.length})`, '#2563eb'],
          ['flagged', `🚨 Flagged (${flaggedClaims.length})`, '#ef4444']].map(([k, l, c]) => (
          <button key={k} onClick={() => setActiveTab(k)}
            style={{ padding: '8px 18px', borderRadius: 8, border: `1.5px solid ${activeTab === k ? c : '#e2e8f0'}`,
              background: activeTab === k ? c : 'white', color: activeTab === k ? 'white' : '#64748b',
              fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
            {l}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Public Witness Reports */}
          <div style={styles.card}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.gray200}`, fontWeight: 700, fontSize: 13 }}>
              🚨 Public Witness Reports ({publicReports.length})
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Report ID</th>
                  <th style={styles.th}>Project</th>
                  <th style={styles.th}>Observation</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {publicReports.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No public reports yet.</td></tr>
                ) : publicReports.map((report) => (
                  <tr key={report._id} style={{ cursor: 'pointer', background: selectedReport?._id === report._id ? 'rgba(239,68,68,0.05)' : 'white' }} onClick={() => selectReport(report)}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 700, color: theme.red }}>{report._id.slice(-8)}</td>
                    <td style={styles.td}>{report.projectName || report.projectId}</td>
                    <td style={{ ...styles.td, fontSize: 12, color: '#475569' }}>{report.observation}</td>
                    <td style={{ ...styles.td, fontSize: 11, color: '#94a3b8' }}>{new Date(report.createdAt).toLocaleString('en-IN')}</td>
                    <td style={styles.td}><button style={{ padding: '6px 10px', border: 'none', borderRadius: 6, background: 'rgba(239,68,68,0.1)', color: theme.red, fontWeight: 700 }}>Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transaction List */}
          <div style={styles.card}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={styles.th}>Transaction ID</th>
                <th style={styles.th}>Project</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Sentinel</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 30, textAlign: 'center', color: '#10b981' }}>
                  {activeTab === 'flagged' ? '✅ No flagged transactions — system is clean' : '📭 No transactions yet'}
                </td></tr>
              ) : displayed.map((claim) => (
                <tr key={claim._id}
                  style={{ cursor: 'pointer', background: selectedClaim?._id === claim._id ? 'rgba(37,99,235,0.04)' : 'white', borderBottom: '1px solid #f1f5f9' }}
                  onClick={() => investigateClaim(claim)}>
                  <td style={{ ...styles.td, fontWeight: 700, color: theme.blueLight, fontFamily: 'monospace', fontSize: 11 }}>{claim.txnId}</td>
                  <td style={{ ...styles.td, fontSize: 12, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{claim.projectNameSnapshot || '—'}</td>
                  <td style={{ ...styles.td, fontSize: 11, textTransform: 'capitalize', color: '#64748b' }}>{(claim.type || '').replace('_', ' ')}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{fmt(claim.amount)}</td>
                  <td style={styles.td}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700,
                      background: claim.sentinelStatus === 'flagged' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                      color: claim.sentinelStatus === 'flagged' ? theme.red : theme.green,
                    }}>{claim.sentinelStatus || '—'}</span>
                  </td>
                  <td style={styles.td}>
                    <button style={{ padding: '6px 12px', background: theme.gray100, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        </div>

        {(selectedClaim || selectedReport) && (
          <div style={styles.panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>
                {selectedReport ? `Reviewing Public Report ${selectedReport._id.slice(-6)}` : `Reviewing ${selectedClaim.txnId}`}
              </h3>
              <button onClick={() => { setSelectedClaim(null); setReviewDetail(null); setSelectedReport(null); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: theme.gray600 }}>✕ Close</button>
            </div>

            <div style={styles.alertBanner}>
              <span>{selectedReport ? '🚨 Flagged by Public Witness' : '🚨 Sentinel Flag'}</span>
            </div>

            {selectedClaim && (
              <>
                <div style={styles.verifyBox}>
                  <span style={styles.verifyLabel}>Transaction Type</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>{selectedClaim.type}</span>
                </div>
                <div style={styles.verifyBox}>
                  <span style={styles.verifyLabel}>Amount</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>₹ {Number(selectedClaim.amount).toLocaleString('en-IN')}</span>
                </div>
                <div style={styles.verifyBox}>
                  <span style={styles.verifyLabel}>Status</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: theme.red }}>{selectedClaim.sentinelStatus}</span>
                </div>
              </>
            )}

            {selectedReport && (
              <>
                <div style={styles.verifyBox}>
                  <span style={styles.verifyLabel}>Project</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{selectedReport.projectName || selectedReport.projectId}</span>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.red, marginBottom: 6 }}>Witness Observation</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{selectedReport.observation}</div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{selectedReport.description}</div>
                </div>
              </>
            )}

            {/* Proof details if available */}
            {reviewDetail?.proof && (
              <>
                <div style={{ ...styles.verifyBox, flexDirection: 'column', gap: 6 }}>
                  <span style={{ ...styles.verifyLabel, fontWeight: 700 }}>GPS Geofence Check</span>
                  <span style={{ fontSize: 12, color: reviewDetail.proof.distanceFromOfficialPinMeters > 500 ? theme.red : theme.green }}>
                    {reviewDetail.proof.distanceFromOfficialPinMeters}m from official pin
                  </span>
                </div>
                {reviewDetail.proof.sentinelReasons?.length > 0 && (
                  <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: theme.red, marginBottom: 6 }}>🚩 Sentinel Flags:</div>
                    {reviewDetail.proof.sentinelReasons.map((r, i) => <div key={i} style={{ fontSize: 11, color: '#475569', padding: '2px 0' }}>• {r}</div>)}
                  </div>
                )}
              </>
            )}

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: theme.gray600 }}>Resolution Note (required)</label>
              <textarea style={styles.textarea} placeholder="Enter rationale for your decision..." value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {selectedReport ? (
                <>
                  <button style={styles.btnFreeze} disabled={resolving} onClick={() => handleResolveReport('frozen')}>🧊 Freeze Vault</button>
                  <button style={styles.btnDismiss} disabled={resolving} onClick={() => handleResolveReport('dismissed')}>❌ Dismiss</button>
                </>
              ) : (
                <>
                  <button style={styles.btnFreeze} disabled={resolving} onClick={() => handleResolve('frozen')}>🧊 Freeze Vault</button>
                  <button style={styles.btnDismiss} disabled={resolving} onClick={() => handleResolve('dismissed')}>❌ Dismiss</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditorCommandCenter;
