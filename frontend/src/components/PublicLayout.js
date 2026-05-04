import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import IndianEmblem from "./IndianEmblem";

// ── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  LiveTracker: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  LiveMap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  ReportIssue: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const publicMenuSections = [
  {
    title: "Discovery",
    items: [
      { label: "Home",         to: "/public/home",        Icon: Icons.Home },
      { label: "Live Tracker", to: "/public/explorer",    Icon: Icons.LiveTracker },
      { label: "Search",       to: "/public/search",      Icon: Icons.Search },
      { label: "Live Map",     to: "/public/map",         Icon: Icons.LiveMap },
    ],
  },
  {
    title: "Participation",
    items: [
      { label: "Report Issue", to: "/public/report-issue", Icon: Icons.ReportIssue },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", to: "/public/settings", Icon: Icons.Settings },
      { label: "Logout",   to: "/login",           Icon: Icons.Logout },
    ],
  },
];

function getPageTitle(pathname) {
  if (pathname.includes("/home"))            return "Public Dashboard";
  if (pathname.includes("/explorer"))        return "Live Fund Tracker";
  if (pathname.includes("/search"))          return "Search Projects";
  if (pathname.includes("/map"))             return "Live Construction Map";
  if (pathname.includes("/report-issue"))    return "Whistleblower Portal";
  if (pathname.includes("/settings"))        return "Settings";
  if (pathname.includes("/project-details")) return "Project Details";
  return "Public Portal";
}

function PublicLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="public-layout-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .public-layout-root {
          --accent:       #f5a623;
          --accent-glow:  rgba(245,166,35,0.18);
          --accent-dim:   rgba(245,166,35,0.08);
          --navy:         #0a1628;
          --navy-mid:     #0d1e38;
          --navy-end:     #0f2040;
          --sidebar-w:    248px;
          --glass-bg:     rgba(255,255,255,0.04);
          --glass-border: rgba(255,255,255,0.09);
          --text-primary: rgba(255,255,255,0.92);
          --text-muted:   rgba(255,255,255,0.45);
          --text-dim:     rgba(255,255,255,0.28);
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          background: #f0f4fb;
          display: flex;
        }

        .public-sidebar {
          width: var(--sidebar-w);
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-end) 100%);
          position: fixed;
          inset: 0 auto 0 0;
          display: flex;
          flex-direction: column;
          z-index: 100;
          border-right: 1px solid var(--glass-border);
          box-shadow: 4px 0 32px rgba(0,0,0,0.25), 1px 0 0 rgba(255,255,255,0.04);
        }

        .public-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 18px 18px;
          border-bottom: 1px solid var(--glass-border);
          flex-shrink: 0;
          cursor: pointer;
        }
        .public-logo-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--accent-dim);
          border: 1.5px solid rgba(16,185,129,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .public-logo-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(16,185,129,0.15), transparent 70%);
        }
        .public-brand-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
          letter-spacing: 0.2px;
          text-transform: uppercase;
        }
        .public-brand-sub {
          font-size: 0.6rem;
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-top: 2px;
          opacity: 0.85;
        }

        .public-nav {
          flex: 1;
          overflow-y: auto;
          padding: 10px 12px;
          scrollbar-width: none;
        }
        .public-nav::-webkit-scrollbar { display: none; }

        .public-section { margin-bottom: 4px; }
        .public-section-label {
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 1.8px;
          text-transform: uppercase;
          padding: 10px 10px 6px;
        }

        .public-link {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: var(--text-muted);
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 3px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.18s ease;
          position: relative;
          border: 1px solid transparent;
          transform: translateX(0);
        }
        .public-link:hover {
          background: var(--glass-bg);
          color: var(--text-primary);
          border-color: var(--glass-border);
          transform: translateX(2px);
        }
        .public-link.active {
          background: var(--accent-glow);
          color: var(--accent);
          border-color: rgba(16,185,129,0.22);
          font-weight: 600;
          box-shadow: 0 2px 12px rgba(16,185,129,0.12), inset 0 1px 0 rgba(16,185,129,0.08);
          transform: translateX(0);
        }
        .public-link.active::before {
          content: '';
          position: absolute;
          left: -1px;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: var(--accent);
          border-radius: 0 4px 4px 0;
        }
        .public-link-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        .public-link:hover .public-link-icon { background: rgba(255,255,255,0.06); }
        .public-link.active .public-link-icon { background: rgba(16,185,129,0.15); }

        .public-divider {
          height: 1px;
          background: var(--glass-border);
          margin: 8px 12px;
        }

        .public-footer {
          padding: 14px 12px 16px;
          border-top: 1px solid var(--glass-border);
          flex-shrink: 0;
        }
        .public-citizen-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 11px 14px;
          color: var(--accent);
          font-size: 0.78rem;
          font-weight: 600;
        }

        /* ── Main ─────────────────────────────────────────── */
        .public-main {
          margin-left: var(--sidebar-w);
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .public-topbar {
          height: 64px;
          border-bottom: 1px solid rgba(226,232,240,0.8);
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 90;
          box-shadow: 0 1px 0 rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
        }
        .public-top-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.3px;
        }
        .public-top-sub {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 2px;
        }
        .public-search-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 9px 16px;
          width: 300px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .public-search-wrapper:focus-within {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.08);
          background: #fff;
        }
        .public-search-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 0.85rem;
          width: 100%;
          color: #1e293b;
        }
        .public-search-btn {
          border: none;
          background: #0f1f3d;
          color: #fff;
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
        }
        .public-content { flex: 1; background: #f0f4fb; padding: 24px 28px; }
        .public-page-footer {
          padding: 20px 32px;
          text-align: center;
          font-size: 0.78rem;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          background: rgba(255,255,255,0.7);
        }
      `}</style>

      <aside className="public-sidebar">
        <div className="public-brand" onClick={() => navigate("/public/home")}>
          <div className="public-logo-wrap">
            <IndianEmblem size={34} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="public-brand-title">Public Fund<br />Tracker</div>
            <div className="public-brand-sub">Citizen Portal</div>
          </div>
        </div>

        <nav className="public-nav">
          {publicMenuSections.map((section, si) => (
            <div className="public-section" key={section.title}>
              {si > 0 && <div className="public-divider" />}
              <div className="public-section-label">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => `public-link${isActive ? " active" : ""}`}
                  onClick={(e) => {
                    if (item.label === "Logout") {
                      e.preventDefault();
                      localStorage.removeItem('token');
                      localStorage.removeItem('userRole');
                      localStorage.removeItem('userName');
                      localStorage.removeItem('userId');
                      navigate("/login");
                    }
                  }}
                >
                  <div className="public-link-icon"><item.Icon /></div>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="public-footer">
          <div className="public-citizen-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Verifiable Citizen View
          </div>
        </div>
      </aside>

      <div className="public-main">
        <header className="public-topbar">
          <div>
            <div className="public-top-title">{pageTitle}</div>
            <div className="public-top-sub">Public Portal / {pageTitle}</div>
          </div>
          <div className="public-search-wrapper">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              className="public-search-input"
              onFocus={() => navigate("/public/search")}
            />
            <button className="public-search-btn" onClick={() => navigate("/public/search")}>Go</button>
          </div>
        </header>

        <div className="public-content">
          <Outlet />
        </div>

        <footer className="public-page-footer">
          <div>© 2024 Public Fund Tracking System — Powered by Blockchain &amp; AI on Sepolia Testnet</div>
          <div style={{ marginTop: '4px' }}>Empowering Citizens through Transparency and Accountability · Satyameva Jayate</div>
        </footer>
      </div>
    </div>
  );
}

export default PublicLayout;
