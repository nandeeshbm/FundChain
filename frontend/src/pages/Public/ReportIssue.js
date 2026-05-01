import React, { useState } from 'react';

const issueOptions = [
  'No construction happening at site',
  'Substandard materials being used',
  'Contractor not present',
  'Different location than official site',
  'Inflated invoice amounts',
  'Other (Please describe below)'
];

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    projectId: '',
    selectedProject: '',
    observation: 'Other (Please describe below)',
    description: '',
    name: '',
    email: '',
    phone: '',
    anonymous: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Issue report submitted successfully (dummy mode).');
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <div style={styles.headerIcon}>!</div>
        <div>
          <h2 style={styles.heading}>Report Suspicious Activity</h2>
          <p style={styles.subHeading}>Submit verified public concerns with optional evidence and identity protection.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <div style={styles.section}>
          <label style={styles.label}>Which Project? *</label>
          <div style={styles.inlineRow}>
            <select
              style={styles.input}
              value={formData.selectedProject}
              onChange={(e) => setFormData({ ...formData, selectedProject: e.target.value })}
            >
              <option value=''>Select Project</option>
              <option value='PJT101'>PJT101 - Primary School, Kurla</option>
              <option value='PJT102'>PJT102 - High School, Andheri</option>
              <option value='PJT103'>PJT103 - Community Health Center</option>
            </select>
            <span style={styles.orText}>or</span>
            <input
              style={styles.input}
              placeholder='Enter Project ID'
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            />
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>What Did You Observe? *</label>
          <div style={styles.optionGrid}>
            {issueOptions.map((option) => {
              const selected = formData.observation === option;
              return (
                <button
                  key={option}
                  type='button'
                  onClick={() => setFormData({ ...formData, observation: option })}
                  style={{ ...styles.optionCard, ...(selected ? styles.optionCardActive : {}) }}
                >
                  <span style={styles.optionRadio}>{selected ? "(x)" : "( )"}</span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Describe The Issue *</label>
          <textarea
            style={styles.textarea}
            placeholder='Provide a clear description for auditors...'
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Upload Evidence (Optional)</label>
          <div style={styles.inlineRow}>
            <button type='button' style={styles.ghostBtn} onClick={() => alert('Photo upload placeholder (dummy).')}>Upload Photos</button>
            <button type='button' style={styles.ghostBtn} onClick={() => alert('Document upload placeholder (dummy).')}>Upload Documents</button>
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Your Details (Optional)</label>
          <div style={styles.detailGrid}>
            <input style={styles.input} placeholder='Name' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input style={styles.input} placeholder='Email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input style={styles.input} placeholder='Phone' value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
        </div>

        <div style={styles.section}>
          <button
            type='button'
            onClick={() => setFormData({ ...formData, anonymous: !formData.anonymous })}
            style={styles.toggleRow}
          >
            <span style={styles.toggleIcon}>{formData.anonymous ? "[x]" : "[ ]"}</span>
            <span>Report Anonymously (Identity Protected)</span>
          </button>
        </div>

        <div style={styles.footerRow}>
          <button type='button' style={styles.secondaryBtn} onClick={() => alert('Draft saved (dummy).')}>Save Draft</button>
          <button type='submit' style={styles.primaryBtn}>Submit Report</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  page: { padding: '28px', fontFamily: "'Sora', sans-serif", background: 'transparent' },
  headerCard: { display: 'flex', gap: '14px', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 18px', marginBottom: '16px' },
  headerIcon: { width: '42px', height: '42px', borderRadius: '10px', display: 'grid', placeItems: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', fontSize: '1.3rem' },
  heading: { margin: 0, color: '#1e293b', fontSize: '1.1rem' },
  subHeading: { margin: '6px 0 0', color: '#64748b', fontSize: '0.88rem' },
  formCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px' },
  section: { marginBottom: '16px' },
  label: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: 700, marginBottom: '8px', display: 'block' },
  inlineRow: { display: 'flex', gap: '10px', alignItems: 'center' },
  orText: { color: '#94a3b8', fontSize: '0.85rem' },
  input: { flex: 1, border: '1px solid #dbe2ea', borderRadius: '10px', background: '#f8fafc', padding: '10px 12px', outline: 'none' },
  optionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  optionCard: { textAlign: 'left', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc', padding: '10px', color: '#334155', display: 'flex', gap: '8px', cursor: 'pointer' },
  optionCardActive: { border: '1px solid #93c5fd', background: '#eff6ff', color: '#1e3a8a' },
  optionRadio: { width: '20px', textAlign: 'center' },
  textarea: { width: '100%', minHeight: '130px', border: '1px solid #dbe2ea', borderRadius: '10px', background: '#f8fafc', padding: '12px', resize: 'vertical', outline: 'none' },
  ghostBtn: { flex: 1, border: '1px solid #dbe2ea', borderRadius: '10px', background: '#fff', padding: '10px 12px', cursor: 'pointer', fontWeight: 600, color: '#475569' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
  toggleRow: { width: '100%', border: '1px solid #dbe2ea', borderRadius: '10px', background: '#f8fafc', padding: '10px 12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  toggleIcon: { fontSize: '1.1rem' },
  footerRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  secondaryBtn: { border: '1px solid #cbd5e1', background: '#fff', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer' },
  primaryBtn: { border: 'none', background: '#2563eb', color: '#fff', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', fontWeight: 700 },
};

export default ReportIssue;
