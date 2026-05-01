import React, { useState } from 'react'; 
  
 const Explorer = () => { 
   // State representing verified infrastructure projects
   const [projects] = useState([
     { name: 'Road Construction', budget: '₹ 50,00,000', progress: '75%', color: '#2563eb' },
     { name: 'School Building', budget: '₹ 30,00,000', progress: '40%', color: '#10b981' },
     { name: 'Water Supply', budget: '₹ 25,00,000', progress: '90%', color: '#f59e0b' }
   ]); 
  
   // State representing real-time forensic activity logs
   const [updates] = useState([
     { text: 'Milestone 3 verified for Road Construction', date: '23 May 2024', color: '#2563eb' },
     { text: 'New project "Community Hall" authorized by Admin', date: '22 May 2024', color: '#10b981' },
     { text: 'Robotic Vault disbursement for School Building', date: '21 May 2024', color: '#f59e0b' }
   ]); 
  
   return ( 
     <div style={styles.container}> 
       {/* Hero Section: The Social Contract  */} 
       <header style={styles.hero}> 
         <div style={styles.heroInner}> 
           <h1 style={styles.heroH1}>Transparency. <span style={{color: 'var(--amber)'}}>Accountability.</span> Trust.</h1> 
           <p style={styles.heroP}> 
             Monitor public fund utilization in real-time. Every Rupee is secured  
             by the Robotic Bank Vault and verified through Un-fakeable Proof. 
           </p> 
         </div> 
         <div style={styles.heroImg}>🏗️</div> 
       </header> 
  
       {/* Search Section: Parametric Project Lookup */} 
       <div style={styles.searchSection}> 
         <div style={styles.searchWrap}> 
           <span style={styles.searchIcon}>🔍</span> 
           <input type="text" placeholder="Search by Project ID or Milestone..." style={styles.searchInput} /> 
         </div> 
       </div> 
  
       <main style={styles.mainContent}> 
         <div style={styles.sectionHeader}> 
           <span style={styles.sectionTitle}>Active Infrastructure Assets</span> 
           <a href="#all" style={styles.viewAll}>View Complete Map</a> 
         </div> 
  
         {/* Projects Grid: Progress Verified by pHash */} 
         <div style={styles.projectsGrid}> 
           {projects.map((p, index) => ( 
             <div key={index} style={styles.projCard}> 
               <div style={styles.projName}>{p.name}</div> 
               <div style={styles.projBudgetLabel}>Authorized Milestone Budget</div> 
               <div style={styles.projBudget}>{p.budget}</div> 
               <div style={styles.progressBar}> 
                 <div style={{...styles.progressFill, width: p.progress, background: p.color}}></div> 
               </div> 
               <div style={styles.projFooter}> 
                 <span style={styles.projPct}>Progress: {p.progress} (Verified)</span> 
                 <button style={styles.btnView}>Explore Proof</button> 
               </div> 
             </div> 
           ))} 
         </div> 
  
         <div style={styles.bottomGrid}> 
           {/* Fund Utilization: Robotic Vault Integrity  */} 
           <div style={styles.card}> 
             <div style={styles.cardTitle}>Global Vault Utilization Overview</div> 
             <div style={styles.donutWrap}> 
               <div style={styles.donut}> 
                 <svg width="110" height="110" viewBox="0 0 110 110" style={{transform: 'rotate(-90deg)'}}> 
                   <circle cx="55" cy="55" r="40" fill="none" stroke="#e2e8f0" strokeWidth="18"/> 
                   <circle cx="55" cy="55" r="40" fill="none" stroke="#2563eb" strokeWidth="18" strokeDasharray="155" strokeDashoffset="60" strokeLinecap="round"/> 
                 </svg> 
                 <div style={styles.donutCenter}> 
                   <div style={styles.donutPct}>62%</div> 
                   <div style={styles.donutSub}>Utilized</div> 
                 </div> 
               </div> 
               <div style={{flex: 1}}> 
                 <div style={styles.legendItem}> 
                   <div style={{...styles.dot, background: '#2563eb'}} /> 
                   <div style={styles.legendText}>Utilized (62%)</div> 
                 </div> 
                 <div style={styles.legendItem}> 
                   <div style={{...styles.dot, background: '#e2e8f0'}} /> 
                   <div style={styles.legendText}>Remaining (38%)</div> 
                 </div> 
               </div> 
             </div> 
           </div> 
  
           {/* Recent Forensic Log: The Ledger of Truth */} 
           <div style={styles.card}> 
             <div style={styles.cardTitle}>Real-Time Verification Log</div> 
             <div style={styles.logList}> 
               {updates.map((u, i) => ( 
                 <div key={i} style={styles.logItem}> 
                   <div style={{...styles.logBar, background: u.color}} /> 
                   <div style={{flex: 1}}> 
                     <div style={styles.logText}>{u.text}</div> 
                     <div style={styles.logDate}>{u.date}</div> 
                   </div> 
                 </div> 
               ))} 
             </div> 
           </div> 
         </div> 
       </main> 
     </div> 
   ); 
 }; 
  
 const styles = { 
   container: { background: 'transparent', minHeight: '100vh', fontFamily: "'Sora', sans-serif" }, 
   navbar: { display: 'none' }, 
   hero: { 
     background: 'linear-gradient(135deg, #0f1f3d 0%, #1e4db7 100%)', 
     padding: '48px 40px', 
     color: 'white', 
     display: 'flex', 
     alignItems: 'center', 
     justifyContent: 'space-between' 
   }, 
   heroInner: { maxWidth: '700px' }, 
   heroH1: { fontSize: '42px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }, 
   heroP: { fontSize: '18px', opacity: 0.85, lineHeight: 1.6 }, 
   heroImg: { fontSize: '120px', opacity: 0.2 }, 
   searchSection: { padding: '0 40px', marginTop: '-30px' }, 
   searchWrap: { background: 'white', padding: '16px 24px', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }, 
   searchIcon: { fontSize: '20px', color: '#94a3b8' }, 
   searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '16px', fontWeight: '500' }, 
   mainContent: { padding: '40px' }, 
   sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }, 
   sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b' }, 
   viewAll: { fontSize: '14px', fontWeight: '600', color: '#2563eb', textDecoration: 'none' }, 
   projectsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }, 
   projCard: { background: 'white', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }, 
   projName: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }, 
   projBudgetLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }, 
   projBudget: { fontSize: '22px', fontWeight: '800', color: '#1e293b', marginTop: '4px' }, 
   progressBar: { height: '8px', background: '#f1f5f9', borderRadius: '4px', margin: '20px 0', overflow: 'hidden' }, 
   progressFill: { height: '100%', borderRadius: '4px' }, 
   projFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, 
   projPct: { fontSize: '13px', color: '#64748b', fontWeight: '500' }, 
   btnView: { padding: '8px 16px', background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }, 
   bottomGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }, 
   card: { background: 'white', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }, 
   cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }, 
   donutWrap: { display: 'flex', alignItems: 'center', gap: '40px' }, 
   donut: { position: 'relative', width: '110px', height: '110px' }, 
   donutCenter: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }, 
   donutPct: { fontSize: '20px', fontWeight: '800', color: '#1e293b' }, 
   donutSub: { fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }, 
   legendItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }, 
   dot: { width: '10px', height: '10px', borderRadius: '50%' }, 
   legendText: { fontSize: '13px', color: '#64748b', fontWeight: '500' }, 
   logList: { display: 'flex', flexDirection: 'column', gap: '16px' }, 
   logItem: { display: 'flex', gap: '16px', alignItems: 'flex-start' }, 
   logBar: { width: '4px', height: '40px', borderRadius: '2px' }, 
   logText: { fontSize: '14px', color: '#1e293b', fontWeight: '600' }, 
   logDate: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' } 
 }; 
  
 export default Explorer;
