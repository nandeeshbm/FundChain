import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const [project] = useState({
    name: 'COMMUNITY HEALTH CENTER - ANDHERI, MUMBAI',
    status: 'In Progress',
    progress: '60%',
    category: 'Healthcare',
    totalBudget: '₹2.00 Cr',
    released: '₹1.20 Cr',
    remaining: '₹0.80 Cr',
    contractor: {
      name: 'BuildRight Pvt Ltd',
      reputation: '4.7/5.0',
      completed: 23
    },
    milestones: [
      { name: 'Land Survey', amount: '₹10L', status: 'Released', icon: '✅' },
      { name: 'Foundation', amount: '₹40L', status: 'Released', icon: '✅' },
      { name: 'Structural Frame', amount: '₹70L', status: 'Released', icon: '✅' },
      { name: 'Roofing', amount: '₹50L', status: 'Pending', icon: '🔄' },
      { name: 'Interiors', amount: '₹30L', status: 'Not Started', icon: '⏳' }
    ],
    gps: '19.1334°N, 72.8397°E',
    contractAddress: '0xABC123...',
    totalTxns: 5
  });

  return (
    <div style={styles.container}>
      <main style={styles.content}>
        {/* Project Title & Status */}
        <section style={styles.titleSection}>
          <div style={styles.locationTag}>📍 {project.name}</div>
          <div style={styles.statusRow}>
            <span style={styles.statusLabel}>Status: 🟡 {project.status} ({project.progress} Complete)</span>
            <span style={styles.categoryLabel}>Category: {project.category}</span>
          </div>
        </section>

        <div style={styles.detailsGrid}>
          <div style={styles.leftCol}>
            {/* Budget Overview */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💰 BUDGET OVERVIEW</h3>
              <div style={styles.budgetBox}>
                <div style={styles.budgetRow}><span>Total Budget:</span> <span>{project.totalBudget}</span></div>
                <div style={styles.budgetRow}><span>Released:</span> <span>{project.released} (60%)</span></div>
                <div style={styles.budgetRow}><span>Remaining:</span> <span>{project.remaining} (40%)</span></div>
                
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: project.progress}}></div>
                </div>
                <div style={styles.progressLabel}>▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░ 60%</div>
              </div>
            </div>

            {/* Milestones */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📋 MILESTONES</h3>
              <div style={styles.milestoneList}>
                {project.milestones.map((m, idx) => (
                  <div key={idx} style={styles.milestoneItem}>
                    <span style={styles.mIcon}>{m.icon}</span>
                    <span style={styles.mName}>{m.name}</span>
                    <span style={styles.mAmount}>{m.amount}</span>
                    <span style={getMilestoneStatusStyle(m.status)}>{m.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contractor */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🏗️ CONTRACTOR</h3>
              <div style={styles.contractorInfo}>
                <div style={styles.infoLabel}>Name: {project.contractor.name}</div>
                <div style={styles.infoLabel}>Reputation: ⭐⭐⭐⭐⭐ {project.contractor.reputation}</div>
                <div style={styles.infoLabel}>Past Projects: {project.contractor.completed} completed</div>
              </div>
            </div>
          </div>

          <div style={styles.rightCol}>
            {/* Site Photos */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📸 LATEST SITE PHOTOS</h3>
              <div style={styles.photoGrid}>
                <div style={styles.photoBox}>[Photo 1]</div>
                <div style={styles.photoBox}>[Photo 2]</div>
                <div style={styles.photoBox}>[Photo 3]</div>
              </div>
              <div style={styles.photoFooter}>
                <button style={styles.textLink}>[View All 47 →]</button>
                <span>Last Updated: 2 days ago</span>
              </div>
            </div>

            {/* Location */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📍 LOCATION</h3>
              <div style={styles.mapPlaceholder}>[Small Map showing pin]</div>
              <div style={styles.gpsCoord}>GPS: {project.gps}</div>
            </div>

            {/* Blockchain Verification */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>⛓️ BLOCKCHAIN VERIFICATION</h3>
              <div style={styles.blockchainInfo}>
                <div style={styles.infoLabel}>Contract Address: <span style={styles.monospace}>{project.contractAddress}</span></div>
                <div style={styles.infoLabel}>Total Transactions: {project.totalTxns}</div>
                <button style={styles.etherscanBtn}>[View on Etherscan →]</button>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actionRow}>
              <button style={styles.actionBtn} onClick={() => navigate("/public/report-issue")}>[🚨 Report Issue]</button>
              <button style={styles.actionBtn}>[⭐ Follow Project]</button>
              <button style={styles.actionBtn}>[📤 Share]</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const getMilestoneStatusStyle = (status) => {
  const base = { fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px' };
  if (status === 'Released') return { ...base, color: '#10b981', background: 'rgba(16,185,129,0.1)' };
  if (status === 'Pending') return { ...base, color: '#f59e0b', background: 'rgba(245,158,11,0.1)' };
  return { ...base, color: '#94a3b8', background: '#f1f5f9' };
};

const styles = {
  container: { background: '#f8fafc', minHeight: '100vh', fontFamily: "'Sora', sans-serif" },
  header: { padding: '20px 40px', borderBottom: '1px solid #e2e8f0', background: 'white' },
  backBtn: { background: 'transparent', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' },
  content: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
  titleSection: { marginBottom: '32px' },
  locationTag: { fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '12px' },
  statusRow: { display: 'flex', gap: '16px' },
  statusLabel: { fontSize: '15px', fontWeight: 700, color: '#1e293b' },
  categoryLabel: { fontSize: '15px', fontWeight: 700, color: '#64748b' },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' },
  card: { background: 'white', padding: '24px', borderRadius: '0', border: '1px solid #e2e8f0', marginBottom: '24px' },
  cardTitle: { fontSize: '13px', fontWeight: 800, color: '#1e293b', letterSpacing: '0.5px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' },
  budgetBox: { display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid #e2e8f0', padding: '16px' },
  budgetRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#1e293b' },
  progressBar: { height: '10px', background: '#f1f5f9', borderRadius: '0', overflow: 'hidden', marginTop: '8px' },
  progressFill: { height: '100%', background: '#2563eb', borderRadius: '0' },
  progressLabel: { fontSize: '14px', color: '#1e293b', marginTop: '12px', fontFamily: 'monospace' },
  milestoneList: { display: 'flex', flexDirection: 'column', gap: '0', border: '1px solid #e2e8f0' },
  milestoneItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid #f1f5f9' },
  mIcon: { fontSize: '16px' },
  mName: { flex: 1, fontSize: '13px', fontWeight: 600, color: '#1e293b' },
  mAmount: { fontSize: '13px', fontWeight: 700, color: '#475569', marginRight: '12px' },
  contractorInfo: { display: 'flex', flexDirection: 'column', gap: '8px' },
  infoLabel: { fontSize: '14px', color: '#1e293b' },
  photoGrid: { display: 'flex', gap: '12px', marginBottom: '12px' },
  photoBox: { flex: 1, height: '60px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#2563eb', fontWeight: 600 },
  photoFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b' },
  textLink: { background: 'transparent', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: '12px', padding: 0 },
  mapPlaceholder: { height: '120px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '13px', marginBottom: '12px' },
  gpsCoord: { fontSize: '12px', color: '#1e293b', fontWeight: 600 },
  blockchainInfo: { display: 'flex', flexDirection: 'column', gap: '12px' },
  monospace: { fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 },
  etherscanBtn: { padding: '8px', border: '1px solid #e2e8f0', color: '#2563eb', background: 'transparent', fontWeight: 600, cursor: 'pointer', fontSize: '12px', textAlign: 'left' },
  actionRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  actionBtn: { padding: '10px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', color: '#1e293b' }
};

export default ProjectDetails;
