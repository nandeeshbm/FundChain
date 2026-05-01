import React, { useState } from 'react'; 
  
 const AuditorDashboard = () => { 
   // State for anomalies and reviews - the "24/7 Security Guard" dataset [1] 
   const [stats] = useState({ 
     projects: 25, 
     transactions: 120, 
     flagged: 14, 
     approved: 92 
   }); 
  
   const [flaggedItems] = useState([
     { id: 'TXN1001', project: 'Road Construction', reason: 'Location Mismatch', date: '20 May 2024' },
     { id: 'TXN1003', project: 'Water Supply', reason: 'Unusual Amount', date: '21 May 2024' },
     { id: 'TXN1005', project: 'Drainage System', reason: 'Duplicate Entry', date: '22 May 2024' }
   ]); 
  
   return ( 
     <div style={styles.container}> 
       {/* Visual Identity Layer */} 
       <style>{` 
         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap'); 
         :root { 
           --navy: #0f1f3d; --purple: #7c3aed; --blue-light: #2563eb; 
           --green: #10b981; --amber: #f59e0b; --red: #ef4444; 
           --gray-200: #e2e8f0; --text: #1e293b; 
         } 
       `}</style> 
  
       <div style={styles.content}> 
         {/* Real-Time Interdiction Stats */} 
         <div style={styles.statsGrid}> 
           <div style={styles.statCard}> 
             <div style={styles.statLabel}>Total Projects</div> 
             <div style={styles.statValue}>{stats.projects}</div> 
           </div> 
           <div style={styles.statCard}> 
             <div style={styles.statLabel}>Total Transactions</div> 
             <div style={styles.statValue}>{stats.transactions}</div> 
           </div> 
           <div style={styles.statCard}> 
             <div style={styles.statLabel}>Anomalies Flagged</div> 
             <div style={{...styles.statValue, color: 'var(--red)'}}>{stats.flagged}</div> 
           </div> 
           <div style={styles.statCard}> 
             <div style={styles.statLabel}>Forensically Approved</div> 
             <div style={{...styles.statValue, color: 'var(--green)'}}>{stats.approved}</div> 
           </div> 
         </div> 
  
         <div style={styles.grid2}> 
           {/* Flagged Transactions: AI-Detected Deviations [2, 3] */} 
           <div style={styles.card}> 
             <div style={styles.cardHeader}> 
               <span style={styles.cardTitle}>Real-Time Security Alerts</span> 
               <a href="#all" style={styles.viewAll}>Investigate All</a> 
             </div> 
             {flaggedItems.map((item) => ( 
               <div key={item.id} style={styles.flaggedItem}> 
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}> 
                   <div> 
                     <div style={styles.flaggedId}>{item.id} — {item.reason}</div> 
                     <div style={styles.flaggedProj}>{item.project}</div> 
                     <div style={styles.flaggedDate}>{item.date}</div> 
                   </div> 
                   <span style={styles.flaggedBadge}>🚩 High Risk</span> 
                 </div> 
               </div> 
             ))} 
           </div> 
  
           {/* Status Overview: The Shared Source of Truth [4] */} 
           <div style={styles.card}> 
             <div style={styles.cardHeader}><span style={styles.cardTitle}>Vault Integrity Overview</span></div> 
             <div style={styles.donutWrap}> 
               <div style={styles.donut}> 
                 <svg width="120" height="120" viewBox="0 0 120 120" style={{transform: 'rotate(-90deg)'}}> 
                   <circle cx="60" cy="60" r="45" fill="none" stroke="#f1f5f9" strokeWidth="18"/> 
                   <circle cx="60" cy="60" r="45" fill="none" stroke="#10b981" strokeWidth="18" strokeDasharray="254" strokeDashoffset="0"/> 
                   <circle cx="60" cy="60" r="45" fill="none" stroke="#ef4444" strokeWidth="18" strokeDasharray="44.3" strokeDashoffset="-254" opacity="0.9"/> 
                   <circle cx="60" cy="60" r="45" fill="none" stroke="#f59e0b" strokeWidth="18" strokeDasharray="44.3" strokeDashoffset="-298.3" opacity="0.7"/> 
                 </svg> 
                 <div style={styles.donutCenter}> 
                   <div style={styles.donutPct}>120</div> 
                   <div style={styles.donutSub}>Total Audits</div> 
                 </div> 
               </div> 
               <div style={{flex: 1}}> 
                 <LegendItem color="#10b981" label="Verified" val="90 (75%)" /> 
                 <LegendItem color="#ef4444" label="Fraud Flagged" val="14 (11.7%)" /> 
                 <LegendItem color="#f59e0b" label="Pending Proof" val="14 (11.7%)" /> 
               </div> 
             </div> 
           </div> 
         </div> 
  
         {/* Recent Reviews: The Forensic Trail [5] */} 
         <div style={styles.card}> 
           <div style={styles.cardHeader}><span style={styles.cardTitle}>Audit Ledger (Immutable Records)</span></div> 
           <table style={styles.table}> 
             <thead> 
               <tr><th>Txn ID</th><th>Project Scope</th><th>Review Date</th><th>System Status</th><th>Action</th></tr> 
             </thead> 
             <tbody> 
               <tr> 
                 <td style={styles.monospaceBlue}>TXN1002</td> 
                 <td style={{fontSize: '12px'}}>Road Construction</td> 
                 <td style={{fontSize: '12px'}}>20 May 2024</td> 
                 <td><span style={styles.badgeApproved}>Approved</span></td> 
                 <td><button style={styles.btnView}>Review pHash</button></td> 
               </tr> 
               <tr> 
                 <td style={styles.monospaceBlue}>TXN1003</td> 
                 <td style={{fontSize: '12px'}}>School Building</td> 
                 <td style={{fontSize: '12px'}}>21 May 2024</td> 
                 <td><span style={styles.badgePending}>Pending Review</span></td> 
                 <td><button style={styles.btnView}>Verify GPS</button></td> 
               </tr> 
             </tbody> 
           </table> 
         </div> 
       </div> 
     </div> 
   ); 
 }; 
  
 // Sub-component for Legend 
 const LegendItem = ({ color, label, val }) => ( 
   <div style={styles.legendItem}> 
     <div style={{...styles.legendDot, background: color}}></div> 
     <div> 
       <div style={{fontSize: '11px', color: '#6b7280'}}>{label}</div> 
       <div style={styles.legendVal}>{val}</div> 
     </div> 
   </div> 
 ); 
  
 // JSS Object for React 
 const styles = { 
   container: { fontFamily: "'Sora', sans-serif", background: '#f8fafc', minHeight: '100vh' }, 
   content: { padding: '24px 28px' }, 
   statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }, 
   statCard: { background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }, 
   statLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }, 
   statValue: { fontSize: '24px', fontWeight: '700', color: '#1e293b', marginTop: '4px' }, 
   grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }, 
   card: { background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }, 
   cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }, 
   cardTitle: { fontSize: '14px', fontWeight: '700', color: '#1e293b' }, 
   viewAll: { fontSize: '12px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }, 
   flaggedItem: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '10px' }, 
   flaggedId: { fontFamily: 'monospace', fontSize: '11px', color: '#ef4444', fontWeight: '600' }, 
   flaggedProj: { fontSize: '13px', fontWeight: '600', color: '#1e293b', marginTop: '2px' }, 
   flaggedDate: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' }, 
   flaggedBadge: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600' }, 
   donutWrap: { display: 'flex', alignItems: 'center', gap: '20px' }, 
   donut: { position: 'relative', width: '120px', height: '120px', flexShrink: 0 }, 
   donutCenter: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }, 
   donutPct: { fontSize: '24px', fontWeight: '700', color: '#1e293b' }, 
   donutSub: { fontSize: '10px', color: '#94a3b8' }, 
   legendItem: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }, 
   legendDot: { width: '10px', height: '10px', borderRadius: '50%' }, 
   legendVal: { fontWeight: '600', color: '#1e293b', fontSize: '12px' }, 
   table: { width: '100%', borderCollapse: 'collapse' }, 
   monospaceBlue: { fontFamily: 'monospace', fontSize: '11px', fontWeight: '600', color: '#2563eb' }, 
   badgeApproved: { display: 'inline-flex', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600', background: 'rgba(16,185,129,0.1)', color: '#10b981' }, 
   badgePending: { display: 'inline-flex', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }, 
   btnView: { padding: '4px 12px', background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }, 
 }; 
  
 export default AuditorDashboard;
