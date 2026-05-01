import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const publicMenuSections = [
  {
    title: "Discovery",
    items: [
      { label: "Home", to: "/public/home", icon: "🏠" },
      { label: "Live Tracker", to: "/public/explorer", icon: "🌐" },
      { label: "Search", to: "/public/search", icon: "🔍" },
      { label: "Live Map", to: "/public/map", icon: "🗺️" },
    ],
  },
  {
    title: "Participation",
    items: [
      { label: "Report Issue", to: "/public/report-issue", icon: "🚨" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", to: "/public/settings", icon: "⚙️" },
      { label: "Logout", to: "/login", icon: "🚪" },
    ],
  },
];

function getPageTitle(pathname) {
  if (pathname.includes("/home")) return "Public Dashboard";
  if (pathname.includes("/explorer")) return "Live Fund Tracker";
  if (pathname.includes("/search")) return "Search Projects";
  if (pathname.includes("/map")) return "Live Construction Map";
  if (pathname.includes("/report-issue")) return "Whistleblower Portal";
  if (pathname.includes("/settings")) return "Settings";
  if (pathname.includes("/project-details")) return "Project Details";
  return "Public Portal";
}

function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="public-layout-root">
      <style>{`
        .public-layout-root {
          --navy: #0f1f3d;
          --navy-mid: #1a3260;
          --blue: #2563eb;
          --white: #ffffff;
          --gray-50: #f8fafc;
          --gray-100: #f1f5f9;
          --gray-200: #e2e8f0;
          --gray-400: #94a3b8;
          --text: #1e293b;
          --sidebar-w: 240px;
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: var(--gray-50);
          display: flex;
        }
        .public-sidebar {
          width: var(--sidebar-w);
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-mid) 100%);
          position: fixed;
          inset: 0 auto 0 0;
          color: rgba(255,255,255,0.7);
          display: flex;
          flex-direction: column;
          z-index: 100;
          box-shadow: 4px 0 20px rgba(0,0,0,0.1);
        }
        .public-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
        }
        .public-logo {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--blue);
          display: grid;
          place-items: center;
          color: white;
          font-size: 20px;
        }
        .public-title {
          color: var(--white);
          line-height: 1.2;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .public-section {
          padding: 12px 14px 0;
        }
        .public-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.8px;
          text-transform: uppercase;
          padding: 10px 10px 8px;
        }
        .public-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: rgba(255,255,255,0.65);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 6px;
          font-size: 0.92rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .public-link:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }
        .public-link.active {
          background: rgba(37, 99, 235, 0.15);
          border: 1px solid rgba(37, 99, 235, 0.25);
          color: #60a5fa;
          font-weight: 600;
        }
        .public-main {
          margin-left: var(--sidebar-w);
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .public-topbar {
          height: 68px;
          border-bottom: 1px solid var(--gray-200);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 90;
        }
        .public-top-left {
          display: flex;
          flex-direction: column;
        }
        .public-top-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.5px;
        }
        .public-top-sub {
          font-size: 0.75rem;
          color: var(--gray-400);
        }
        .public-search-wrapper {
          display: flex;
          align-items: center;
          background: var(--gray-100);
          border-radius: 10px;
          padding: 8px 16px;
          width: 320px;
          border: 1px solid var(--gray-200);
        }
        .public-search-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 0.85rem;
          width: 100%;
          color: var(--text);
        }
        .public-content {
          flex: 1;
          background: var(--gray-50);
        }
        .public-footer {
          padding: 32px;
          text-align: center;
          font-size: 0.8rem;
          color: var(--gray-400);
          border-top: 1px solid var(--gray-200);
          background: #fff;
        }
        .verifiable-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(37, 99, 235, 0.08);
          color: var(--blue);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}</style>

      <aside className="public-sidebar">
        <div className="public-brand" onClick={() => navigate("/public/home")}>
          <div className="public-logo">🏛️</div>
          <div className="public-title">
            PUBLIC FUND
            <br />
            TRACKER
          </div>
        </div>

        {publicMenuSections.map((section) => (
          <div className="public-section" key={section.title}>
            <div className="public-section-label">{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `public-link ${isActive ? "active" : ""}`
                }
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: '20px' }}>
          <div className="verifiable-badge">
            🌐 Verifiable Citizen View
          </div>
        </div>
      </aside>

      <div className="public-main">
        <header className="public-topbar">
          <div className="public-top-left">
            <div className="public-top-title">{pageTitle}</div>
            <div className="public-top-sub">Quantrix System / {pageTitle}</div>
          </div>

          <div className="public-search-wrapper">
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="public-search-input"
              onFocus={() => navigate("/public/search")}
            />
            <span style={{ color: 'var(--gray-400)' }}>🔍</span>
          </div>
        </header>

        <div className="public-content">
          <Outlet />
        </div>

        <footer className="public-footer">
          <div>&copy; 2024 Quantrix Public Fund Tracking System. Secured by Blockchain & AI.</div>
          <div style={{ marginTop: '4px' }}>Empowering Citizens through Transparency and Accountability.</div>
        </footer>
      </div>
    </div>
  );
}

export default PublicLayout;
