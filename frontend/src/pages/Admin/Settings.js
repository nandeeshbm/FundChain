import React, { useState } from 'react';

const SettingsModule = () => {
  const [form, setForm] = useState({
    governanceName: 'Public Fund Tracking System',
    threshold: '3-of-5',
    freezeAfterFlags: '3',
    maxDailyRelease: '2500000',
    autoFreeze: true,
    citizenFeed: true,
    requireAuditorSignOff: true,
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Governance Settings</h2>
        <p style={styles.sub}>
          Configure treasury controls, automated safeguards, and transparency rules for all projects.
        </p>

        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Governance Profile Name</label>
            <input style={styles.input} value={form.governanceName} onChange={(e) => update('governanceName', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Vault Multisig Threshold</label>
            <select style={styles.input} value={form.threshold} onChange={(e) => update('threshold', e.target.value)}>
              <option value="3-of-5">3 of 5 Signatures</option>
              <option value="4-of-7">4 of 7 Signatures</option>
              <option value="2-of-3">2 of 3 Signatures</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Auto-Freeze After Consecutive Flags</label>
            <input style={styles.input} type="number" min="1" max="10" value={form.freezeAfterFlags} onChange={(e) => update('freezeAfterFlags', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Max Daily Release (INR)</label>
            <input style={styles.input} type="number" min="0" value={form.maxDailyRelease} onChange={(e) => update('maxDailyRelease', e.target.value)} />
          </div>
        </div>

        <div style={styles.toggleWrap}>
          <Toggle
            title="Autonomous Freeze"
            desc="Automatically lock projects when anomaly threshold is breached."
            checked={form.autoFreeze}
            onChange={() => update('autoFreeze', !form.autoFreeze)}
          />
          <Toggle
            title="Citizen Transparency Feed"
            desc="Publish validated milestones to Public Explorer and Live Map."
            checked={form.citizenFeed}
            onChange={() => update('citizenFeed', !form.citizenFeed)}
          />
          <Toggle
            title="Mandatory Auditor Sign-Off"
            desc="Block release until auditor review is completed."
            checked={form.requireAuditorSignOff}
            onChange={() => update('requireAuditorSignOff', !form.requireAuditorSignOff)}
          />
        </div>

        <div style={styles.actions}>
          <button style={styles.secondaryBtn} onClick={() => alert('Admin settings reverted to last saved config.')}>Reset</button>
          <button style={styles.secondaryBtn} onClick={() => alert('Simulated governance dry-run completed.')}>Run Simulation</button>
          <button style={styles.primaryBtn} onClick={() => alert('Admin governance settings saved successfully.')}>Save Governance Rules</button>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ title, desc, checked, onChange }) => (
  <div style={styles.toggleRow}>
    <div>
      <div style={styles.toggleTitle}>{title}</div>
      <div style={styles.toggleSub}>{desc}</div>
    </div>
    <button onClick={onChange} style={{ ...styles.toggleBtn, background: checked ? '#10b981' : '#94a3b8' }}>
      {checked ? 'ON' : 'OFF'}
    </button>
  </div>
);

const styles = {
  page: { padding: 24, fontFamily: "'Inter', sans-serif" },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 },
  title: { margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' },
  sub: { margin: '8px 0 20px', fontSize: '0.92rem', color: '#64748b' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: '0.76rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.92rem' },
  toggleWrap: { marginTop: 18, display: 'grid', gap: 10 },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px' },
  toggleTitle: { fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' },
  toggleSub: { fontSize: '0.82rem', color: '#64748b', marginTop: 3 },
  toggleBtn: { border: 'none', color: '#fff', borderRadius: 8, minWidth: 58, padding: '8px 10px', fontWeight: 700, cursor: 'pointer' },
  actions: { marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' },
  secondaryBtn: { border: '1px solid #cbd5e1', background: '#fff', color: '#1e293b', borderRadius: 10, padding: '10px 14px', fontWeight: 600, cursor: 'pointer' },
  primaryBtn: { border: 'none', background: '#0f1f3d', color: '#fff', borderRadius: 10, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' },
};

export default SettingsModule;
