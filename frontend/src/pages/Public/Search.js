import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [projects] = useState([
    { id: 'PJT101', name: 'PRIMARY SCHOOL - KURLA', status: 'Completed', budget: '₹5 Cr', timeline: '8 months', contractor: 'XYZ Builders', icon: '🏫' },
    { id: 'PJT102', name: 'HIGH SCHOOL - ANDHERI', status: 'In Progress', budget: '₹12 Cr', timeline: 'Expected: Dec 2024', progress: '75%', contractor: 'ABC Construction', icon: '🏫' },
    { id: 'PJT103', name: 'SECONDARY SCHOOL - BORIVALI', status: 'Not Started', budget: '₹8 Cr', timeline: 'Expected: Jun 2025', contractor: 'Not Assigned', icon: '🏫' }
  ]);

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <div style={styles.statsBar}>
          <span style={styles.statsText}>Found 47 projects | Total Budget: ₹235 Cr</span>
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>Sort by: <select style={styles.select}><option>[Newest ▾]</option></select></div>
            <div style={styles.filterGroup}>Filter: <select style={styles.select}><option>[All Statuses ▾]</option></select></div>
          </div>
        </div>

        <div style={styles.resultsGrid}>
          {projects.map((proj) => (
            <div key={proj.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>{proj.icon}</span>
                <h3 style={styles.cardTitle}>{proj.name}</h3>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.statusRow}>Status: <span style={getStatusStyle(proj.status)}>{proj.status === 'Completed' ? '✅' : proj.status === 'In Progress' ? '🟡' : '⏳'} {proj.status} {proj.progress ? `(${proj.progress} done)` : ''}</span></div>
                <div style={styles.metaRow}>Budget: {proj.budget} | {proj.status === 'Completed' ? 'Timeline' : 'Expected'}: {proj.timeline}</div>
                <div style={styles.metaRow}>Contractor: {proj.contractor}</div>
              </div>
              <button style={styles.viewBtn} onClick={() => navigate(`/public/project-details/${proj.id}`)}>[View Details →]</button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button style={styles.loadMoreBtn}>Load More Results</button>
        </div>
      </main>
    </div>
  );
};

const getStatusStyle = (status) => {
  const base = { fontWeight: 700 };
  if (status === 'Completed') return { ...base, color: '#10b981' };
  if (status === 'In Progress') return { ...base, color: '#f59e0b' };
  return { ...base, color: '#94a3b8' };
};

const styles = {
  container: { background: '#f8fafc', minHeight: '100vh', fontFamily: "'Sora', sans-serif" },
  header: { padding: '32px 40px', background: 'white', borderBottom: '1px solid #e2e8f0' },
  searchBar: { maxWidth: '800px', margin: '0 auto', display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '12px 20px', alignItems: 'center' },
  searchIcon: { color: '#94a3b8', marginRight: '12px' },
  input: { flex: 1, background: 'transparent', border: 'none', fontSize: '16px', outline: 'none', color: '#1e293b' },
  main: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
  statsBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' },
  statsText: { fontSize: '14px', color: '#64748b' },
  filterRow: { display: 'flex', gap: '24px' },
  filterGroup: { fontSize: '13px', fontWeight: 600, color: '#94a3b8' },
  select: { border: 'none', background: 'transparent', fontWeight: 700, color: '#1e293b', outline: 'none', cursor: 'pointer' },
  resultsGrid: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  cardIcon: { fontSize: '24px' },
  cardTitle: { fontSize: '18px', fontWeight: 800, color: '#1e293b' },
  cardBody: { marginBottom: '20px' },
  statusRow: { fontSize: '14px', color: '#64748b', marginBottom: '8px' },
  metaRow: { fontSize: '14px', color: '#64748b', marginBottom: '4px' },
  viewBtn: { background: 'transparent', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: '14px', padding: 0 },
  loadMoreBtn: { padding: '12px 24px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer' }
};

export default PublicSearch;
