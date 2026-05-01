import React from 'react'; 
 
 const AlertsModule = () => { 
   return ( 
     <div className="alerts-container"> 
       <style>{` 
        .alerts-container { font-family: 'Sora', sans-serif; padding: 10px; } 
        .alert-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; } 
        .alert-stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; } 
        .alert-stat { background: #fff; border-radius: 10px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); } 
        .alert-stat-num { font-size: 24px; font-weight: 700; margin-top: 5px; } 
        .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; } 
        .high { background: #fef2f2; color: #dc2626; } 
        .open { background: #fef2f2; color: #dc2626; } 
        .panel { background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; } 
        .panel-title { font-size: 14px; font-weight: 600; margin-bottom: 15px; color: #1a2540; } 
        .activity-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f3f4f6; } 
        .activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; } 
        .red-dot { background: #ef4444; } 
        .blue-dot { background: #3b82f6; } 
        .data-table { width: 100%; border-collapse: collapse; font-size: 13px; } 
        .data-table th { background: #f9fafb; text-align: left; padding: 12px; color: #6b7280; border-bottom: 1px solid #e5e7eb; } 
        .data-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; } 
       `}</style> 
 
       {/* Alert Priority Dashboard: The Anomaly Pulse */} 
       <div className="alert-stat-cards"> 
         <div className="alert-stat"> 
           <div style={{fontSize: '12px', color: '#9ca3af'}}>High Priority (Critical)</div> 
           <div className="alert-stat-num" style={{color: '#dc2626'}}>5</div> 
         </div> 
         <div className="alert-stat"> 
           <div style={{fontSize: '12px', color: '#9ca3af'}}>Medium Risk</div> 
           <div className="alert-stat-num" style={{color: '#d97706'}}>8</div> 
         </div> 
         <div className="alert-stat"> 
           <div style={{fontSize: '12px', color: '#9ca3af'}}>Low Risk</div> 
           <div className="alert-stat-num" style={{color: '#2563eb'}}>12</div> 
         </div> 
         <div className="alert-stat"> 
           <div style={{fontSize: '12px', color: '#9ca3af'}}>Resolved Anomalies</div> 
           <div className="alert-stat-num" style={{color: '#16a34a'}}>25</div> 
         </div> 
       </div> 
 
       <div className="alert-grid"> 
         {/* System-Flagged Ledger: AI-Driven Interdiction */} 
         <div className="panel"> 
           <div className="panel-title">Active AI-Flagged Anomalies</div> 
           <table className="data-table"> 
             <thead> 
               <tr><th>Alert ID</th><th>Project</th><th>Priority</th><th>Vault Status</th></tr> 
             </thead> 
             <tbody> 
               <tr> 
                 <td>ALT001</td> 
                 <td>Road Construction</td> 
                 <td><span className="badge high">High</span></td> 
                 <td><span className="badge open">Frozen</span></td> 
               </tr> 
               <tr> 
                 <td>ALT003</td> 
                 <td>School Building</td> 
                 <td><span className="badge high">High</span></td> 
                 <td><span className="badge open">Frozen</span></td> 
               </tr> 
             </tbody> 
           </table> 
         </div> 
 
         {/* Security Event Log: The Forensics Activity Stream */} 
         <div className="panel"> 
           <div className="panel-title">24/7 Security Guard Log</div> 
           <div className="activity-item"> 
             <div className="activity-dot red-dot"></div> 
             <div> 
               <div style={{fontSize: '12px', fontWeight: 600}}>GPS Mismatch Detected</div> 
               <div style={{fontSize: '10px', color: '#9ca3af'}}>10:30 AM - Verification Failed</div> 
             </div> 
           </div> 
           <div className="activity-item"> 
             <div className="activity-dot blue-dot"></div> 
             <div> 
               <div style={{fontSize: '12px', fontWeight: 600}}>Vault Milestone Unlocked</div> 
               <div style={{fontSize: '10px', color: '#9ca3af'}}>Yesterday - Proof Validated</div> 
             </div> 
           </div> 
         </div> 
       </div> 
     </div> 
   ); 
 }; 
 
 export default AlertsModule;
