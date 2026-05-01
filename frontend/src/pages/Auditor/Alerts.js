import React, { useState } from 'react'; 
  
 const AlertsDashboard = () => { 
   // State for System Alerts - Linked to the 24/7 Security Guard AI
   const [alerts] = useState([
     { id: 'ALT001', project: 'Road Construction', type: 'Budget Overrun', priority: 'High', desc: 'Transaction exceeds milestone benchmark by 15%', date: '23 May 2024', status: 'Open' },
     { id: 'ALT002', project: 'Water Supply', type: 'GPS Mismatch', priority: 'Medium', desc: 'Proof location outside project perimeter', date: '22 May 2024', status: 'Pending' },
     { id: 'ALT003', project: 'School Building', type: 'API Failure', priority: 'High', desc: 'Govt Tax API handshake failed', date: '21 May 2024', status: 'Open' },
     { id: 'ALT004', project: 'Drainage System', type: 'Duplicate Entry', priority: 'Low', desc: 'Similar transaction ID detected on-chain', date: '20 May 2024', status: 'Pending' },
   ]); 
  
   return ( 
     <div style={styles.container}> 
       <style>{` 
         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap'); 
         :root { 
           --navy: #0f1f3d; --blue: #2563eb; --red: #ef4444; --orange: #f59e0b; 
           --green: #10b981; --purple: #7c3aed; --text: #1e293b; --gray-400: #94a3b8; 
         } 
       `}</style> 
  
       <div style={styles.content}> 
         {/* Stat Cards: The Anomaly Pulse */} 
         <div style={styles.statsRow}> 
           <StatCard icon="⚠️" label="High Priority Alerts" val="7" color="#fee2e2" textColor="var(--red)" /> 
           <StatCard icon="⚠️" label="Medium Priority Alerts" val="11" color="#ffedd5" textColor="var(--orange)" /> 
           <StatCard icon="ⓘ" label="Low Priority Alerts" val="18" color="#dbeafe" textColor="var(--blue)" /> 
           <StatCard icon="✔️" label="Resolved Alerts" val="32" color="#f3e8ff" textColor="var(--purple)" /> 
         </div> 
  
         {/* Forensic Audit Ledger Table */} 
         <div style={styles.card}> 
           <h3 style={styles.cardTitle}>All Real-Time Alerts</h3> 
           <table style={styles.table}> 
             <thead> 
               <tr style={styles.thead}> 
                 <th style={styles.th}>Alert ID</th> 
                 <th style={styles.th}>Project Name</th> 
                 <th style={styles.th}>Alert Type</th> 
                 <th style={styles.th}>Priority</th> 
                 <th style={styles.th}>Interdiction Description</th> 
                 <th style={styles.th}>Detected On</th> 
                 <th style={styles.th}>Status</th> 
                 <th style={styles.th}>Action</th> 
               </tr> 
             </thead> 
             <tbody> 
               {alerts.map((alert) => ( 
                 <tr key={alert.id} style={styles.tr}> 
                   <td style={styles.idCell}>{alert.id}</td> 
                   <td style={styles.projName}>{alert.project}</td> 
                   <td style={styles.td}>{alert.type}</td> 
                   <td style={getPriorityStyle(alert.priority)}>{alert.priority}</td> 
                   <td style={styles.td}>{alert.desc}</td> 
                   <td style={styles.td}>{alert.date}</td> 
                   <td><span style={getStatusStyle(alert.status)}>{alert.status}</span></td> 
                   <td><span style={styles.viewBtn}>👁️ View Proof</span></td> 
                 </tr> 
               ))} 
             </tbody> 
           </table> 
  
           {/* Pagination */} 
           <div style={styles.pagination}> 
             <span>Showing 1 to 4 of 36 high-signal entries</span> 
             <div style={styles.pageLinks}> 
               <div style={styles.pageLink}>‹</div> 
               <div style={{...styles.pageLink,...styles.pageLinkActive}}>1</div> 
               <div style={styles.pageLink}>2</div> 
               <div style={styles.pageLink}>3</div> 
               <div style={styles.pageLink}>4</div> 
               <div style={styles.pageLink}>5</div> 
               <div style={styles.pageLink}>›</div> 
             </div> 
           </div> 
         </div> 
  
         {/* Bottom Intelligence Grid: Activities & Filters */} 
         <div style={styles.bottomGrid}> 
           <div style={styles.card}> 
             <h3 style={styles.cardTitle}>Recent Smart Circuit Breaker Activities</h3> 
             <ActivityItem color="var(--red)" text="High budget overrun detected in Road Construction" time="10:30 AM" /> 
             <ActivityItem color="var(--orange)" text="Milestone delay alert for Water Supply" time="04:15 PM" /> 
             <ActivityItem color="var(--blue)" text="AI flagged suspicious transaction in School Building" time="11:20 AM" /> 
             <ActivityItem color="var(--green)" text="Public complaint received for Drainage System" time="09:10 AM" /> 
             <ActivityItem color="var(--purple)" text="Low trust score alert in Community Hall" time="03:25 PM" /> 
           </div> 
  
           <div style={styles.card}> 
             <h3 style={styles.cardTitle}>Parametric Alert Filters</h3> 
             <div style={styles.filterGrid}> 
               <FilterGroup label="Priority" /> 
               <FilterGroup label="Status" /> 
               <FilterGroup label="Alert Type" span={2} /> 
               <FilterGroup label="Project Asset" span={2} /> 
               <div style={styles.formGroup}> 
                 <label style={styles.filterLabel}>Date From</label> 
                 <input type="text" placeholder="DD/MM/YYYY" style={styles.input} /> 
               </div> 
               <div style={styles.formGroup}> 
                 <label style={styles.filterLabel}>Date To</label> 
                 <input type="text" placeholder="DD/MM/YYYY" style={styles.input} /> 
               </div> 
             </div> 
             <div style={styles.filterFooter}> 
               <button style={styles.btnReset}>Reset</button> 
               <button style={styles.btnApply}>Apply Forensic Filters</button> 
             </div> 
           </div> 
         </div> 
       </div> 
     </div> 
   ); 
 }; 
  
 // --- Styled Components --- 
  
 const StatCard = ({ icon, label, val, color, textColor }) => ( 
   <div style={styles.statCard}> 
     <div style={{...styles.statIcon, background: color, color: textColor}}>{icon}</div> 
     <div style={styles.statInfo}> 
       <div style={styles.statLabel}>{label}</div> 
       <div style={styles.statValue}>{val}</div> 
     </div> 
   </div> 
 ); 
  
 const ActivityItem = ({ color, text, time }) => ( 
   <div style={styles.activityItem}> 
     <div style={{...styles.activityDot, background: color}}></div> 
     <div style={styles.activityContent}> 
       <p style={styles.activityText}>{text}</p> 
       <span style={styles.activityTime}>{time}</span> 
     </div> 
     <button style={styles.activityBtn}>Forensics</button> 
   </div> 
 ); 
  
 const FilterGroup = ({ label, span = 1 }) => ( 
   <div style={{...styles.formGroup, gridColumn: span > 1? `span ${span}` : 'span 1'}}> 
     <label style={styles.filterLabel}>{label}</label> 
     <select style={styles.input}><option>All</option></select> 
   </div> 
 ); 
  
 // --- Style Helpers --- 
  
 const getPriorityStyle = (p) => { 
   const base = { padding: '14px', fontWeight: '700', fontSize: '12.5px' }; 
   if (p === 'High') return {...base, color: 'var(--red)' }; 
   if (p === 'Medium') return {...base, color: 'var(--orange)' }; 
   return {...base, color: 'var(--blue)' }; 
 }; 
  
 const getStatusStyle = (s) => { 
   const base = { padding: '4px 10px', borderRadius: '20px', fontSize: '10.5px', fontWeight: '700' }; 
   return s === 'Open'? {...base, background: '#fee2e2', color: 'var(--red)' } : {...base, background: '#ffedd5', color: 'var(--orange)' }; 
 }; 
  
 const styles = { 
   container: { fontFamily: "'Sora', sans-serif", background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }, 
   content: { padding: '25px 40px' }, 
   statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }, 
   statCard: { background: 'white', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }, 
   statIcon: { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }, 
   statInfo: { display: 'flex', flexDirection: 'column' },
   statLabel: { fontSize: '11px', color: '#64748b', fontWeight: '600' }, 
   statValue: { fontSize: '22px', fontWeight: '700' }, 
   card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }, 
   cardTitle: { fontSize: '14px', fontWeight: '700', marginBottom: '18px', color: '#334155' }, 
   table: { width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }, 
   thead: { textAlign: 'left', background: '#f8fafc' }, 
   th: { padding: '12px 14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }, 
   tr: { borderBottom: '1px solid #f1f5f9' },
   td: { padding: '14px' }, 
   idCell: { padding: '14px', fontFamily: 'monospace', fontWeight: '700', color: '#475569' }, 
   projName: { padding: '14px', fontWeight: '600' }, 
   viewBtn: { color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '11.5px' }, 
   pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', fontSize: '11.5px', color: '#64748b' }, 
   pageLinks: { display: 'flex', gap: '4px' }, 
   pageLink: { width: '28px', height: '28px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600', background: 'white' }, 
   pageLinkActive: { background: '#0f1f3d', color: 'white', borderColor: '#0f1f3d' }, 
   bottomGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }, 
   activityItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }, 
   activityDot: { width: '9px', height: '9px', borderRadius: '50%', flexShrink: 0 }, 
   activityContent: { flex: 1 }, 
   activityText: { fontSize: '12.5px', fontWeight: '600', marginBottom: '2px' }, 
   activityTime: { fontSize: '10.5px', color: '#64748b' }, 
   activityBtn: { fontSize: '11px', color: '#2563eb', background: '#eff6ff', padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }, 
   filterGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }, 
   formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' }, 
   filterLabel: { fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }, 
   input: { padding: '9px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '12.5px', outline: 'none', background: 'white' }, 
   filterFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }, 
   btnReset: { padding: '9px 20px', border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }, 
   btnApply: { padding: '9px 20px', border: 'none', background: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }, 
 }; 
  
 export default AlertsDashboard;
