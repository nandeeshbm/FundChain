import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import MetaMaskButton from './MetaMaskButton';
import IndianEmblem from "./IndianEmblem";

// ── Real SVG Icons ─────────────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Projects: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  FundRelease: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
      <path d="M16 8l2-2"/><path d="M8 8L6 6"/>
    </svg>
  ),
  Transactions: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  Contractors: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Reports: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
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

const menuSections = [
  {
    title: "Main",
    items: [
      { label: "Dashboard",    to: "/admin/dashboard",    Icon: Icons.Dashboard },
      { label: "Projects",     to: "/admin/projects",     Icon: Icons.Projects },
      { label: "Fund Release", to: "/admin/fund-release", Icon: Icons.FundRelease },
      { label: "Transactions", to: "/admin/transactions", Icon: Icons.Transactions },
      { label: "Contractors",  to: "/admin/contractors",  Icon: Icons.Contractors },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Reports", to: "/admin/reports", Icon: Icons.Reports },
      { label: "Alerts",  to: "/admin/alerts",  Icon: Icons.Alerts, badge: "3" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", to: "/admin/settings", Icon: Icons.Settings },
      { label: "Logout",   to: "/login",          Icon: Icons.Logout },
    ],
  },
];

function getPageTitle(pathname) {
  if (pathname.includes("/dashboard"))   return "Dashboard";
  if (pathname.includes("/projects"))    return "Projects";
  if (pathname.includes("/fund-release"))return "Fund Release";
  if (pathname.includes("/transactions"))return "Transactions";
  if (pathname.includes("/contractors")) return "Contractors";
  if (pathname.includes("/reports"))     return "Reports";
  if (pathname.includes("/alerts"))      return "Alerts";
  if (pathname.includes("/settings"))    return "Settings";
  return "Admin";
}

function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const userName  = localStorage.getItem('userName') || 'Admin User';
  const initials  = userName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="admin-layout-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .admin-layout-root {
          --accent:       #f5a623;
          --accent-glow:  rgba(245,166,35,0.18);
          --accent-dim:   rgba(245,166,35,0.08);
          --navy:         #0a1628;
          --navy-mid:     #0f1f3d;
          --navy-end:     #162040;
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

        /* ── SIDEBAR ─────────────────────────────────────── */
        .admin-sidebar {
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

        /* ── Brand / Logo ────────────────────────────────── */
        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 18px 18px;
          border-bottom: 1px solid var(--glass-border);
          flex-shrink: 0;
        }
        .admin-logo-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--accent-dim);
          border: 1.5px solid rgba(245,166,35,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .admin-logo-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(245,166,35,0.15), transparent 70%);
        }
        .admin-brand-text {
          flex: 1;
          min-width: 0;
        }
        .admin-brand-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
          letter-spacing: 0.2px;
        }
        .admin-brand-sub {
          font-size: 0.62rem;
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-top: 2px;
          opacity: 0.85;
        }

        /* ── Role badge in brand ─────────────────────────── */
        .admin-role-chip {
          margin-left: auto;
          background: var(--accent-dim);
          border: 1px solid rgba(245,166,35,0.2);
          color: var(--accent);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 20px;
        }

        /* ── Nav scroll area ─────────────────────────────── */
        .admin-nav {
          flex: 1;
          overflow-y: auto;
          padding: 10px 12px;
          scrollbar-width: none;
        }
        .admin-nav::-webkit-scrollbar { display: none; }

        /* ── Section header ──────────────────────────────── */
        .admin-section { margin-bottom: 4px; }
        .admin-section-label {
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 1.8px;
          text-transform: uppercase;
          padding: 10px 10px 6px;
        }

        /* ── Nav links ───────────────────────────────────── */
        .admin-link {
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
        }
        .admin-link:hover {
          background: var(--glass-bg);
          color: var(--text-primary);
          border-color: var(--glass-border);
        }
        .admin-link.active {
          background: var(--accent-glow);
          color: var(--accent);
          border-color: rgba(245,166,35,0.22);
          font-weight: 600;
          box-shadow: 0 2px 12px rgba(245,166,35,0.12), inset 0 1px 0 rgba(245,166,35,0.08);
        }
        .admin-link.active::before {
          content: '';
          position: absolute;
          left: -1px;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: var(--accent);
          border-radius: 0 4px 4px 0;
        }
        .admin-link-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        .admin-link:hover .admin-link-icon {
          background: rgba(255,255,255,0.06);
        }
        .admin-link.active .admin-link-icon {
          background: rgba(245,166,35,0.15);
        }
        .admin-badge {
          margin-left: auto;
          background: #ef4444;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 20px;
          letter-spacing: 0.2px;
          box-shadow: 0 2px 8px rgba(239,68,68,0.35);
        }

        /* ── Divider ─────────────────────────────────────── */
        .admin-divider {
          height: 1px;
          background: var(--glass-border);
          margin: 8px 12px;
        }

        /* ── Footer / User card ──────────────────────────── */
        .admin-footer {
          padding: 14px 12px 16px;
          border-top: 1px solid var(--glass-border);
          flex-shrink: 0;
        }
        .admin-user-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 11px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          backdrop-filter: blur(8px);
        }
        .admin-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent), #d97706);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(245,166,35,0.3);
        }
        .admin-user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .admin-user-role {
          font-size: 0.68rem;
          color: var(--text-dim);
          margin-top: 1px;
        }

        /* ── Main content area ───────────────────────────── */
        .admin-main {
          margin-left: var(--sidebar-w);
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── Topbar ──────────────────────────────────────── */
        .admin-topbar {
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
        .admin-top-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.3px;
        }
        .admin-top-sub {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 2px;
        }

        /* ── Page content ────────────────────────────────── */
        .admin-content {
          padding: 24px 28px;
          flex: 1;
        }

        /* ── Hover animations ────────────────────────────── */
        .admin-link { transform: translateX(0); }
        .admin-link:hover { transform: translateX(2px); }
        .admin-link.active { transform: translateX(0); }
      `}</style>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo-wrap">
            <IndianEmblem size={34} />
          </div>
          <div className="admin-brand-text">
            <div className="admin-brand-title">Public Fund<br />Tracking System</div>
            <div className="admin-brand-sub">Admin Portal</div>
          </div>
        </div>

        <nav className="admin-nav">
          {menuSections.map((section, si) => (
            <div className="admin-section" key={section.title}>
              {si > 0 && <div className="admin-divider" />}
              <div className="admin-section-label">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => `admin-link${isActive ? " active" : ""}`}
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
                  <div className="admin-link-icon">
                    <item.Icon />
                  </div>
                  <span>{item.label}</span>
                  {item.badge ? <span className="admin-badge">{item.badge}</span> : null}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-footer">
          <div className="admin-user-card">
            <div className="admin-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="admin-user-name">{userName}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
            <div className="admin-role-chip">GOV</div>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <div className="admin-top-title">{pageTitle}</div>
            <div className="admin-top-sub">Admin Portal / {pageTitle}</div>
          </div>
          <MetaMaskButton compact />
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
