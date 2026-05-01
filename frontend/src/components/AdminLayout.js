import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import MetaMaskButton from './MetaMaskButton';

const menuSections = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", to: "/admin/dashboard", icon: "📊" },
      { label: "Projects", to: "/admin/projects", icon: "🏗️" },
      { label: "Fund Release", to: "/admin/fund-release", icon: "💸" },
      { label: "Transactions", to: "/admin/transactions", icon: "🧾" },
      { label: "Contractors", to: "/admin/contractors", icon: "👷" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Reports", to: "/admin/reports", icon: "📈" },
      { label: "Alerts", to: "/admin/alerts", badge: "3", icon: "🚨" },
    ],
  },
  {
    title: "Admin",
    items: [
      { label: "Settings", to: "/admin/settings", icon: "⚙️" },
      { label: "Logout", to: "/login", icon: "🚪" },
    ],
  },
];

function getPageTitle(pathname) {
  if (pathname.includes("/dashboard")) return "Dashboard";
  if (pathname.includes("/projects")) return "Projects";
  if (pathname.includes("/fund-release")) return "Fund Release";
  if (pathname.includes("/transactions")) return "Transactions";
  if (pathname.includes("/contractors")) return "Contractors";
  if (pathname.includes("/reports")) return "Reports";
  if (pathname.includes("/alerts")) return "Alerts";
  if (pathname.includes("/settings")) return "Settings";
  return "Admin";
}

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="admin-layout-root">
      <style>{`
        .admin-layout-root {
          --navy: #0f1f3d;
          --navy-mid: #1a3260;
          --gold: #f5a623;
          --white: #ffffff;
          --gray-100: #f1f5f9;
          --gray-200: #e2e8f0;
          --gray-400: #94a3b8;
          --gray-600: #64748b;
          --text: #1e293b;
          --sidebar-w: 230px;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--gray-100);
          display: flex;
        }
        .admin-sidebar {
          width: var(--sidebar-w);
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-mid) 100%);
          position: fixed;
          inset: 0 auto 0 0;
          color: rgba(255,255,255,0.7);
          display: flex;
          flex-direction: column;
          z-index: 20;
        }
        .admin-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 22px 20px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .admin-logo {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          background: rgba(245,166,35,0.15);
          border: 1px solid rgba(245,166,35,0.3);
          display: grid;
          place-items: center;
          color: var(--gold);
          font-size: 18px;
          font-weight: 700;
        }
        .admin-title {
          color: var(--white);
          line-height: 1.25;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .admin-section {
          padding: 8px 12px 0;
        }
        .admin-section-label {
          font-size: 0.62rem;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 8px 8px 6px;
        }
        .admin-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.68);
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 4px;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .admin-link:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
        .admin-link.active {
          background: rgba(245,166,35,0.15);
          border: 1px solid rgba(245,166,35,0.2);
          color: var(--gold);
        }
        .admin-badge {
          margin-left: auto;
          background: #ef4444;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 20px;
        }
        .admin-footer {
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 14px 12px;
        }
        .admin-user {
          background: rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-avatar {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: var(--gold);
          color: var(--navy);
          display: grid;
          place-items: center;
          font-weight: 700;
        }
        .admin-main {
          margin-left: var(--sidebar-w);
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .admin-topbar {
          height: 62px;
          border-bottom: 1px solid var(--gray-200);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .admin-top-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text);
        }
        .admin-top-sub {
          font-size: 0.75rem;
          color: var(--gray-400);
        }
        .admin-content {
          padding: 24px 28px;
          flex: 1;
        }
      `}</style>

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo">🏛</div>
          <div className="admin-title">
            Public Fund
            <br />
            Tracking System
          </div>
        </div>

        {menuSections.map((section) => (
          <div className="admin-section" key={section.title}>
            <div className="admin-section-label">{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `admin-link ${isActive ? "active" : ""}`
                }
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
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge ? <span className="admin-badge">{item.badge}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}

        <div className="admin-footer">
          <div className="admin-user">
            <div className="admin-avatar">AD</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem" }}>{localStorage.getItem('userName') || 'Admin User'}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
                {localStorage.getItem('userRole') || 'Administrator'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <div className="admin-top-title">{pageTitle}</div>
            <div className="admin-top-sub">Home / {pageTitle}</div>
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
