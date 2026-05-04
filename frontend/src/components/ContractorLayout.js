import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import IndianEmblem from "./IndianEmblem";

// ── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  SubmitClaim: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  MySubmissions: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  MyProjects: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Profile: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
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

const contractorMenuSections = [
  {
    title: "My Work",
    items: [
      { label: "Submit Claim",    to: "/contractor/claim",       Icon: Icons.SubmitClaim },
      { label: "My Submissions",  to: "/contractor/submissions", Icon: Icons.MySubmissions },
      { label: "My Projects",     to: "/contractor/projects",    Icon: Icons.MyProjects },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", to: "/contractor/profile", Icon: Icons.Profile },
      { label: "Logout",  to: "/login",              Icon: Icons.Logout },
    ],
  },
];

function getPageTitle(pathname) {
  if (pathname.includes("/claim"))       return "Submit Milestone Claim";
  if (pathname.includes("/submissions")) return "My Submissions";
  if (pathname.includes("/projects"))    return "My Projects";
  if (pathname.includes("/profile"))     return "My Profile";
  return "Contractor Portal";
}

function ContractorLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const userName  = localStorage.getItem("userName") || "Contractor";
  const initials  = userName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

  return (
    <div className="contractor-layout-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .contractor-layout-root {
          --accent:       #f59e0b;
          --accent-glow:  rgba(245,158,11,0.18);
          --accent-dim:   rgba(245,158,11,0.08);
          --navy:         #0a1628;
          --navy-mid:     #0f1f3d;
          --navy-end:     #152038;
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

        .contractor-sidebar {
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

        .contractor-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 18px 18px;
          border-bottom: 1px solid var(--glass-border);
          flex-shrink: 0;
        }
        .contractor-logo-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--accent-dim);
          border: 1.5px solid rgba(245,158,11,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .contractor-logo-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(245,158,11,0.15), transparent 70%);
        }
        .contractor-brand-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
          letter-spacing: 0.2px;
        }
        .contractor-brand-sub {
          font-size: 0.6rem;
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-top: 2px;
          opacity: 0.85;
        }

        .contractor-nav {
          flex: 1;
          overflow-y: auto;
          padding: 10px 12px;
          scrollbar-width: none;
        }
        .contractor-nav::-webkit-scrollbar { display: none; }

        .contractor-section { margin-bottom: 4px; }
        .contractor-section-label {
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 1.8px;
          text-transform: uppercase;
          padding: 10px 10px 6px;
        }

        .contractor-link {
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
        .contractor-link:hover {
          background: var(--glass-bg);
          color: var(--text-primary);
          border-color: var(--glass-border);
          transform: translateX(2px);
        }
        .contractor-link.active {
          background: var(--accent-glow);
          color: var(--accent);
          border-color: rgba(245,158,11,0.22);
          font-weight: 600;
          box-shadow: 0 2px 12px rgba(245,158,11,0.12), inset 0 1px 0 rgba(245,158,11,0.08);
          transform: translateX(0);
        }
        .contractor-link.active::before {
          content: '';
          position: absolute;
          left: -1px;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: var(--accent);
          border-radius: 0 4px 4px 0;
        }
        .contractor-link-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        .contractor-link:hover .contractor-link-icon { background: rgba(255,255,255,0.06); }
        .contractor-link.active .contractor-link-icon { background: rgba(245,158,11,0.15); }

        .contractor-divider {
          height: 1px;
          background: var(--glass-border);
          margin: 8px 12px;
        }
        .contractor-footer {
          padding: 14px 12px 16px;
          border-top: 1px solid var(--glass-border);
          flex-shrink: 0;
        }
        .contractor-user-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 11px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .contractor-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(245,158,11,0.35);
        }
        .contractor-user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .contractor-user-role {
          font-size: 0.68rem;
          color: var(--text-dim);
          margin-top: 1px;
        }
        .contractor-role-chip {
          margin-left: auto;
          background: var(--accent-dim);
          border: 1px solid rgba(245,158,11,0.2);
          color: var(--accent);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 20px;
        }

        .contractor-main {
          margin-left: var(--sidebar-w);
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .contractor-topbar {
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
        .contractor-top-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.3px;
        }
        .contractor-top-sub {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 2px;
        }
        .contractor-role-badge {
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
          color: #d97706;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .contractor-content {
          flex: 1;
          padding: 24px 28px;
        }
      `}</style>

      <aside className="contractor-sidebar">
        <div className="contractor-brand">
          <div className="contractor-logo-wrap">
            <IndianEmblem size={34} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="contractor-brand-title">Contractor<br />Portal</div>
            <div className="contractor-brand-sub">Work Management</div>
          </div>
        </div>

        <nav className="contractor-nav">
          {contractorMenuSections.map((section, si) => (
            <div className="contractor-section" key={section.title}>
              {si > 0 && <div className="contractor-divider" />}
              <div className="contractor-section-label">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => `contractor-link${isActive ? " active" : ""}`}
                  onClick={(e) => {
                    if (item.label === "Logout") {
                      e.preventDefault();
                      localStorage.removeItem("token");
                      localStorage.removeItem("userRole");
                      localStorage.removeItem("userName");
                      localStorage.removeItem("userId");
                      navigate("/login");
                    }
                  }}
                >
                  <div className="contractor-link-icon"><item.Icon /></div>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="contractor-footer">
          <div className="contractor-user-card">
            <div className="contractor-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="contractor-user-name">{userName}</div>
              <div className="contractor-user-role">Contractor</div>
            </div>
            <div className="contractor-role-chip">CON</div>
          </div>
        </div>
      </aside>

      <div className="contractor-main">
        <header className="contractor-topbar">
          <div>
            <div className="contractor-top-title">{pageTitle}</div>
            <div className="contractor-top-sub">Contractor Portal / {pageTitle}</div>
          </div>
          <div className="contractor-role-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
            Contractor
          </div>
        </header>
        <div className="contractor-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ContractorLayout;
