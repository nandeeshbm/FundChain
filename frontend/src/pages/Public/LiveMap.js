import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function LiveMap() {
  const navigate = useNavigate();
  const sites = useMemo(
    () => [
      {
        id: "PJT201",
        name: "Community Health Center - Andheri",
        lat: 19.1334,
        lng: 72.8397,
        funds: "INR 2.00 Cr",
        progress: "60%",
        status: "In Progress",
        docs: ["Tender Copy", "Geo Proof Pack", "Milestone Invoice"],
      },
      {
        id: "PJT202",
        name: "Primary School Upgrade - Kurla",
        lat: 19.0728,
        lng: 72.8826,
        funds: "INR 1.20 Cr",
        progress: "42%",
        status: "In Progress",
        docs: ["Work Order", "Material Checklist"],
      },
      {
        id: "PJT203",
        name: "Road Repair Cluster - Borivali",
        lat: 19.2290,
        lng: 72.8579,
        funds: "INR 3.70 Cr",
        progress: "78%",
        status: "Active",
        docs: ["Road Test Report", "Drone Snapshot Set"],
      },
    ],
    []
  );

  const [selected, setSelected] = useState(sites[0]);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=72.70,19.00,73.00,19.30&layer=mapnik&marker=${selected.lat},${selected.lng}`;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Live Construction Map</h2>
        <p style={styles.sub}>Click a project to focus map location and inspect dummy funding proofs.</p>
      </div>

      <div style={styles.layout}>
        <div style={styles.mapCard}>
          <iframe title="live-construction-map" src={mapUrl} style={styles.iframe} loading="lazy" />
        </div>

        <div style={styles.sideCard}>
          <div style={styles.sideTitle}>Active Sites</div>
          <div style={styles.siteList}>
            {sites.map((site) => (
              <button
                key={site.id}
                type="button"
                onClick={() => setSelected(site)}
                style={{ ...styles.siteBtn, ...(selected.id === site.id ? styles.siteBtnActive : {}) }}
              >
                <div style={styles.siteName}>{site.name}</div>
                <div style={styles.siteMeta}>{site.id} | {site.status}</div>
              </button>
            ))}
          </div>

          <div style={styles.detailBox}>
            <div style={styles.row}><span style={styles.k}>Project:</span><span style={styles.v}>{selected.id}</span></div>
            <div style={styles.row}><span style={styles.k}>Allocated:</span><span style={styles.v}>{selected.funds}</span></div>
            <div style={styles.row}><span style={styles.k}>Progress:</span><span style={styles.v}>{selected.progress}</span></div>
            <div style={styles.row}><span style={styles.k}>Coordinates:</span><span style={styles.v}>{selected.lat}, {selected.lng}</span></div>
            <div style={{ marginTop: 12 }}>
              <div style={styles.k}>Proof Documents</div>
              {selected.docs.map((d) => (
                <button key={d} type="button" style={styles.docBtn} onClick={() => alert(`${d} opened (dummy).`)}>
                  View {d}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.actions}>
            <button type="button" style={styles.secondary} onClick={() => alert("Shared current map location (dummy).")}>Share Site</button>
            <button type="button" style={styles.primary} onClick={() => navigate(`/public/project-details/${selected.id}`)}>Open Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24, fontFamily: "'Sora', sans-serif" },
  header: { marginBottom: 12 },
  title: { margin: 0, color: "#1e293b" },
  sub: { margin: "6px 0 0", color: "#64748b", fontSize: "0.9rem" },
  layout: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, minHeight: "72vh" },
  mapCard: { border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", background: "#fff" },
  iframe: { width: "100%", height: "100%", minHeight: 540, border: "none" },
  sideCard: { border: "1px solid #e2e8f0", borderRadius: 14, background: "#fff", padding: 14, display: "flex", flexDirection: "column", gap: 10 },
  sideTitle: { fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" },
  siteList: { display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflow: "auto" },
  siteBtn: { textAlign: "left", border: "1px solid #e2e8f0", borderRadius: 10, background: "#f8fafc", padding: "10px 12px", cursor: "pointer" },
  siteBtnActive: { borderColor: "#93c5fd", background: "#eff6ff" },
  siteName: { fontWeight: 700, color: "#1e293b", fontSize: "0.85rem" },
  siteMeta: { color: "#64748b", fontSize: "0.75rem", marginTop: 3 },
  detailBox: { border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, background: "#f8fafc" },
  row: { display: "flex", justifyContent: "space-between", marginBottom: 6, gap: 10 },
  k: { color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700 },
  v: { color: "#1e293b", fontSize: "0.85rem", fontWeight: 700, textAlign: "right" },
  docBtn: { width: "100%", marginTop: 6, border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", padding: "8px 10px", fontSize: "0.78rem", cursor: "pointer", textAlign: "left" },
  actions: { display: "flex", gap: 8, marginTop: "auto" },
  secondary: { flex: 1, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", padding: "10px 12px", cursor: "pointer" },
  primary: { flex: 1, border: "none", borderRadius: 10, background: "#2563eb", color: "#fff", padding: "10px 12px", cursor: "pointer", fontWeight: 700 },
};

export default LiveMap;
