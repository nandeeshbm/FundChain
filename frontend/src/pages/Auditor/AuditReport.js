import React, { useState } from 'react'; 
  
 const AuditReport = () => { 
   // State for report generation logic 
   const [loading, setLoading] = useState(false); 
  
   // Mock data representing the "Shared Source of Truth"  
   const projectSummary = [
     { name: 'Road Construction', total: 45, approved: 35, flagged: 6, rejected: 4 },
     { name: 'School Building', total: 30, approved: 22, flagged: 5, rejected: 3 },
     { name: 'Water Supply', total: 25, approved: 20, flagged: 2, rejected: 3 },
     { name: 'Community Hall', total: 20, approved: 15, flagged: 1, rejected: 4 }
   ]; 
  
   const handleGenerateReport = () => { 
     setLoading(true); 
     setTimeout(() => { 
       alert("Fetching encrypted audit trails from the Robotic Vault..."); 
       setLoading(false); 
     }, 1000); 
   }; 
  
   return ( 
     <div style={styles.container}> 
       {/* Design System & Typography */} 
       <style>{` 
         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap'); 
         :root { 
           --navy: #0f1f3d; --blue: #1e4db7; --blue-light: #2563eb; 
           --green: #10b981; --amber: #f59e0b; --red: #ef4444; 
           --purple: #7c3aed; --gray-200: #e2e8f0; --text: #1e293b; 
         } 
       `}</style> 
  
       <div style={styles.content}> 
         {/* Filter Bar: Parametric Auditing Controls  */} 
         <div style={styles.filterBar}> 
           <div style={styles.filterGroup}> 
             <label style={styles.filterLabel}>Project Scope</label> 
             <select style={styles.filterInput}> 
               <option>All Projects</option> 
               <option>Road Construction</option> 
               <option>School Building</option> 
             </select> 
           </div> 
           <div style={styles.filterGroup}> 
             <label style={styles.filterLabel}>On-Chain Status</label> 
             <select style={styles.filterInput}> 
               <option>All Status</option> 
               <option>Forensically Approved</option> 
               <option>AI Flagged</option> 
               <option>Settlement Rejected</option> 
             </select> 
           </div> 
           <div style={styles.filterGroup}> 
             <label style={styles.filterLabel}>Date From</label> 
             <input type="date" style={styles.filterInput} defaultValue="2024-05-09" /> 
           </div> 
           <div style={styles.filterGroup}> 
             <label style={styles.filterLabel}>Date To</label> 
             <input type="date" style={styles.filterInput} defaultValue="2024-05-31" /> 
           </div> 
           <button  
             style={styles.btnGenerate}  
             onClick={handleGenerateReport} 
             disabled={loading} 
           > 
             {loading? 'Processing...' : 'Generate Forensic Report'} 
           </button> 
         </div> 
  
         {/* Summary Pulse: Macro-Audit Metrics */} 
         <div style={styles.summaryGrid}> 
           <SummaryCard label="Total On-Chain Txn" value="120" /> 
           <SummaryCard label="Approved (Valid Proof)" value="92" color="var(--green)" /> 
           <SummaryCard label="Flagged (AI Interdiction)" value="14" color="var(--red)" /> 
           <SummaryCard label="Rejected (Fraud Blocked)" value="14" color="var(--amber)" /> 
         </div> 
  
         {/* Project Wise Summary: Continuous Auditing Ledger  */} 
         <div style={styles.card}> 
           <div style={styles.cardTitle}>Granular Project Performance</div> 
           <table style={styles.table}> 
             <thead style={styles.thead}> 
               <tr> 
                 <th style={styles.th}>Infrastructure Asset</th> 
                 <th style={styles.th}>Vault Txns</th> 
                 <th style={styles.th}>Approved</th> 
                 <th style={styles.th}>Flagged</th> 
                 <th style={styles.th}>Rejected</th> 
               </tr> 
             </thead> 
             <tbody> 
               {projectSummary.map((p, index) => ( 
                 <tr key={index}> 
                   <td style={{...styles.td, fontWeight: '600'}}>{p.name}</td> 
                   <td style={styles.td}>{p.total}</td> 
                   <td style={{...styles.td, color: 'var(--green)', fontWeight: '700'}}>{p.approved}</td> 
                   <td style={{...styles.td, color: 'var(--red)', fontWeight: '700'}}>{p.flagged}</td> 
                   <td style={{...styles.td, color: 'var(--amber)', fontWeight: '700'}}>{p.rejected}</td> 
                 </tr> 
               ))} 
             </tbody> 
           </table> 
         </div> 
  
         {/* Overall Summary Card: The Immutable Fiscal Signature */} 
         <div style={styles.overallCard}> 
           <div style={styles.overallTitle}>📊 Automated Fiscal Summary (Consolidated)</div> 
           <div style={styles.overallGrid}> 
             <div style={styles.overallItem}> 
               <div style={styles.overallLabel}>Aggregate Transactions</div> 
               <div style={styles.overallVal}>120</div> 
             </div> 
             <div style={styles.overallItem}> 
               <div style={styles.overallLabel}>Proof Validation Rate</div> 
               <div style={{...styles.overallVal, color: '#6ee7b7'}}>92</div> 
             </div> 
             <div style={styles.overallItem}> 
               <div style={styles.overallLabel}>Risk Mitigation Count</div> 
               <div style={{...styles.overallVal, color: '#fca5a5'}}>14</div> 
             </div> 
           </div> 
         </div> 
       </div> 
     </div> 
   ); 
 }; 
  
 // Sub-components 
 const SummaryCard = ({ label, value, color }) => ( 
   <div style={styles.statCard}> 
     <div style={styles.statLabel}>{label}</div> 
     <div style={{...styles.statValue, color: color || 'var(--text)'}}>{value}</div> 
   </div> 
 ); 
  
 // JSS styles 
 const styles = { 
   container: { fontFamily: "'Sora', sans-serif", background: '#f8fafc', minHeight: '100vh' }, 
   content: { padding: '24px 28px' }, 
   filterBar: { background: 'white', borderRadius: '14px', padding: '16px 20px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }, 
   filterGroup: { display: 'flex', flexDirection: 'column', gap: '4px' }, 
   filterLabel: { fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }, 
   filterInput: { padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: 'white' }, 
   btnGenerate: { padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-end' }, 
   summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }, 
   statCard: { background: 'white', borderRadius: '14px', padding: '18px 20px', border: '1px solid #e2e8f0' }, 
   statLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }, 
   statValue: { fontSize: '26px', fontWeight: '700', marginTop: '4px' }, 
   card: { background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '20px' }, 
   cardTitle: { fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }, 
   table: { width: '100%', borderCollapse: 'collapse' }, 
   thead: { background: '#f8fafc' }, 
   th: { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }, 
   td: { padding: '13px 16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }, 
   overallCard: { background: 'linear-gradient(135deg, #0f1f3d 0%, #1e4db7 100%)', borderRadius: '14px', padding: '24px', color: 'white' }, 
   overallTitle: { fontSize: '14px', fontWeight: '700', marginBottom: '16px', opacity: 0.9 }, 
   overallGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }, 
   overallItem: { display: 'block' }, 
   overallLabel: { fontSize: '11px', opacity: 0.65, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }, 
   overallVal: { fontSize: '22px', fontWeight: '700', marginTop: '4px' }, 
 }; 
  
 export default AuditReport;
