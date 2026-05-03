import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MetaMaskButton from '../../components/MetaMaskButton';
import { connectWallet, ensureSepolia, isMetaMaskAvailable, signProofSubmission } from '../../services/metaMask';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function ClaimSubmission() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [signing, setSigning] = useState(false);
  const [result, setResult] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedSitePhotoDataUrl, setCapturedSitePhotoDataUrl] = useState('');
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [form, setForm] = useState({
    gpsLatitude: '',
    gpsLongitude: '',
    ipfsPhotoUrl: '',
    ipfsPhotoCid: '',
    taxIRN: '',
    uploadedProofs: { sitePhoto: false, materialReceipt: false, completionCertificate: false },
    receiptDocumentUrl: '',
    completionCertificateUrl: '',
    forensicMeta: { imageHash: '', exifCapturedAt: '', deviceInfo: '' },
    metaMaskSignature: '',
  });

  useEffect(() => {
    axios.get(`${API}/admin/projects`, authHeader())
      .then(r => { if (r.data.success) setProjects(r.data.data || []); })
      .catch(console.error);
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => () => stopCamera(), []);

  const openCamera = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 0);
    } catch (err) {
      setCameraError(`Camera access denied: ${err.message}`);
    }
  };

  const digestHex = async (text) => {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const hash = await digestHex(`${Date.now()}-${dataUrl.slice(0, 300)}`);

    setCapturedSitePhotoDataUrl(dataUrl);
    setForm((f) => ({
      ...f,
      uploadedProofs: { ...f.uploadedProofs, sitePhoto: true },
      ipfsPhotoUrl: 'ipfs://pending',
      ipfsPhotoCid: `pending-${hash.slice(0, 20)}`,
      forensicMeta: {
        ...f.forensicMeta,
        imageHash: `sha256:${hash}`,
        exifCapturedAt: new Date().toISOString().slice(0, 16),
        deviceInfo: f.forensicMeta.deviceInfo || navigator.userAgent.slice(0, 60),
      },
    }));
    stopCamera();
    setCameraOpen(false);
  };

  const loadMilestones = async (projectId) => {
    setSelectedProject(projectId);
    setSelectedMilestone('');
    setMilestones([]);
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/projects/${projectId}/milestones`, authHeader());
      if (res.data.success) {
        const all = res.data.data?.milestones || [];
        const available = all.filter(m => ['pending', 'in_progress'].includes(m.status));
        setMilestones(available);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getGPS = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({ ...f, gpsLatitude: pos.coords.latitude.toFixed(6), gpsLongitude: pos.coords.longitude.toFixed(6) }));
        setGpsLoading(false);
      },
      () => {
        alert('GPS failed — please enter coordinates manually');
        setGpsLoading(false);
      }
    );
  };

  const handleSignAndSubmit = async () => {
    if (!selectedProject || !selectedMilestone) return alert('Select a project and milestone first');
    if (!form.gpsLatitude || !form.gpsLongitude) return alert('GPS coordinates are required');
    if (!form.taxIRN || form.taxIRN.length !== 64) return alert('Valid 64-character IRN is required');
    if (!capturedSitePhotoDataUrl) return alert('Live site photo from camera is required');

    const hasAnyProof = form.uploadedProofs.sitePhoto || form.uploadedProofs.materialReceipt || form.uploadedProofs.completionCertificate;
    if (!hasAnyProof) return alert('Upload at least one proof document (site photo, receipt, or certificate)');

    setSubmitting(true);
    try {
      // Step 1: Trigger MetaMask popup and sign when extension exists
      let signature = '';
      let signedWallet = walletAddress || null;

      if (isMetaMaskAvailable()) {
        if (!signedWallet) {
          await ensureSepolia();
          signedWallet = await connectWallet();
          setWalletAddress(signedWallet);
        }

        setSigning(true);
        try {
          const signed = await signProofSubmission({
            milestoneId: selectedMilestone,
            projectId: selectedProject,
            gpsLatitude: parseFloat(form.gpsLatitude),
            gpsLongitude: parseFloat(form.gpsLongitude),
          });
          signature = signed.signature;
          signedWallet = signed.walletAddress || signedWallet;
          setForm(f => ({ ...f, metaMaskSignature: signature }));
        } catch (signErr) {
          const proceed = window.confirm('MetaMask signing failed or was rejected. Submit without blockchain signature?');
          if (!proceed) { setSubmitting(false); setSigning(false); return; }
        } finally { setSigning(false); }
      }

      // Step 2: Submit to backend
      const payload = {
        gpsLatitude: parseFloat(form.gpsLatitude),
        gpsLongitude: parseFloat(form.gpsLongitude),
        ipfsPhotoUrl: form.ipfsPhotoUrl || null,
        ipfsPhotoCid: form.ipfsPhotoCid || null,
        capturedSitePhotoDataUrl,
        taxIRN: form.taxIRN || null,
        uploadedProofs: form.uploadedProofs,
        receiptDocumentUrl: form.receiptDocumentUrl || null,
        completionCertificateUrl: form.completionCertificateUrl || null,
        forensicMeta: {
          imageHash: form.forensicMeta.imageHash || '',
          exifCapturedAt: form.forensicMeta.exifCapturedAt || new Date().toISOString(),
          deviceInfo: form.forensicMeta.deviceInfo || '',
        },
        walletAddress: signedWallet || null,
        metaMaskSignature: signature || null,
      };

      const res = await axios.post(
        `${API}/contractor/milestones/${selectedMilestone}/submit-proof`,
        payload,
        authHeader()
      );

      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Submission failed';
      const errors = err.response?.data?.errors;
      alert(`❌ ${msg}${errors ? '\n\n' + errors.join('\n') : ''}`);
    } finally {
      setSubmitting(false);
      setSigning(false);
    }
  };

  const theme = { navy: '#0f1f3d', blue: '#2563eb', green: '#10b981', amber: '#f59e0b', red: '#ef4444' };

  if (result) {
    const ok = result.sentinelResult === 'success';
    return (
      <div style={{ fontFamily: "'Sora', sans-serif" }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 40, border: '1px solid #e2e8f0', textAlign: 'center', maxWidth: 600 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{ok ? '✅' : '⚠️'}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: ok ? theme.green : theme.amber, marginBottom: 8 }}>
            {ok ? 'Proof Accepted by Sentinel!' : 'Proof Flagged for Review'}
          </h2>
          <p style={{ color: '#64748b', marginBottom: 8 }}>
            GPS Distance from site: <strong>{result.distanceFromPin}m</strong>
          </p>
          {result.metaMaskSignature && (
            <div style={{ margin: '12px 0', padding: '8px 14px', background: 'rgba(16,185,129,0.06)', borderRadius: 8, fontSize: 11, fontFamily: 'monospace', color: '#10b981', textAlign: 'left', wordBreak: 'break-all' }}>
              🔐 Signed: {result.metaMaskSignature?.slice(0, 40)}...
            </div>
          )}
          {result.sentinelReasons?.length > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: 16, marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: theme.red, marginBottom: 8, fontSize: 13 }}>🚩 Issues Detected:</div>
              {result.sentinelReasons.map((r, i) => <div key={i} style={{ fontSize: 12, color: '#475569', padding: '3px 0' }}>• {r}</div>)}
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
            <button onClick={() => { setResult(null); setSelectedProject(''); setSelectedMilestone(''); setMilestones([]); }}
              style={{ padding: '12px 24px', background: theme.blue, color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
              Submit Another
            </button>
            <a href="/contractor/submissions"
              style={{ padding: '12px 24px', background: theme.navy, color: 'white', borderRadius: 10, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              View My Submissions →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>📋 Submit Milestone Proof</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>GPS-tagged proof unlocks milestone payments from the Escrow Vault</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <MetaMaskButton onConnected={setWalletAddress} compact />
          {walletAddress && <div style={{ fontSize: 10, color: '#64748b' }}>✅ Signature will be attached to proof</div>}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Project & Milestone */}
        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📌 Project Selection</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={lbl}>Select Project *</label>
              <select style={inp} value={selectedProject} onChange={e => loadMilestones(e.target.value)}>
                <option value="">Choose project...</option>
                {projects.map(p => (
                  <option key={p.projectId} value={p.projectId}>{p.projectName} ({p.projectId})</option>
                ))}
              </select>
              {projects.length === 0 && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>No projects available — ask admin to create one</div>}
            </div>
            <div>
              <label style={lbl}>Select Milestone Phase *</label>
              <select style={inp} value={selectedMilestone} onChange={e => setSelectedMilestone(e.target.value)} disabled={!selectedProject || loading}>
                <option value="">{loading ? 'Loading...' : 'Choose milestone...'}</option>
                {milestones.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.title} — ₹{Number(m.amount || 0).toLocaleString('en-IN')} ({m.status})
                  </option>
                ))}
              </select>
              {selectedProject && milestones.length === 0 && !loading && (
                <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>No pending milestones for this project</div>
              )}
            </div>
          </div>
        </div>

        {/* GPS */}
        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📍 GPS Verification (Geofence Check)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={lbl}>Latitude *</label>
              <input style={inp} type="number" step="any" placeholder="e.g. 12.9716"
                value={form.gpsLatitude} onChange={e => setForm(f => ({ ...f, gpsLatitude: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Longitude *</label>
              <input style={inp} type="number" step="any" placeholder="e.g. 77.5946"
                value={form.gpsLongitude} onChange={e => setForm(f => ({ ...f, gpsLongitude: e.target.value }))} />
            </div>
            <button onClick={getGPS} disabled={gpsLoading}
              style={{ padding: '9px 16px', background: theme.blue, color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}>
              {gpsLoading ? '...' : '📡 Auto GPS'}
            </button>
          </div>
          {form.gpsLatitude && (
            <div style={{ marginTop: 10, padding: 10, background: 'rgba(16,185,129,0.06)', borderRadius: 8, fontSize: 12, color: theme.green }}>
              ✅ GPS set: {form.gpsLatitude}° N, {form.gpsLongitude}° E
            </div>
          )}
        </div>

        {/* Tax IRN */}
        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🧾 Financial Verification (Govt Tax IRN)</h3>
          <div>
            <label style={lbl}>64-Character IRN Receipt *</label>
            <input style={{ ...inp, fontFamily: 'monospace' }} placeholder="Enter the 64-character IRN from the Government Tax Receipt"
              value={form.taxIRN} onChange={e => setForm(f => ({ ...f, taxIRN: e.target.value }))} maxLength={64} />
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
              Rule: IRN validation against Govt Database is mandatory for fund release.
            </div>
          </div>
        </div>

        {/* Proof Upload */}
        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>📸 Proof Documents</h3>
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Site Photo is camera-only (live capture). File upload from device is blocked for site photo.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { key: 'sitePhoto', label: 'Site Photo (Live)', emoji: '📷', accept: null, capture: null, desc: 'Capture from camera only' },
              { key: 'materialReceipt', label: 'Material Receipt', emoji: '🧾', accept: 'image/*,application/pdf', capture: null, desc: 'Upload purchase bill/receipt' },
              { key: 'completionCertificate', label: 'Completion Cert', emoji: '📜', accept: 'image/*,application/pdf', capture: null, desc: 'Engineer sign-off document' },
            ].map(p => {
              const uploaded = form.uploadedProofs[p.key];
              return (
                <label key={p.key} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 18,
                  border: `2px solid ${uploaded ? '#10b981' : '#e2e8f0'}`, borderRadius: 12, cursor: 'pointer', gap: 6,
                  transition: 'all 0.2s', background: uploaded ? 'rgba(16,185,129,0.05)' : 'white',
                }}>
                  {p.key !== 'sitePhoto' && (
                    <input type="file" style={{ display: 'none' }} accept={p.accept}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setForm(f => ({
                            ...f,
                            uploadedProofs: { ...f.uploadedProofs, [p.key]: true },
                          }));
                        }
                      }}
                    />
                  )}
                  {p.key === 'sitePhoto' && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); openCamera(); }}
                      style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #2563eb', background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer', fontSize: 11 }}
                    >
                      Open Camera
                    </button>
                  )}
                  <span style={{ fontSize: 30 }}>{uploaded ? '✅' : p.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: uploaded ? '#10b981' : '#1e293b', textAlign: 'center' }}>{p.label}</span>
                  <span style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>{uploaded ? '✓ Uploaded' : p.desc}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', marginTop: 2 }}>
                    {p.key === 'sitePhoto' ? '📷 Camera Only' : '📁 Choose File'}
                  </span>
                </label>
              );
            })}
          </div>
          {cameraError && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 8 }}>{cameraError}</div>}
          {cameraOpen && (
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 12, marginBottom: 8, color: '#334155', fontWeight: 700 }}>Live Camera Capture</div>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: 280, borderRadius: 8, background: '#000' }} />
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button type="button" onClick={captureFromCamera} style={{ padding: '8px 12px', border: 'none', borderRadius: 8, background: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Capture</button>
                <button type="button" onClick={() => { stopCamera(); setCameraOpen(false); }} style={{ padding: '8px 12px', border: 'none', borderRadius: 8, background: '#64748b', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Close</button>
              </div>
            </div>
          )}
          {capturedSitePhotoDataUrl && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 6 }}>Captured Site Photo Preview</div>
              <img src={capturedSitePhotoDataUrl} alt="Captured site" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>IPFS Photo URL (auto)</label>
              <input style={inp} placeholder="ipfs://..." value={form.ipfsPhotoUrl} readOnly />
            </div>
            <div>
              <label style={lbl}>IPFS CID (auto)</label>
              <input style={inp} placeholder="Qm..." value={form.ipfsPhotoCid} readOnly />
            </div>
          </div>
        </div>

        {/* Forensic Metadata */}
        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>🔬 Forensic Metadata</h3>
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Auto-filled from file upload — you can edit manually</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Image SHA Hash</label>
              <input style={inp} placeholder="sha256:..." value={form.forensicMeta.imageHash} onChange={e => setForm(f => ({ ...f, forensicMeta: { ...f.forensicMeta, imageHash: e.target.value } }))} />
            </div>
            <div>
              <label style={lbl}>EXIF Capture Date</label>
              <input style={inp} type="datetime-local" value={form.forensicMeta.exifCapturedAt} onChange={e => setForm(f => ({ ...f, forensicMeta: { ...f.forensicMeta, exifCapturedAt: e.target.value } }))} />
            </div>
            <div>
              <label style={lbl}>Device Info</label>
              <input style={inp} placeholder="iPhone 14 Pro" value={form.forensicMeta.deviceInfo} onChange={e => setForm(f => ({ ...f, forensicMeta: { ...f.forensicMeta, deviceInfo: e.target.value } }))} />
            </div>
          </div>
        </div>

        {/* MetaMask info banner */}
        {!walletAddress && (
          <div style={{ background: 'rgba(246,133,27,0.08)', border: '1px solid rgba(246,133,27,0.3)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🦊</span>
            <div style={{ fontSize: 12, color: '#92400e' }}>
              <strong>Connect MetaMask</strong> to sign this submission with your blockchain wallet. This creates a tamper-proof on-chain identity proof.
              Submission without a wallet signature is allowed but less secure.
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button onClick={handleSignAndSubmit} disabled={submitting || !selectedMilestone}
          style={{
            padding: 18, borderRadius: 12, fontSize: 15, fontWeight: 700, width: '100%', cursor: submitting ? 'not-allowed' : 'pointer', border: 'none',
            background: submitting ? '#94a3b8' : `linear-gradient(135deg, ${theme.navy} 0%, #1e4db7 100%)`,
            color: 'white', boxShadow: submitting ? 'none' : '0 4px 16px rgba(15,31,61,0.3)',
          }}>
          {signing ? '🦊 Waiting for MetaMask signature...' : submitting ? '🔄 Running Sentinel Analysis...' : '🚀 Submit Proof & Run Forensic Check'}
        </button>
      </div>
    </div>
  );
}

const lbl = { fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 };
const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: 'white' };
