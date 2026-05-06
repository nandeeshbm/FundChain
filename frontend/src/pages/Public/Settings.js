import React, { useState } from "react";

function PublicSettings() {
  const [notifications, setNotifications] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [cityFocus, setCityFocus] = useState("mumbai");
  const [projectCategory, setProjectCategory] = useState("all");

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Public Settings</h2>
        <p style={styles.subtitle}>Customize how you discover projects, get alerts, and read transparency data.</p>

        <div style={styles.field}>
          <label style={styles.label}>Default City Focus</label>
          <select style={styles.input} value={cityFocus} onChange={(e) => setCityFocus(e.target.value)}>
            <option value="mumbai">Mumbai</option>
            <option value="pune">Pune</option>
            <option value="delhi">Delhi</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Preferred Project Category</label>
          <select style={styles.input} value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
        </div>

        <div style={styles.toggleRow}>
          <button style={styles.toggleBtn} onClick={() => setNotifications((v) => !v)}>{notifications ? "ON" : "OFF"}</button>
          <div>
            <div style={styles.toggleTitle}>New Project Alerts</div>
            <div style={styles.toggleSub}>Notify when new construction begins in your area.</div>
          </div>
        </div>

        <div style={styles.toggleRow}>
          <button style={styles.toggleBtn} onClick={() => setHighContrast((v) => !v)}>{highContrast ? "ON" : "OFF"}</button>
          <div>
            <div style={styles.toggleTitle}>High Contrast View</div>
            <div style={styles.toggleSub}>Improves readability for maps and reports.</div>
          </div>
        </div>

        <div style={styles.toggleRow}>
          <button style={styles.toggleBtn} onClick={() => setAutoTranslate((v) => !v)}>{autoTranslate ? "ON" : "OFF"}</button>
          <div>
            <div style={styles.toggleTitle}>Auto Translate Summaries</div>
            <div style={styles.toggleSub}>Show project summaries in your preferred language.</div>
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.secondaryBtn} onClick={() => alert("Public preferences reset.")}>Reset</button>
          <button style={styles.secondaryBtn} onClick={() => alert(`Preview updated for ${cityFocus} (${projectCategory}).`)}>Preview Feed</button>
          <button style={styles.primaryBtn} onClick={() => alert("Public settings saved.")}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", fontFamily: "'Sora', sans-serif" },
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", maxWidth: "760px" },
  title: { margin: 0, color: "#1e293b", fontSize: "1.2rem", fontWeight: 700 },
  subtitle: { margin: "8px 0 20px", color: "#64748b", fontSize: "0.9rem" },
  field: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" },
  label: { fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" },
  input: { border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 12px", background: "#f8fafc" },
  toggleRow: { display: "flex", alignItems: "center", gap: "12px", marginTop: "14px", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "10px" },
  toggleBtn: { minWidth: "56px", border: "none", borderRadius: "8px", background: "#2563eb", color: "white", padding: "8px", fontWeight: 700, cursor: "pointer" },
  toggleTitle: { fontWeight: 700, color: "#1e293b" },
  toggleSub: { fontSize: "0.82rem", color: "#64748b" },
  actions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" },
  secondaryBtn: { border: "1px solid #cbd5e1", background: "#fff", padding: "10px 14px", borderRadius: "10px", cursor: "pointer" },
  primaryBtn: { border: "none", background: "#0f1f3d", color: "#fff", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: 700 },
};

export default PublicSettings;
