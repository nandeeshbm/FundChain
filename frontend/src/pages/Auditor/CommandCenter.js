import React, { useState } from 'react'; 
  
 const AuditorCommandCenter = () => { 
   const [selectedClaim, setSelectedClaim] = useState(null); 
  
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
  
   // --- Mock Data: Flagged Claims --- 
   const flaggedClaims = [ 
     { 
       id: 'TXN1001', 
       project: 'Road Construction', 
       contractor: 'ABC Infra', 
       amount: '50,00,000', 
       status: 'Flagged', 
       reason: 'Location Mismatch', 
       gpsDist: '8.2 km', 
       apiMatch: 'Success', 
       img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?auto=format&fit=crop&w=300&q=80' 
     }, 
     { 
       id: 'TXN1002', 
       project: 'School Building', 
       contractor: 'Buildwell Pvt', 
       amount: '30,00,000', 
       status: 'Flagged', 
       reason: 'Price Mismatch', 
       gpsDist: '0.4 km', 
       apiMatch: 'Failed', 
       img: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=300&q=80' 
     } 
   ]; 
  
   const styles = { 
     container: { background: 'transparent', fontFamily: "'Sora', sans-serif" }, 
     main: { flex: 1 }, 
     header: { marginBottom: '24px' }, 
     title: { fontSize: '24px', fontWeight: '700', color: theme.text }, 
     grid: { display: 'grid', gridTemplateColumns: selectedClaim ? '1fr 1fr' : '1fr', gap: '24px', transition: 'all 0.3s' }, 
      
     // List Card 
     card: { background: 'white', borderRadius: '16px', border: `1px solid ${theme.gray200}`, overflow: 'hidden' }, 
     th: { background: theme.gray50, padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: theme.gray600, textTransform: 'uppercase' }, 
     td: { padding: '16px', fontSize: '13px', borderBottom: `1px solid ${theme.gray100}` }, 
      
     // Command Center Panel (The Review Logic) 
     panel: { background: 'white', borderRadius: '16px', border: `2px solid ${theme.blueLight}`, padding: '24px', position: 'sticky', top: '24px' }, 
     alertBanner: { background: 'rgba(239, 68, 68, 0.1)', color: theme.red, padding: '12px', borderRadius: '8px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }, 
      
     // Verification Items 
     verifyBox: { display: 'flex', justifyContent: 'space-between', padding: '12px', background: theme.gray50, borderRadius: '8px', marginBottom: '10px' }, 
     verifyLabel: { fontSize: '12px', color: theme.gray600, fontWeight: '500' }, 
     verifyStatus: (isOk) => ({ fontSize: '12px', fontWeight: '700', color: isOk ? theme.green : theme.red }), 
      
     // Action Buttons 
     actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }, 
     btnApprove: { padding: '12px', background: theme.green, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }, 
     btnFreeze: { padding: '12px', background: theme.red, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' } 
   }; 
  
   return ( 
     <div style={styles.container}> 
       <main style={styles.main}> 
         <div style={styles.grid}> 
           {/* Transaction List */} 
           <div style={styles.card}> 
             <table style={{ width: '100%', borderCollapse: 'collapse' }}> 
               <thead> 
                 <tr> 
                   <th style={styles.th}>Transaction ID</th> 
                   <th style={styles.th}>Project</th> 
                   <th style={styles.th}>Anomaly Reason</th> 
                   <th style={styles.th}>Action</th> 
                 </tr> 
               </thead> 
               <tbody> 
                 {flaggedClaims.map((claim) => ( 
                   <tr key={claim.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedClaim(claim)}> 
                     <td style={{ ...styles.td, fontWeight: '700', color: theme.blueLight }}>{claim.id}</td> 
                     <td style={styles.td}>{claim.project}</td> 
                     <td style={styles.td}> 
                       <span style={{ color: theme.red, fontWeight: '600' }}>⚠️ {claim.reason}</span> 
                     </td> 
                     <td style={styles.td}> 
                       <button style={{ padding: '6px 12px', background: theme.gray100, border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}> 
                         Investigate 
                       </button> 
                     </td> 
                   </tr> 
                 ))} 
               </tbody> 
             </table> 
           </div> 
  
           {/* Investigaton Panel (Command Center Feature) */} 
           {selectedClaim && ( 
             <div style={styles.panel}> 
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}> 
                 <h3 style={{ fontWeight: '700' }}>Reviewing {selectedClaim.id}</h3> 
                 <button onClick={() => setSelectedClaim(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: theme.gray600 }}>✕ Close</button> 
               </div> 
  
               <div style={styles.alertBanner}> 
                 <span>🚨 ANOMALY DETECTED: {selectedClaim.reason}</span> 
               </div> 
  
               {/* Physical Evidence */} 
               <div style={{ marginBottom: '20px' }}> 
                 <label style={{ fontSize: '11px', fontWeight: '700', color: theme.gray600, textTransform: 'uppercase' }}>Site Proof (IPFS Geotagged)</label> 
                 <img src={selectedClaim.img} alt="proof" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', marginTop: '8px' }} /> 
               </div> 
  
               {/* Sentinel Verification Logic */} 
               <div style={styles.verifyBox}> 
                 <span style={styles.verifyLabel}>GPS Geofence (Allowed: 1km)</span> 
                 <span style={styles.verifyStatus(parseFloat(selectedClaim.gpsDist) < 1)}>{selectedClaim.gpsDist} Mismatch</span> 
               </div> 
               <div style={styles.verifyBox}> 
                 <span style={styles.verifyLabel}>Govt Tax API Handshake</span> 
                 <span style={styles.verifyStatus(selectedClaim.apiMatch === 'Success')}>{selectedClaim.apiMatch}</span> 
               </div> 
  
               {/* Action Cards */} 
               <div style={styles.actionGrid}> 
                 <button  
                   style={styles.btnApprove}  
                   onClick={() => alert(`Funds for ${selectedClaim.id} released via Escrow Vault.`)} 
                 > 
                   APPROVE 
                 </button> 
                 <button  
                   style={styles.btnFreeze}  
                   onClick={() => alert(`CRITICAL ALERT: Escrow Vault for project ${selectedClaim.project} has been FROZEN.`)} 
                 > 
                   FREEZE VAULT 
                 </button> 
               </div> 
             </div> 
           )} 
         </div> 
       </main> 
     </div> 
   ); 
 }; 
  
 export default AuditorCommandCenter;
