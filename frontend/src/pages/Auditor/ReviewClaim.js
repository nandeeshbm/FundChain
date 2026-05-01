import React, { useState } from 'react'; 
  
 const ReviewTransaction = () => { 
   const [comment, setComment] = useState(''); 
  
   // Technical Transaction Data
   const txnData = { 
     id: 'TXN1005', 
     project: 'Road Construction (PJT001)', 
     contractor: 'ABC Infra', 
     type: 'Milestone Utilization', 
     amount: '₹ 20,000', 
     date: '23 May 2024', 
     status: 'Flagged by AI', 
     reason: 'High Amount + Location Mismatch' 
   }; 
  
   const handleAction = (type) => { 
     alert(`Action: ${type}. Finalizing forensic signature for the Robotic Vault...`); 
   }; 
  
   return ( 
     <div style={styles.container}> 
       <style>{` 
         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap'); 
         :root { 
           --navy: #0f1f3d; --blue-light: #2563eb; --purple: #7c3aed; 
           --green: #10b981; --amber: #f59e0b; --red: #ef4444; 
           --gray-200: #e2e8f0; --text: #1e293b; 
         } 
       `}</style> 
  
       <div style={styles.content}> 
         <div style={styles.backLink}>← Back to Forensic Flagged List</div> 
         <h2 style={styles.pageTitle}>Transaction Audit & Forensic Review</h2> 
  
         <div style={styles.reviewGrid}> 
           {/* Section 1: Transaction Metadata (The Robotic Vault State) */} 
           <div style={styles.card}> 
             <div style={styles.cardTitle}>Vault Transaction Details</div> 
             <DetailRow label="On-Chain Txn ID" value={txnData.id} isMono={true} /> 
             <DetailRow label="Smart Contract Ref" value={txnData.project} /> 
             <DetailRow label="Contractor Identity" value={txnData.contractor} /> 
             <DetailRow label="Verification Type" value={txnData.type} /> 
             <div style={styles.detailRow}> 
               <span style={styles.detailLabel}>Disbursement Amount</span> 
               <span style={{...styles.detailValue, fontSize: '16px', color: 'var(--text)'}}>{txnData.amount}</span> 
             </div> 
             <DetailRow label="Timestamp" value={txnData.date} /> 
             <div style={styles.detailRow}> 
               <span style={styles.detailLabel}>Security Status</span> 
               <span style={styles.detailValue}><span style={styles.badgeFlagged}>🚩 Flagged by Guard</span></span> 
             </div> 
             <DetailRow label="Interdiction Reason" value={txnData.reason} color="var(--red)" /> 
           </div> 
  
           {/* Section 2: Submitted Proof (The Un-fakeable Evidence) */} 
           <div style={styles.card}> 
             <div style={styles.cardTitle}>Un-fakeable Proof Submission</div> 
             <div style={styles.proofGrid}> 
               <div style={styles.proofImg}>🏗️</div> 
               <div style={styles.proofImg}>🛣️</div> 
               <div style={styles.proofImg}>🚧</div> 
               <div style={styles.proofImg}>📷</div> 
             </div> 
              
             <div style={styles.locationInfo}> 
               <div style={styles.locTitle}>📍 Geospatial Witness (GPS)</div> 
               <div style={styles.locVal}>22.5738° N, 88.3639° E</div> 
               <div style={styles.locDate}>Submitted via Verified Mobile App: 10:15 AM</div> 
             </div> 
  
             <div style={styles.remarksBox}> 
               <div style={styles.remarksTitle}>⚠️ 24/7 Security Guard Remark</div> 
               <div style={styles.remarksText}> 
                 Anomaly Detected: Transaction amount exceeds milestone benchmark by 15%.  
                 Visual GPS metadata does not align with the registered project perimeter. 
               </div> 
             </div> 
           </div> 
         </div> 
  
         {/* Section 3: Final Forensic Decision */} 
         <div style={{...styles.card, marginTop: '20px'}}> 
           <div style={styles.cardTitle}>Auditor Action: Secure Settlement</div> 
           <div style={styles.actionBtns}> 
             <button style={styles.btnApprove} onClick={() => handleAction('Approve')}>✅ Release Funds</button> 
             <button style={styles.btnReject} onClick={() => handleAction('Reject')}>❌ Reject & Freeze Account</button> 
             <button style={styles.btnMore} onClick={() => handleAction('Request Info')}>📩 Request Forensic Info</button> 
           </div> 
           <label style={styles.commentLabel}>Write Audit Comments (Optional)</label> 
           <textarea  
             style={styles.textarea}  
             placeholder="Enter rationale for override or rejection here..." 
             value={comment} 
             onChange={(e) => setComment(e.target.value)} 
           /> 
         </div> 
       </div> 
     </div> 
   ); 
 }; 
  
 // Helper Component for Details 
 const DetailRow = ({ label, value, isMono, color }) => ( 
   <div style={styles.detailRow}> 
     <span style={styles.detailLabel}>{label}</span> 
     <span style={{ 
      ...styles.detailValue,  
       fontFamily: isMono? 'monospace' : 'inherit', 
       color: color || 'var(--text)' 
     }}>{value}</span> 
   </div> 
 ); 
  
 // JSS Object 
 const styles = { 
   container: { fontFamily: "'Sora', sans-serif", background: '#f8fafc', minHeight: '100vh' }, 
   content: { padding: '24px 28px' }, 
   backLink: { fontSize: '13px', color: '#2563eb', cursor: 'pointer', marginBottom: '20px' }, 
   pageTitle: { fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }, 
   reviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }, 
   card: { background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }, 
   cardTitle: { fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '18px' }, 
   detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }, 
   detailLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '500' }, 
   detailValue: { fontSize: '13px', fontWeight: '600', textAlign: 'right', maxWidth: '60%' }, 
   badgeFlagged: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }, 
   proofGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }, 
   proofImg: { width: '100%', height: '120px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }, 
   locationInfo: { background: '#f8fafc', borderRadius: '10px', padding: '14px', border: '1px solid #e2e8f0' }, 
   locTitle: { fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }, 
   locVal: { fontSize: '13px', fontWeight: '600', color: '#1e293b' }, 
   locDate: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' }, 
   remarksBox: { background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '14px', marginTop: '16px' }, 
   remarksTitle: { fontSize: '12px', fontWeight: '700', color: '#ef4444', marginBottom: '6px' }, 
   remarksText: { fontSize: '13px', color: '#475569', lineHeight: '1.6' }, 
   actionBtns: { display: 'flex', gap: '10px', flexWrap: 'wrap' }, 
   btnApprove: { padding: '11px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }, 
   btnReject: { padding: '11px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }, 
   btnMore: { padding: '11px 24px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }, 
   textarea: { width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', minHeight: '80px', marginTop: '14px', outline: 'none' }, 
   commentLabel: { fontSize: '12px', fontWeight: '600', color: '#475569', marginTop: '16px', display: 'block' }, 
 }; 
  
 export default ReviewTransaction;
