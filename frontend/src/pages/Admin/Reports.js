import React from 'react'; 
 
 const ReportsModule = () => { 
   return ( 
     <div className="reports-container"> 
       {/* Visual Identity & Styles */} 
       <style>{` 
         :root { 
           --navy: #1a2540; 
           --blue: #2563eb; 
           --green: #22c55e; 
           --orange: #fff7ed; 
           --gray-100: #f3f4f6; 
           --text: #1a2540; 
         } 
        .reports-container { font-family: 'Sora', sans-serif; color: var(--text); padding: 10px; } 
        .stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; } 
        .stat-card { background: #fff; border-radius: 10px; padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); } 
        .stat-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; } 
        .blue { background: #eff6ff; } 
        .purple { background: #f5f3ff; } 
        .green-bg { background: #f0fdf4; } 
        .orange-bg { background: #fff7ed; } 
        .stat-label { font-size: 12px; color: #9ca3af; font-weight: 500; } 
        .stat-value { font-size: 16px; font-weight: 700; color: var(--navy); } 
        .panel { background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; } 
        .panel-title { font-size: 14px; font-weight: 600; margin-bottom: 15px; } 
        .donut-wrap { display: flex; align-items: center; gap: 20px; } 
        .donut-chart { position: relative; width: 110px; height: 110px; } 
        .donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-weight: 700; } 
        .bar-chart { display: flex; align-items: flex-end; gap: 10px; height: 100px; } 
        .bar { border-radius: 4px 4px 0 0; width: 100%; min-height: 5px; transition: height 0.3s ease; } 
        .data-table { width: 100%; border-collapse: collapse; font-size: 13px; } 
        .data-table th { background: #f9fafb; text-align: left; padding: 12px; color: #6b7280; border-bottom: 1px solid #e5e7eb; } 
        .data-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; } 
       `}</style> 
 
       {/* Stat Cards: Real-Time Utilization Pulse */} 
       <div className="stat-cards"> 
         <div className="stat-card"> 
           <div className="stat-icon blue">📄</div> 
           <div><div className="stat-label">Total Projects</div><div className="stat-value">25</div></div> 
         </div> 
         <div className="stat-card"> 
           <div className="stat-icon purple">💰</div> 
           <div><div className="stat-label">Total Budget</div><div className="stat-value">₹ 25,00,00,000</div></div> 
         </div> 
         <div className="stat-card"> 
           <div className="stat-icon green-bg">✅</div> 
           <div><div className="stat-label">Total Released</div><div className="stat-value">₹ 12,50,00,000</div></div> 
         </div> 
         <div className="stat-card"> 
           <div className="stat-icon orange-bg">📊</div> 
           <div><div className="stat-label">Total Utilized</div><div className="stat-value">₹ 7,80,00,000</div></div> 
         </div> 
       </div> 
 
       {/* Analytics Row: Visualizing the Robotic Vault Integrity */} 
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}> 
         <div className="panel"> 
           <div className="panel-title">Fund Utilization Overview</div> 
           <div className="donut-wrap"> 
             <div className="donut-chart"> 
               <svg viewBox="0 0 110 110"> 
                 <circle cx="55" cy="55" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12"/> 
                 <circle 
                   cx="55" cy="55" r="40" fill="none" stroke="#22c55e" 
                   strokeWidth="12" strokeDasharray="150 100" 
                   transform="rotate(-90 55 55)" 
                 /> 
               </svg> 
               <div className="donut-center">62%</div> 
             </div> 
             <div> 
               <div style={{ fontSize: 12, color: '#6b7280' }}> 
                 Utilized: <span style={{ color: '#1a2540', fontWeight: 600 }}>₹ 7.8Cr</span> 
               </div> 
               <div style={{ fontSize: 12, color: '#6b7280' }}> 
                 Vault Balance: <span style={{ color: '#1a2540', fontWeight: 600 }}>₹ 17.2Cr</span> 
               </div> 
             </div> 
           </div> 
         </div> 
 
         <div className="panel"> 
           <div className="panel-title">Project Status Summary</div> 
           <div className="bar-chart"> 
             <div style={{ flex: 1 }}> 
               <div className="bar" style={{ height: '75%', background: '#3b82f6' }}></div> 
               <div style={{ fontSize: 10, textAlign: 'center', marginTop: 4 }}>Active</div> 
             </div> 
             <div style={{ flex: 1 }}> 
               <div className="bar" style={{ height: '30%', background: '#2563eb' }}></div> 
               <div style={{ fontSize: 10, textAlign: 'center', marginTop: 4 }}>Done</div> 
             </div> 
             <div style={{ flex: 1 }}> 
               <div className="bar" style={{ height: '15%', background: '#f59e0b' }}></div> 
               <div style={{ fontSize: 10, textAlign: 'center', marginTop: 4 }}>Plan</div> 
             </div> 
           </div> 
         </div> 
       </div> 
 
       {/* Forensic Audit Records Table */} 
       <div className="panel"> 
         <div className="panel-title">Forensic Audit Records (Immutable Evidence)</div> 
         <table className="data-table"> 
           <thead> 
             <tr> 
               <th>ID</th> 
               <th>Report Name</th> 
               <th>Generated On</th> 
               <th>Action</th> 
             </tr> 
           </thead> 
           <tbody> 
             <tr> 
               <td>RPT001</td> 
               <td>Project Wise Summary</td> 
               <td>12 May 2024</td> 
               <td style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>⬇ Download</td> 
             </tr> 
             <tr> 
               <td>RPT002</td> 
               <td>Fund Utilization</td> 
               <td>11 May 2024</td> 
               <td style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>⬇ Download</td> 
             </tr> 
           </tbody> 
         </table> 
       </div> 
     </div> 
   ); 
 }; 
 
 export default ReportsModule;
