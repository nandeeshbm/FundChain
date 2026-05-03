import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const issueOptions = [
  'No construction happening at site',
  'Substandard materials being used',
  'Contractor not present',
  'Different location than official site',
  'Inflated invoice amounts',
  'Other (Please describe below)'
];

const API = 'http://localhost:5000/api';

const ReportIssue = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [receipt, setReceipt] = useState(null);
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

  useEffect(() => {
    const fetchProjects = async () => {
      setProjectLoading(true);
      setProjectError(null);
      try {
        const res = await axios.get(`${API}/public/projects?limit=200`);
        if (res.data.success) {
          setProjects(res.data.data);
        } else {
          setProjectError('Unable to load projects right now.');
        }
      } catch (err) {
        console.error(err);
        setProjectError('Unable to load projects right now.');
      } finally {
        setProjectLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const preset = searchParams.get('projectId');
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        projectId: preset,
        selectedProject: preset,
      }));
    }
  }, [searchParams]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      selectedProject: value,
      projectId: value,
    }));
  };

  const handleProjectIdChange = (e) => {
    const value = e.target.value;
    const match = projects.find((p) => p.projectId === value);
    setFormData((prev) => ({
      ...prev,
      projectId: value,
      selectedProject: match ? match.projectId : '',
    }));
  };

  const downloadReceipt = (report) => {
    if (!report) return;
    const lines = [
      `Report ID: ${report.reportId}`,
      `Project ID: ${report.projectId}`,
      `Project Name: ${report.projectName}`,
      `Submitted At: ${new Date(report.createdAt).toLocaleString('en-IN')}`,
      '',
      `Observation: ${formData.observation}`,
      `Description: ${formData.description}`,
      `Anonymous: ${report.anonymous ? 'Yes' : 'No'}`,
      report.anonymous ? 'Reporter details were protected.' : `Reporter: ${report.reporterName || 'N/A'} / ${report.reporterEmail || 'N/A'} / ${report.reporterPhone || 'N/A'}`,
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `issue_report_${report.projectId || 'unknown'}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setReceipt(null);

    const projectSelection = formData.selectedProject || formData.projectId;
    if (!projectSelection) {
      setSubmitError('Please select or enter the Project ID for the issue report.');
      return;
    }
    if (!formData.observation) {
      setSubmitError('Please choose the observation that best describes the issue.');
      return;
    }
    if (!formData.description.trim()) {
      setSubmitError('Please describe the issue in detail.');
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await axios.post(`${API}/public/report-issues`, {
        projectId: projectSelection,
        observation: formData.observation,
        description: formData.description,
        anonymous: formData.anonymous,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      if (res.data.success) {
        setSubmitSuccess('Issue report submitted successfully.');
        setReceipt({
          reportId: res.data.data.reportId,
          projectId: res.data.data.projectId,
          projectName: res.data.data.projectName,
          createdAt: res.data.data.createdAt,
          anonymous: formData.anonymous,
          observation: formData.observation,
          description: formData.description,
          reporterName: formData.name || null,
          reporterEmail: formData.email || null,
          reporterPhone: formData.phone || null,
        });
        setFormData({
          projectId: '',
          selectedProject: '',
          observation: 'Other (Please describe below)',
          description: '',
          name: '',
          email: '',
          phone: '',
          anonymous: true,
        });
      } else {
        setSubmitError('Unable to submit the issue report. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Unable to submit the issue report. Please try again later.');
    } finally {
      setSubmitLoading(false);
    }
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
              onChange={handleSelectChange}
              disabled={projectLoading}
            >
              <option value=''>
                {projectLoading ? 'Loading projects...' : 'Select Project'}
              </option>
              {projects.map((proj) => (
                <option key={proj.projectId} value={proj.projectId}>
                  {proj.projectId} - {proj.projectName}
                </option>
              ))}
            </select>
            <span style={styles.orText}>or</span>
            <input
              style={styles.input}
              placeholder='Enter Project ID'
              value={formData.projectId}
              onChange={handleProjectIdChange}
            />
          </div>
          {projectError && (
            <div style={styles.helperText}>{projectError}</div>
          )}
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

        {submitError && <div style={styles.alertError}>{submitError}</div>}
        {submitSuccess && (
          <div style={styles.alertSuccess}>
            {submitSuccess}
            {receipt && (
              <button type='button' style={styles.downloadBtn} onClick={() => downloadReceipt(receipt)}>
                Download Report Receipt
              </button>
            )}
          </div>
        )}

        <div style={styles.footerRow}>
          <button type='button' style={styles.secondaryBtn} onClick={() => setSubmitError(null)} disabled={submitLoading}>
            Clear
          </button>
          <button type='submit' style={styles.primaryBtn} disabled={submitLoading}>
            {submitLoading ? 'Submitting...' : 'Submit Report'}
          </button>
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
  helperText: { marginTop: '8px', fontSize: '0.82rem', color: '#ef4444' },
  optionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  optionCard: { textAlign: 'left', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc', padding: '10px', color: '#334155', display: 'flex', gap: '8px', cursor: 'pointer' },
  optionCardActive: { border: '1px solid #93c5fd', background: '#eff6ff', color: '#1e3a8a' },
  optionRadio: { width: '20px', textAlign: 'center' },
  textarea: { width: '100%', minHeight: '130px', border: '1px solid #dbe2ea', borderRadius: '10px', background: '#f8fafc', padding: '12px', resize: 'vertical', outline: 'none' },
  ghostBtn: { flex: 1, border: '1px solid #dbe2ea', borderRadius: '10px', background: '#fff', padding: '10px 12px', cursor: 'pointer', fontWeight: 600, color: '#475569' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
  toggleRow: { width: '100%', border: '1px solid #dbe2ea', borderRadius: '10px', background: '#f8fafc', padding: '10px 12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  toggleIcon: { fontSize: '1.1rem' },
  alertError: { padding: '14px 18px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12, color: '#b91c1c', marginBottom: 16 },
  alertSuccess: { padding: '14px 18px', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 12, color: '#065f46', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  downloadBtn: { border: '1px solid #10b981', background: '#10b981', color: '#fff', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontWeight: 700 },
  footerRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  secondaryBtn: { border: '1px solid #cbd5e1', background: '#fff', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer' },
  primaryBtn: { border: 'none', background: '#2563eb', color: '#fff', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', fontWeight: 700 },
};

export default ReportIssue;
