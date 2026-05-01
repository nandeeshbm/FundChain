import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const contractorMenuSections = [
  {
    title: "My Work",
    items: [
      { label: "Submit Claim", to: "/contractor/claim", icon: "📤" },
      { label: "My Submissions", to: "/contractor/submissions", icon: "📋" },
      { label: "My Projects", to: "/contractor/projects", icon: "🏗️" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", to: "/contractor/profile", icon: "👤" },
      { label: "Logout", to: "/login", icon: "🚪" },
    ],
  },
];

function getPageTitle(pathname) {
  if (pathname.includes("/claim")) return "Submit Milestone Claim";
  if (pathname.includes("/submissions")) return "My Submissions";
  if (pathname.includes("/projects")) return "My Projects";
  if (pathname.includes("/profile")) return "My Profile";
  return "Contractor Portal";
}

function ContractorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const userName = localStorage.getItem("userName") || "Contractor";
  const initials = userName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div className="contractor-layout-root">
      <style>{`
        .contractor-layout-root {
          --navy: #0f1f3d;
          --navy-mid: #1a3260;
          --accent: #f59e0b;
          --accent-light: #fbbf24;
          --white: #ffffff;
          --gray-100: #f1f5f9;
          --gray-200: #e2e8f0;
          --gray-400: #94a3b8;
          --text: #1e293b;
          --sidebar-w: 240px;
          font-family: 'Sora', 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--gray-100);
          display: flex;
        }

        /* ── Sidebar ─────────────────────────────────────── */
        .contractor-sidebar {
          width: var(--sidebar-w);
          background: linear-gradient(180deg, #0f1f3d 0%, #1a3260 100%);
          position: fixed;
          inset: 0 auto 0 0;
          color: rgba(255,255,255,0.7);
          display: flex;
          flex-direction: column;
          z-index: 20;
          box-shadow: 4px 0 24px rgba(0,0,0,0.18);
        }

        .contractor-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .contractor-logo {
          width: 40px;
          height: 40px;
          background: rgba(245,158,11,0.15);
          border: 1.5px solid rgba(245,158,11,0.4);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .contractor-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.3;
          letter-spacing: 0.2px;
        }

        .contractor-nav {
          flex: 1;
          overflow-y: auto;
          padding: 16px 12px;
          scrollbar-width: none;
        }
        .contractor-nav::-webkit-scrollbar { display: none; }

        .contractor-section {
          margin-bottom: 20px;
        }

        .contractor-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          padding: 0 10px;
          margin-bottom: 6px;
        }

        .contractor-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background 0.18s, color 0.18s;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          margin-bottom: 2px;
        }

        .contractor-link:hover {
          background: rgba(255,255,255,0.07);
          color: #fff;
        }

        .contractor-link.active {
          background: rgba(245,158,11,0.15);
          color: #fbbf24;
          font-weight: 600;
        }

        .contractor-link.active span:first-child {
          filter: none;
        }

        .contractor-footer {
          padding: 16px 16px 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .contractor-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
        }

        .contractor-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        /* ── Main ────────────────────────────────────────── */
        .contractor-main {
          margin-left: var(--sidebar-w);
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .contractor-topbar {
          background: #fff;
          border-bottom: 1px solid var(--gray-200);
          padding: 18px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }

        .contractor-top-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text);
        }

        .contractor-top-sub {
          font-size: 0.75rem;
          color: var(--gray-400);
          margin-top: 2px;
        }

        .contractor-role-badge {
          background: rgba(245,158,11,0.1);
          color: #d97706;
          padding: 5px 14px;
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
          padding: 28px 32px;
        }
      `}</style>

      {/* ── Sidebar ── */}
      <aside className="contractor-sidebar">
        <div className="contractor-brand">
          <div className="contractor-logo">🏗️</div>
          <div className="contractor-title">
            Contractor<br />Portal
          </div>
        </div>

        <nav className="contractor-nav">
          {contractorMenuSections.map((section) => (
            <div className="contractor-section" key={section.title}>
              <div className="contractor-section-label">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => `contractor-link ${isActive ? "active" : ""}`}
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
                  <span style={{ fontSize: "1.05rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="contractor-footer">
          <div className="contractor-user">
            <div className="contractor-avatar">{initials}</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.88rem" }}>
                {userName}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>
                Contractor
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="contractor-main">
        <header className="contractor-topbar">
          <div>
            <div className="contractor-top-title">{pageTitle}</div>
            <div className="contractor-top-sub">Home / {pageTitle}</div>
          </div>
          <div className="contractor-role-badge">
            🏗️ Contractor
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
