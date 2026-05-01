import React, { useState } from 'react'; 
 
 const SettingsModule = () => { 
   // State for Tab Management 
   const [activeTab, setActiveTab] = useState('General'); 
 
   // State for Governance Rules 
   const [autoFreeze, setAutoFreeze] = useState(true); 
   const [citizenFeed, setCitizenFeed] = useState(true); 
 
   return ( 
     <div className="settings-panel"> 
       {/* Visual Identity & Logic Styles */} 
       <style>{` 
        .settings-panel { 
           background: #fff; border-radius: 10px; padding: 24px; 
           box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-family: 'Sora', sans-serif; 
         } 
        .settings-tabs { display: flex; border-bottom: 1px solid #e5e7eb; margin-bottom: 24px; } 
        .settings-tab { 
           padding: 10px 18px; color: #6b7280; font-weight: 500; 
           border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.2s; 
         } 
        .tab-active { color: #2563eb; border-bottom-color: #2563eb; } 
         
        .form-group { margin-bottom: 20px; } 
        .form-label { font-size: 12px; font-weight: 600; display: block; margin-bottom: 8px; color: #1a2540; } 
        .form-input { 
           width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; 
           font-family: inherit; font-size: 13px; outline: none; background: #f9fafb; 
         } 
        .form-input:focus { border-color: #2563eb; background: #fff; } 
 
        .toggle-item { 
           display: flex; justify-content: space-between; align-items: center; 
           padding: 14px 0; border-bottom: 1px solid #f3f4f6; 
         } 
        .toggle-switch { 
           width: 44px; height: 22px; border-radius: 11px; position: relative; 
           cursor: pointer; transition: background 0.3s; 
         } 
        .toggle-on { background: #22c55e; } 
        .toggle-off { background: #e5e7eb; } 
        .toggle-switch::after { 
           content: ''; position: absolute; top: 2px; width: 18px; height: 18px; 
           background: #fff; border-radius: 50%; transition: all 0.3s; 
           box-shadow: 0 1px 2px rgba(0,0,0,0.2); 
         } 
        .toggle-on::after { left: 24px; } 
        .toggle-off::after { left: 2px; } 
 
        .save-btn { 
           background: #2563eb; color: #fff; border: none; padding: 12px 24px; 
           border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; 
         } 
        .save-btn:hover { background: #1d4ed8; } 
       `}</style> 
 
       {/* Tabs: Governance Architecture Selection */} 
       <div className="settings-tabs"> 
         <div 
           className={`settings-tab ${activeTab === 'General'? 'tab-active' : ''}`} 
           onClick={() => setActiveTab('General')} 
         > 
           General Governance 
         </div> 
         <div 
           className={`settings-tab ${activeTab === 'Vault'? 'tab-active' : ''}`} 
           onClick={() => setActiveTab('Vault')} 
         > 
           Vault Config 
         </div> 
         <div 
           className={`settings-tab ${activeTab === 'DID'? 'tab-active' : ''}`} 
           onClick={() => setActiveTab('DID')} 
         > 
           DID / Security 
         </div> 
       </div> 
 
       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}> 
         {/* Left Column: Smart Contract Parameters */} 
         <div> 
           <div className="form-group"> 
             <label className="form-label">System Governance Name</label> 
             <input className="form-input" type="text" defaultValue="Quantrix Public Fund Tracking" /> 
           </div> 
           <div className="form-group"> 
             <label className="form-label">Vault Multisig Threshold (M-of-N)</label> 
             <select className="form-input"> 
               <option>3 of 5 required signatures</option> 
               <option>4 of 7 required signatures</option> 
               <option>Unanimous (Not Recommended)</option> 
             </select> 
           </div> 
         </div> 
 
         {/* Right Column: AI & Transparency Toggles */} 
         <div> 
           <div className="toggle-item"> 
             <div> 
               <div style={{ fontSize: '13px', fontWeight: 600 }}>Autonomous Freeze</div> 
               <div style={{ fontSize: '11px', color: '#9ca3af' }}>Enable AI to pause vault instantly</div> 
             </div> 
             <div 
               className={`toggle-switch ${autoFreeze? 'toggle-on' : 'toggle-off'}`} 
               onClick={() => setAutoFreeze(!autoFreeze)} 
             /> 
           </div> 
           
           <div className="toggle-item"> 
             <div> 
               <div style={{ fontSize: '13px', fontWeight: 600 }}>Citizen Map Feed</div> 
               <div style={{ fontSize: '11px', color: '#9ca3af' }}>Sync verified proof to public map</div> 
             </div> 
             <div 
               className={`toggle-switch ${citizenFeed? 'toggle-on' : 'toggle-off'}`} 
               onClick={() => setCitizenFeed(!citizenFeed)} 
             /> 
           </div> 
         </div> 
       </div> 
 
       <div style={{ textAlign: 'right', marginTop: '30px' }}> 
         <button className="save-btn" onClick={() => alert('Governance rules updated on-chain.')}> 
           💾 Save Governance Rules 
         </button> 
       </div> 
     </div> 
   ); 
 }; 
 
 export default SettingsModule;
