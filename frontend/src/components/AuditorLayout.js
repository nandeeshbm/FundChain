import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import MetaMaskButton from './MetaMaskButton';
import IndianEmblem from "./IndianEmblem";

// ── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  CommandCenter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/>
      <path d="M7.76 7.76a6 6 0 0 0 0 8.49"/>
      <path d="M20.49 3.51a14 14 0 0 1 0 16.97"/>
      <path d="M3.51 3.51a14 14 0 0 0 0 16.97"/>
    </svg>
  ),
  ReviewClaim: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  AuditReport: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Reviews: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Alerts: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
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

const auditorMenuSections = [
  {
    title: "Sentinel",
    items: [
      { label: "Dashboard",      to: "/auditor/dashboard",      Icon: Icons.Dashboard },
      { label: "Command Center", to: "/auditor/command-center", Icon: Icons.CommandCenter },
      { label: "Review Claim",   to: "/auditor/review-claim",   Icon: Icons.ReviewClaim },
    ],
  },
  {
    title: "Governance",
    items: [
      { label: "Audit Report", to: "/auditor/audit-report", Icon: Icons.AuditReport },
      { label: "Reviews",      to: "/auditor/reviews",      Icon: Icons.Reviews },
      { label: "Alerts",       to: "/auditor/alerts",       Icon: Icons.Alerts, badge: "5" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", to: "/auditor/settings", Icon: Icons.Settings },
      { label: "Logout",   to: "/login",            Icon: Icons.Logout },
    ],
  },
];

function getPageTitle(pathname) {
  if (pathname.includes("/command-center")) return "Command Center";
  if (pathname.includes("/review-claim"))   return "Review Claim";
  if (pathname.includes("/audit-report"))   return "Audit Report";
  if (pathname.includes("/reviews"))        return "Reviews";
  if (pathname.includes("/alerts"))         return "Alerts";
  if (pathname.includes("/settings"))       return "Settings";
  if (pathname.includes("/dashboard"))      return "Dashboard";
  return "Auditor";
}

function AuditorLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const userName  = localStorage.getItem('userName') || 'Auditor';
  const initials  = userName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="auditor-layout-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .auditor-layout-root {
          --accent:       #3b82f6;
          --accent-glow:  rgba(59,130,246,0.18);
          --accent-dim:   rgba(59,130,246,0.08);
          --navy:         #0a1628;
          --navy-mid:     #0d1f3c;
          --navy-end:     #101e3a;
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

        .auditor-sidebar {
          width: var(--sidebar-w);
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-end) 100%);
          position: fixed;
          inset: 0 auto 0 0;
          display: flex;
          flex-direction: column;
          z-index: 20;
          border-right: 1px solid var(--glass-border);
          box-shadow: 4px 0 32px rgba(0,0,0,0.25), 1px 0 0 rgba(255,255,255,0.04);
        }

        .auditor-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 18px 18px;
          border-bottom: 1px solid var(--glass-border);
          flex-shrink: 0;
        }
        .auditor-logo-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--accent-dim);
          border: 1.5px solid rgba(59,130,246,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .auditor-logo-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(59,130,246,0.15), transparent 70%);
        }
        .auditor-brand-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .auditor-brand-sub {
          font-size: 0.6rem;
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 1.6px;
          text-transform: uppercase;
          margin-top: 2px;
          opacity: 0.85;
        }

        .auditor-nav {
          flex: 1;
          overflow-y: auto;
          padding: 10px 12px;
          scrollbar-width: none;
        }
        .auditor-nav::-webkit-scrollbar { display: none; }

        .auditor-section { margin-bottom: 4px; }
        .auditor-section-label {
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 1.8px;
          text-transform: uppercase;
          padding: 10px 10px 6px;
        }

        .auditor-link {
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
        .auditor-link:hover {
          background: var(--glass-bg);
          color: var(--text-primary);
          border-color: var(--glass-border);
          transform: translateX(2px);
        }
        .auditor-link.active {
          background: var(--accent-glow);
          color: var(--accent);
          border-color: rgba(59,130,246,0.22);
          font-weight: 600;
          box-shadow: 0 2px 12px rgba(59,130,246,0.12), inset 0 1px 0 rgba(59,130,246,0.08);
          transform: translateX(0);
        }
        .auditor-link.active::before {
          content: '';
          position: absolute;
          left: -1px;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: var(--accent);
          border-radius: 0 4px 4px 0;
        }
        .auditor-link-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        .auditor-link:hover .auditor-link-icon { background: rgba(255,255,255,0.06); }
        .auditor-link.active .auditor-link-icon { background: rgba(59,130,246,0.15); }

        .auditor-badge {
          margin-left: auto;
          background: #ef4444;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(239,68,68,0.35);
        }
        .auditor-divider {
          height: 1px;
          background: var(--glass-border);
          margin: 8px 12px;
        }
        .auditor-footer {
          padding: 14px 12px 16px;
          border-top: 1px solid var(--glass-border);
          flex-shrink: 0;
        }
        .auditor-user-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 11px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .auditor-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent), #1d4ed8);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }
        .auditor-user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .auditor-user-role {
          font-size: 0.68rem;
          color: var(--text-dim);
          margin-top: 1px;
        }
        .auditor-role-chip {
          margin-left: auto;
          background: var(--accent-dim);
          border: 1px solid rgba(59,130,246,0.2);
          color: var(--accent);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 20px;
        }

        .auditor-main {
          margin-left: var(--sidebar-w);
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .auditor-topbar {
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
          z-index: 10;
          box-shadow: 0 1px 0 rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
        }
        .auditor-top-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.3px;
        }
        .auditor-top-sub {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 2px;
        }
        .auditor-content {
          padding: 24px 28px;
          flex: 1;
        }
      `}</style>

      <aside className="auditor-sidebar">
        <div className="auditor-brand">
          <div className="auditor-logo-wrap">
            <IndianEmblem size={34} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="auditor-brand-title">Sentinel<br />Audit Command</div>
            <div className="auditor-brand-sub">Forensic Division</div>
          </div>
        </div>

        <nav className="auditor-nav">
          {auditorMenuSections.map((section, si) => (
            <div className="auditor-section" key={section.title}>
              {si > 0 && <div className="auditor-divider" />}
              <div className="auditor-section-label">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => `auditor-link${isActive ? " active" : ""}`}
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
                  <div className="auditor-link-icon"><item.Icon /></div>
                  <span>{item.label}</span>
                  {item.badge ? <span className="auditor-badge">{item.badge}</span> : null}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="auditor-footer">
          <div className="auditor-user-card">
            <div className="auditor-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="auditor-user-name">{userName}</div>
              <div className="auditor-user-role">Forensic Auditor</div>
            </div>
            <div className="auditor-role-chip">AUD</div>
          </div>
        </div>
      </aside>

      <div className="auditor-main">
        <header className="auditor-topbar">
          <div>
            <div className="auditor-top-title">{pageTitle}</div>
            <div className="auditor-top-sub">Auditor Sentinel / {pageTitle}</div>
          </div>
          <MetaMaskButton compact />
        </header>
        <div className="auditor-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuditorLayout;
