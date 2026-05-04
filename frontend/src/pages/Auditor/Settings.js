import React, { useState } from "react";

function AuditorSettings() {
  const [autoEscalation, setAutoEscalation] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [anonymousMasking, setAnonymousMasking] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState("medium");
  const [reviewWindow, setReviewWindow] = useState("72h");

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Auditor Settings</h2>
        <p style={styles.subtitle}>Manage forensic review workflow, escalation rules, and evidence verification behavior.</p>

        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Risk Threshold</label>
            <select style={styles.input} value={riskThreshold} onChange={(e) => setRiskThreshold(e.target.value)}>
              <option value="low">Low Sensitivity</option>
              <option value="medium">Medium Sensitivity</option>
              <option value="high">High Sensitivity</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Default Review Window</label>
            <select style={styles.input} value={reviewWindow} onChange={(e) => setReviewWindow(e.target.value)}>
              <option value="24h">24 Hours</option>
              <option value="72h">72 Hours</option>
              <option value="7d">7 Days</option>
            </select>
          </div>
        </div>

        <div style={styles.toggleRow}>
          <button style={styles.toggleBtn} onClick={() => setAutoEscalation((v) => !v)}>
            {autoEscalation ? "ON" : "OFF"}
          </button>
          <div>
            <div style={styles.toggleTitle}>Auto Escalation</div>
            <div style={styles.toggleSub}>Automatically escalate high-risk claims.</div>
          </div>
        </div>

        <div style={styles.toggleRow}>
          <button style={styles.toggleBtn} onClick={() => setStrictMode((v) => !v)}>
            {strictMode ? "ON" : "OFF"}
          </button>
          <div>
            <div style={styles.toggleTitle}>Strict Evidence Mode</div>
            <div style={styles.toggleSub}>Require GPS + document before approval.</div>
          </div>
        </div>

        <div style={styles.toggleRow}>
          <button style={styles.toggleBtn} onClick={() => setAnonymousMasking((v) => !v)}>
            {anonymousMasking ? "ON" : "OFF"}
          </button>
          <div>
            <div style={styles.toggleTitle}>Mask Reporter Identity</div>
            <div style={styles.toggleSub}>Hide citizen identity details in default review view.</div>
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.secondaryBtn} onClick={() => alert("Auditor defaults restored.")}>Reset</button>
          <button style={styles.secondaryBtn} onClick={() => alert(`Dry-run complete: ${riskThreshold} risk policy with ${reviewWindow} window.`)}>Test Rule Set</button>
          <button style={styles.primaryBtn} onClick={() => alert("Auditor settings saved.")}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", fontFamily: "'Sora', sans-serif" },
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" },
  title: { margin: 0, color: "#1e293b", fontSize: "1.2rem", fontWeight: 700 },
  subtitle: { margin: "8px 0 20px", color: "#64748b", fontSize: "0.92rem" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" },
  input: { border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 12px", background: "#f8fafc" },
  toggleRow: { display: "flex", alignItems: "center", gap: "12px", marginTop: "16px", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "10px" },
  toggleBtn: { minWidth: "56px", border: "none", borderRadius: "8px", background: "#2563eb", color: "white", padding: "8px", fontWeight: 700, cursor: "pointer" },
  toggleTitle: { fontWeight: 700, color: "#1e293b" },
  toggleSub: { fontSize: "0.82rem", color: "#64748b" },
  actions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" },
  secondaryBtn: { border: "1px solid #cbd5e1", background: "#fff", padding: "10px 14px", borderRadius: "10px", cursor: "pointer" },
  primaryBtn: { border: "none", background: "#0f1f3d", color: "#fff", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: 700 },
};

export default AuditorSettings;
