import React, { useState } from 'react';

const FundRelease = () => {
  // Initial Milestone Data
  const [milestones, setMilestones] = useState([
    { id: 1, desc: "Survey & Preparation", amount: "50,00,000", status: "Released" },
    { id: 2, desc: "Road Base Work", amount: "1,00,00,000", status: "In Progress" },
    { id: 3, desc: "Asphalt Laying", amount: "1,50,00,000", status: "Pending" },
    { id: 4, desc: "Quality Audit", amount: "50,00,000", status: "Pending" }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    milestone: 'Select milestone',
    remarks: ''
  });

  const handleReleaseFunds = (e) => {
    e.preventDefault();
    // This is where you would call your Smart Contract / Robotic Vault logic
    alert(`Initiating release of ₹${formData.amount} for ${formData.milestone}. Verifying Un-fakeable Proof...`);
    
    // Update UI state logic (example)
    const updated = milestones.map(m => 
      m.id.toString() === formData.milestone.replace('Milestone ', '') 
     ? {...m, status: 'Released' } : m
    );
    setMilestones(updated);
  };

  return (
    <div style={styles.container}>
      {/* Internal CSS to match your exact design */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        :root {
          --navy: #0f1f3d; --blue: #1e4db7; --blue-light: #2563eb;
          --green: #10b981; --amber: #f59e0b; --red: #ef4444;
          --white: #fff; --gray-50: #f8fafc; --gray-100: #f1f5f9;
          --gray-200: #e2e8f0; --gray-400: #94a3b8; --gray-600: #475569;
          --text: #1e293b;
        }
      `}</style>

      <div style={styles.content}>
        <a href="#back" style={styles.backLink}>← Back to Projects</a>
        
        {/* Project Header: Macro-Financial Overview */}
        <div style={styles.projectHeader}>
          <h3 style={styles.headerTitle}>Release Funds (Admin Interface)</h3>
          <div style={styles.projectStats}>
            <div style={styles.projStat}><div style={styles.label}>Project Name</div><div style={styles.value}>Road Construction</div></div>
            <div style={styles.projStat}><div style={styles.label}>Total Budget</div><div style={styles.value}>₹ 5,00,00,000</div></div>
            <div style={styles.projStat}><div style={styles.label}>Total Released</div><div style={styles.value}>₹ 2,50,00,000</div></div>
          </div>
          <div style={{...styles.projectStats, marginTop: '12px'}}>
            <div style={styles.projStat}><div style={styles.label}>Remaining in Vault</div><div style={{...styles.value, color: 'var(--amber)'}}>₹ 2,50,00,000</div></div>
          </div>
        </div>

        {/* Milestones Table: The Logic of Absolute Accountability */}
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>Milestone Tracking</h4>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Milestone</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Amount (₹)</th>
                <th style={styles.th}>Vault Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) => (
                <tr key={m.id}>
                  <td style={{...styles.td, fontWeight: '600'}}>{m.id}</td>
                  <td style={styles.td}>{m.desc}</td>
                  <td style={styles.td}>₹ {m.amount}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(m.status)}>
                      {m.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {m.status === "Released"? (
                      <button style={styles.btnView}>View Proof</button>
                    ) : (
                      <button style={styles.btnRelease}>Release</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Release New Amount: The Robotic Vault Trigger */}
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>Manual Release Authorization</h4>
          <form style={styles.releaseForm} onSubmit={handleReleaseFunds}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  style={styles.input}
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Milestone Target</label>
                <select 
                  style={styles.input} 
                  value={formData.milestone}
                  onChange={(e) => setFormData({...formData, milestone: e.target.value})}
                >
                  <option>Select milestone</option>
                  <option>Milestone 3</option>
                  <option>Milestone 4</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Verification Remarks</label>
                <input 
                  type="text" 
                  placeholder="Enter proof ID or remarks" 
                  style={styles.input}
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" style={styles.btnPrimary}>Authorize Fund Release</button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper for Badge Styles
const getStatusStyle = (status) => {
  const base = { display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' };
  if (status === "Released") return {...base, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' };
  if (status === "In Progress") return {...base, backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb' };
  return {...base, backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' };
};

// React JSS Styles Object
const styles = {
  container: { fontFamily: "'Sora', sans-serif", background: '#f8fafc', minHeight: '100vh' },
  content: { padding: '24px 28px' },
  backLink: { fontSize: '13px', color: '#2563eb', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '20px', textDecoration: 'none' },
  projectHeader: { background: 'white', borderRadius: '14px', padding: '20px 24px', border: '1px solid #e2e8f0', marginBottom: '24px' },
  headerTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '14px' },
  projectStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  projStat: { background: '#f8fafc', borderRadius: '10px', padding: '14px' },
  label: { fontSize: '11px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' },
  value: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginTop: '4px' },
  card: { background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '20px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '18px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '14px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' },
  btnView: { padding: '5px 14px', background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' },
  btnRelease: { padding: '5px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' },
  releaseForm: { background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  formLabel: { fontSize: '12px', fontWeight: '600', color: '#475569' },
  input: { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: 'white' },
  btnPrimary: { padding: '12px 28px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' },
};

export default FundRelease;
