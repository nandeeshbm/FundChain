import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const auditorMenuSections = [
  {
    title: "Sentinel",
    items: [
      { label: "Dashboard", to: "/auditor/dashboard", icon: "📊" },
      { label: "Command Center", to: "/auditor/command-center", icon: "🛰️" },
      { label: "Review Claim", to: "/auditor/review-claim", icon: "🔍" },
    ],
  },
  {
    title: "Governance",
    items: [
      { label: "Audit Report", to: "/auditor/audit-report", icon: "📋" },
      { label: "Reviews", to: "/auditor/reviews", icon: "✍️" },
      { label: "Alerts", to: "/auditor/alerts", icon: "🚨", badge: "5" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", to: "/auditor/settings", icon: "⚙️" },
      { label: "Logout", to: "/login", icon: "🚪" },
    ],
  },
];

function getPageTitle(pathname) {
  if (pathname.includes("/command-center")) return "Command Center";
  if (pathname.includes("/review-claim")) return "Review Claim";
  if (pathname.includes("/audit-report")) return "Audit Report";
  if (pathname.includes("/reviews")) return "Reviews";
  if (pathname.includes("/alerts")) return "Alerts";
  if (pathname.includes("/settings")) return "Settings";
  return "Auditor";
}

function AuditorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="auditor-layout-root">
      <style>{`
        .auditor-layout-root {
          --navy: #0f1f3d;
          --navy-mid: #1a3260;
          --blue-sentinel: #2563eb;
          --white: #ffffff;
          --gray-100: #f1f5f9;
          --gray-200: #e2e8f0;
          --gray-400: #94a3b8;
          --gray-600: #64748b;
          --text: #1e293b;
          --sidebar-w: 240px;
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: var(--gray-100);
          display: flex;
        }
        .auditor-sidebar {
          width: var(--sidebar-w);
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-mid) 100%);
          position: fixed;
          inset: 0 auto 0 0;
          color: rgba(255,255,255,0.7);
          display: flex;
          flex-direction: column;
          z-index: 20;
        }
        .auditor-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .auditor-logo {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(37, 99, 235, 0.2);
          border: 1px solid rgba(37, 99, 235, 0.4);
          display: grid;
          place-items: center;
          color: var(--blue-sentinel);
          font-size: 20px;
        }
        .auditor-title {
          color: var(--white);
          line-height: 1.2;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .auditor-section {
          padding: 12px 14px 0;
        }
        .auditor-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.8px;
          text-transform: uppercase;
          padding: 10px 10px 8px;
        }
        .auditor-link {
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
        .auditor-link:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }
        .auditor-link.active {
          background: rgba(37, 99, 235, 0.15);
          border: 1px solid rgba(37, 99, 235, 0.25);
          color: #60a5fa;
          font-weight: 600;
        }
        .auditor-badge {
          margin-left: auto;
          background: #ef4444;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 1px 8px;
          border-radius: 20px;
        }
        .auditor-footer {
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 16px 14px;
        }
        .auditor-user {
          background: rgba(255,255,255,0.05);
          border-radius: 14px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .auditor-avatar {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background: var(--blue-sentinel);
          color: #fff;
          display: grid;
          place-items: center;
          font-weight: 700;
          font-size: 14px;
        }
        .auditor-main {
          margin-left: var(--sidebar-w);
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .auditor-topbar {
          height: 68px;
          border-bottom: 1px solid var(--gray-200);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .auditor-top-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.5px;
        }
        .auditor-top-sub {
          font-size: 0.8rem;
          color: var(--gray-400);
          margin-top: 2px;
        }
        .auditor-content {
          padding: 24px 32px;
          flex: 1;
        }
      `}</style>

      <aside className="auditor-sidebar">
        <div className="auditor-brand">
          <div className="auditor-logo">🛰️</div>
          <div className="auditor-title">
            SENTINEL
            <br />
            AUDIT COMMAND
          </div>
        </div>

        {auditorMenuSections.map((section) => (
          <div className="auditor-section" key={section.title}>
            <div className="auditor-section-label">{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `auditor-link ${isActive ? "active" : ""}`
                }
                onClick={(e) => {
                  if (item.label === "Logout") {
                    e.preventDefault();
                    navigate("/login");
                  }
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge ? <span className="auditor-badge">{item.badge}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}

        <div className="auditor-footer">
          <div className="auditor-user">
            <div className="auditor-avatar">AU</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.92rem" }}>Auditor 01</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
                Forensic Auditor
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="auditor-main">
        <header className="auditor-topbar">
          <div>
            <div className="auditor-top-title">{pageTitle}</div>
            <div className="auditor-top-sub">Auditor Sentinel / {pageTitle}</div>
          </div>
        </header>
        <div className="auditor-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuditorLayout;
