import React, { useState } from 'react';

const PublicHome = () => {
  const [nationalStats] = useState({
    totalBudget: '₹ 50,234 Cr',
    fundsReleased: '₹ 32,456 Cr',
    totalProjects: '28,567'
  });

  const categories = [
    { icon: '🏗️', name: 'INFRASTRUCTURE', count: '2,456 projects', color: '#2563eb' },
    { icon: '🍚', name: 'SUBSIDIES', count: '15,678 schemes', color: '#10b981' },
    { icon: '🎓', name: 'EDUCATION', count: '3,456 schools', color: '#7c3aed' },
    { icon: '🏥', name: 'HEALTHCARE', count: '1,234 hospitals', color: '#ef4444' },
    { icon: '🚨', name: 'EMERGENCY', count: '567 relief', color: '#f59e0b' },
    { icon: '💼', name: 'OTHER', count: '4,567 projects', color: '#64748b' },
  ];

  const recentProjects = [
    { id: 'PJT102', name: 'Smart City Highway', budget: '₹ 45 Cr', status: 'Completed', color: '#2563eb' },
    { id: 'PJT105', name: 'Rural Water Mission', budget: '₹ 12 Cr', status: 'Completed', color: '#10b981' },
    { id: 'PJT108', name: 'Primary Health Center', budget: '₹ 5 Cr', status: 'Completed', color: '#ef4444' },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>TRACKING PUBLIC FUNDS IN REAL-TIME</h1>
          <p style={styles.heroSub}>See Where Your Tax Money Goes</p>
          <button style={styles.heroBtn}>🗺️ Explore Projects on Map</button>
        </div>
      </header>

      {/* National Statistics */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 NATIONAL STATISTICS</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>TOTAL BUDGET</div>
            <div style={styles.statValue}>{nationalStats.totalBudget}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>FUNDS RELEASED</div>
            <div style={{...styles.statValue, color: '#10b981'}}>{nationalStats.fundsReleased}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>TOTAL PROJECTS</div>
            <div style={styles.statValue}>{nationalStats.totalProjects}</div>
          </div>
        </div>
      </section>

      {/* Explore By Category */}
      <section style={{...styles.section, background: '#f1f5f9'}}>
        <h2 style={styles.sectionTitle}>EXPLORE BY CATEGORY:</h2>
        <div style={styles.categoryGrid}>
          {categories.map((cat, idx) => (
            <div key={idx} style={styles.categoryCard}>
              <div style={{...styles.categoryIcon, color: cat.color}}>{cat.icon}</div>
              <div style={styles.categoryName}>{cat.name}</div>
              <div style={styles.categoryCount}>{cat.count}</div>
              <button style={{...styles.exploreBtn, color: cat.color}}>Explore →</button>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Completed Projects */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🔥 RECENTLY COMPLETED PROJECTS</h2>
        <div style={styles.projectGrid}>
          {recentProjects.map((proj, idx) => (
            <div key={idx} style={styles.projectCard}>
              <div style={{...styles.projectTag, background: proj.color}}>{proj.id}</div>
              <h3 style={styles.projectName}>{proj.name}</h3>
              <div style={styles.projectMeta}>Budget: <strong>{proj.budget}</strong></div>
              <div style={styles.projectStatus}>✅ {proj.status}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button style={styles.viewAllBtn}>View All →</button>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: { fontFamily: "'Sora', sans-serif", background: '#fff' },
  hero: { 
    background: 'linear-gradient(135deg, #0f1f3d 0%, #1e4db7 100%)', 
    padding: '80px 20px', 
    color: 'white', 
    textAlign: 'center' 
  },
  heroInner: { maxWidth: '800px', margin: '0 auto' },
  heroIcon: { fontSize: '48px', marginBottom: '16px' },
  heroTitle: { fontSize: '36px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' },
  heroSub: { fontSize: '18px', opacity: 0.8, marginBottom: '32px' },
  heroBtn: { 
    background: '#f59e0b', 
    color: '#0f1f3d', 
    padding: '16px 32px', 
    borderRadius: '12px', 
    border: 'none', 
    fontWeight: 700, 
    fontSize: '16px', 
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(245,158,11,0.3)'
  },
  section: { padding: '64px 40px', maxWidth: '1200px', margin: '0 auto' },
  sectionTitle: { fontSize: '14px', fontWeight: 800, color: '#64748b', letterSpacing: '1px', marginBottom: '32px', textTransform: 'uppercase' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
  statCard: { background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  statLabel: { fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' },
  statValue: { fontSize: '28px', fontWeight: 800, color: '#1e293b' },
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
  categoryCard: { background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center', transition: 'transform 0.2s' },
  categoryIcon: { fontSize: '40px', marginBottom: '16px' },
  categoryName: { fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' },
  categoryCount: { fontSize: '13px', color: '#64748b', marginBottom: '20px' },
  exploreBtn: { background: 'transparent', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px' },
  projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
  projectCard: { background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', position: 'relative' },
  projectTag: { position: 'absolute', top: '24px', right: '24px', padding: '4px 10px', borderRadius: '6px', color: 'white', fontSize: '10px', fontWeight: 700 },
  projectName: { fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', marginTop: '8px' },
  projectMeta: { fontSize: '14px', color: '#64748b', marginBottom: '8px' },
  projectStatus: { fontSize: '13px', fontWeight: 600, color: '#10b981' },
  viewAllBtn: { padding: '12px 24px', borderRadius: '10px', border: '1px solid #2563eb', color: '#2563eb', background: 'transparent', fontWeight: 700, cursor: 'pointer' }
};

export default PublicHome;
