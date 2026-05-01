import React, { useState } from 'react'; 
 
 const ReviewsLedger = () => { 
   const [searchTerm, setSearchTerm] = useState(''); 
 
   // --- Theme Variables --- 
   const theme = { 
     navy: '#0f1f3d', 
     blueLight: '#2563eb', 
     green: '#10b981', 
     amber: '#f59e0b', 
     red: '#ef4444', 
     white: '#ffffff', 
     gray50: '#f8fafc', 
     gray100: '#f1f5f9', 
     gray200: '#e2e8f0', 
     gray600: '#475569', 
     text: '#1e293b', 
   }; 
 
   // --- Historical Review Data --- 
   const auditHistory = [ 
     { id: 'TXN1005', project: 'Road Construction', auditor: 'Auditor 01', status: 'Flagged', date: '23 May 2024', severity: 'High' }, 
     { id: 'TXN1004', project: 'Water Supply', auditor: 'Auditor 02', status: 'Cleared', date: '22 May 2024', severity: 'Low' }, 
     { id: 'TXN1003', project: 'School Building', auditor: 'Auditor 01', status: 'Rejected', date: '21 May 2024', severity: 'Critical' }, 
     { id: 'TXN1002', project: 'Drainage System', auditor: 'Auditor 03', status: 'Under Review', date: '20 May 2024', severity: 'Medium' }, 
     { id: 'TXN1001', project: 'Community Hall', auditor: 'Auditor 01', status: 'Cleared', date: '19 May 2024', severity: 'Low' }, 
   ]; 
 
   const styles = { 
     container: { fontFamily: "'Sora', sans-serif", background: theme.gray50, minHeight: '100vh', padding: '24px 28px' }, 
     header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }, 
     title: { fontSize: '20px', fontWeight: '700', color: theme.text }, 
     
     toolbar: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '16px' }, 
     searchWrap: { position: 'relative', flex: 1, maxWidth: '400px' }, 
     searchInput: { width: '100%', padding: '10px 14px 10px 38px', border: `1.5px solid ${theme.gray200}`, borderRadius: '10px', outline: 'none', fontSize: '13px' }, 
     searchIcon: { position: 'absolute', left: '12px', top: '10px', fontSize: '14px' }, 
     
     tableCard: { background: 'white', borderRadius: '14px', border: `1px solid ${theme.gray200}`, overflow: 'hidden' }, 
     table: { width: '100%', borderCollapse: 'collapse' }, 
     th: { background: theme.gray50, padding: '13px 16px', textAlign: 'left', fontSize: '12px', color: theme.gray600, textTransform: 'uppercase', borderBottom: `1px solid ${theme.gray200}` }, 
     td: { padding: '14px 16px', fontSize: '13px', color: theme.text, borderBottom: `1px solid ${theme.gray100}` }, 
     
     badge: (status) => { 
       let bg = 'rgba(148, 163, 184, 0.1)'; 
       let color = theme.gray600; 
       if (status === 'Flagged') { bg = 'rgba(239, 68, 68, 0.1)'; color = theme.red; } 
       if (status === 'Cleared') { bg = 'rgba(16, 185, 129, 0.1)'; color = theme.green; } 
       if (status === 'Rejected') { bg = 'rgba(124, 58, 237, 0.1)'; color = '#7c3aed'; } 
       if (status === 'Under Review') { bg = 'rgba(245, 158, 11, 0.1)'; color = theme.amber; } 
       return { background: bg, color: color, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }; 
     }, 
 
     severity: (lvl) => ({ 
       color: lvl === 'Critical' || lvl === 'High' ? theme.red : lvl === 'Medium' ? theme.amber : theme.green, 
       fontWeight: '700' 
     }), 
 
     btnAction: { padding: '6px 14px', background: 'rgba(37,99,235,0.08)', color: theme.blueLight, border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' } 
   }; 
 
   return ( 
     <div style={styles.container}> 
       <div style={styles.header}> 
         <h1 style={styles.title}>Audit Reviews & Governance Ledger</h1> 
         <div style={{ fontSize: '13px', color: theme.gray600 }}>Total Records: {auditHistory.length}</div> 
       </div> 
 
       <div style={styles.toolbar}> 
         <div style={styles.searchWrap}> 
           <span style={styles.searchIcon}>🔍</span> 
           <input 
             type="text" 
             placeholder="Search by Txn ID, Project, or Auditor..." 
             style={styles.searchInput} 
             onChange={(e) => setSearchTerm(e.target.value)} 
           /> 
         </div> 
         <select style={{ padding: '8px 14px', borderRadius: '10px', border: `1.5px solid ${theme.gray200}`, outline: 'none', cursor: 'pointer', fontSize: '13px' }}> 
           <option>All Statuses</option> 
           <option>Cleared</option> 
           <option>Flagged</option> 
           <option>Rejected</option> 
         </select> 
       </div> 
 
       <div style={styles.tableCard}> 
         <table style={styles.table}> 
           <thead> 
             <tr> 
               <th style={styles.th}>Txn ID</th> 
               <th style={styles.th}>Project Context</th> 
               <th style={styles.th}>Assigned Auditor</th> 
               <th style={styles.th}>Review Status</th> 
               <th style={styles.th}>Forensic Severity</th> 
               <th style={styles.th}>Timestamp</th> 
               <th style={styles.th}>Action</th> 
             </tr> 
           </thead> 
           <tbody> 
             {auditHistory.map((item) => ( 
               <tr key={item.id}> 
                 <td style={{ ...styles.td, fontWeight: '700', color: theme.blueLight }}>{item.id}</td> 
                 <td style={{ ...styles.td, fontWeight: '600' }}>{item.project}</td> 
                 <td style={styles.td}>{item.auditor}</td> 
                 <td style={styles.td}> 
                   <span style={styles.badge(item.status)}>{item.status}</span> 
                 </td> 
                 <td style={{ ...styles.td, ...styles.severity(item.severity) }}>{item.severity}</td> 
                 <td style={{ ...styles.td, color: theme.gray600 }}>{item.date}</td> 
                 <td style={styles.td}> 
                   <button style={styles.btnAction}>Open File</button> 
                 </td> 
               </tr> 
             ))} 
           </tbody> 
         </table> 
       </div> 
     </div> 
   ); 
 }; 
 
 export default ReviewsLedger;
