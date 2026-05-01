import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("admin@gov.in");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const id = "pfts-google-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const selectRole = (nextRole) => {
    const map = {
      admin: "admin@gov.in",
      auditor: "auditor@gov.in",
      public: "public@gov.in",
    };
    setRole(nextRole);
    setEmail(map[nextRole] || "");
  };

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (role === "admin") {
      navigate("/admin/dashboard");
      return;
    }
    if (role === "auditor") {
      navigate("/auditor/dashboard");
      return;
    }
    navigate("/public/home");
  };

  return (
    <div className="login-root">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy: #0f1f3d;
          --navy-mid: #1a3260;
          --navy-light: #243d73;
          --gold: #f5a623;
          --gold-light: #fbbf47;
          --green: #22c55e;
          --white: #ffffff;
          --gray-100: #f4f6fb;
          --gray-200: #e2e8f4;
          --gray-400: #94a3b8;
          --gray-600: #64748b;
          --text: #1e293b;
          --danger: #ef4444;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--gray-100);
          margin: 0;
          padding: 0;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        .login-root {
          font-family: 'DM Sans', sans-serif;
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
        }

        .login-card {
          width: 100%;
          height: 100%;
          display: flex;
          background: white;
          overflow: hidden;
        }

        .left-panel {
          width: 42%;
          background: linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 60%, var(--navy-light) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px;
          position: relative;
          overflow: hidden;
        }

        .left-panel::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: rgba(245,166,35,0.07);
          top: -150px; left: -150px;
          animation: pulse 6s ease-in-out infinite;
        }
        .left-panel::after {
          content: '';
          position: absolute;
          width: 350px; height: 350px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          bottom: -100px; right: -100px;
          animation: pulse 8s ease-in-out infinite reverse;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .brand-icon {
          width: 90px; height: 90px;
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(245,166,35,0.4);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
          backdrop-filter: blur(10px);
          position: relative; z-index: 1;
          animation: floatY 4s ease-in-out infinite;
        }

        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .brand-icon svg { width: 52px; height: 52px; fill: var(--gold); }

        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          color: var(--white);
          text-align: center;
          line-height: 1.1;
          margin-bottom: 16px;
          position: relative; z-index: 1;
        }

        .brand-tagline {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.55);
          letter-spacing: 4px;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 70px;
          position: relative; z-index: 1;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          width: 100%;
          max-width: 400px;
          position: relative; z-index: 1;
        }

        .stat-card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 24px 20px;
          backdrop-filter: blur(8px);
        }

        .stat-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 1.8px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--gold);
        }

        .stat-sub {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          margin-top: 4px;
        }

        .right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px;
          background: var(--white);
        }

        .login-form-container {
          width: 100%;
          max-width: 460px;
          animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-header { margin-bottom: 44px; }

        .login-header h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 10px;
        }

        .login-header p {
          font-size: 1rem;
          color: var(--gray-600);
        }

        .form-group { margin-bottom: 20px; }

        label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 7px;
          letter-spacing: 0.3px;
        }

        .input-wrap {
          position: relative;
        }

        .input-wrap svg {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          width: 18px; height: 18px;
          stroke: var(--gray-400);
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          pointer-events: none;
          transition: stroke 0.2s;
        }

        input[type="email"],
        input[type="password"],
        input[type="text"] {
          width: 100%;
          padding: 16px 16px 16px 50px;
          border: 1.5px solid var(--gray-200);
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
          color: var(--text);
          background: var(--gray-100);
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        input:focus {
          border-color: var(--navy-mid);
          background: var(--white);
          box-shadow: 0 0 0 4px rgba(26,50,96,0.08);
        }

        .eye-toggle {
          position: absolute;
          right: 18px; top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          background: none; border: none;
          padding: 0; color: var(--gray-400);
          transition: color 0.2s;
        }
        .eye-toggle:hover { color: var(--navy-mid); }
        .eye-toggle svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          margin-top: -4px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--gray-600);
          cursor: pointer;
          margin: 0;
        }

        .remember-me input[type="checkbox"] {
          width: 18px; height: 18px;
          accent-color: var(--navy-mid);
          cursor: pointer;
          padding: 0; border: none; background: none;
        }

        .forgot { font-size: 0.9rem; color: var(--navy-mid); text-decoration: none; font-weight: 500; }
        .forgot:hover { text-decoration: underline; }

        .btn-login {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%);
          color: var(--white);
          border: none;
          border-radius: 12px;
          font-family: inherit;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 18px rgba(15,31,61,0.28);
          margin-bottom: 32px;
        }

        .btn-login:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(15,31,61,0.34); }
        .btn-login:active { transform: translateY(0); }

        .divider {
          text-align: center;
          position: relative;
          margin-bottom: 30px;
        }

        .divider::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          width: 100%; height: 1px;
          background: var(--gray-200);
        }

        .divider span {
          position: relative;
          background: var(--white);
          padding: 0 16px;
          font-size: 0.85rem;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .role-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 18px 12px;
          border: 1.5px solid var(--gray-200);
          border-radius: 16px;
          background: var(--gray-100);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          font-family: inherit;
        }

        .role-btn:hover, .role-btn.active {
          border-color: var(--navy-mid);
          background: rgba(26,50,96,0.05);
          transform: translateY(-3px);
          box-shadow: 0 10px 20px -5px rgba(26,50,96,0.1);
        }

        .role-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }

        .role-icon.admin   { background: rgba(15,31,61,0.1); }
        .role-icon.auditor { background: rgba(34,197,94,0.1); }
        .role-icon.public  { background: rgba(245,166,35,0.1); }

        .role-icon svg {
          width: 24px;
          height: 24px;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .role-icon.admin svg   { stroke: var(--navy); }
        .role-icon.auditor svg { stroke: var(--green); }
        .role-icon.public svg  { stroke: var(--gold); }

        .role-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }

        @media (max-width: 1024px) {
          .left-panel { display: none; }
        }
      `}</style>

      <div className="login-card">
        <div className="left-panel">
          <div className="brand-icon">
            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="28" width="48" height="28" rx="2" />
              <polygon points="4,28 32,6 60,28" />
              <rect x="24" y="40" width="16" height="16" rx="1" />
              <rect
                x="14"
                y="34"
                width="8"
                height="10"
                rx="1"
                fill="rgba(255,255,255,0.3)"
              />
              <rect
                x="42"
                y="34"
                width="8"
                height="10"
                rx="1"
                fill="rgba(255,255,255,0.3)"
              />
            </svg>
          </div>

          <h1 className="brand-name">
            Public Fund
            <br />
            Tracking System
          </h1>
          <p className="brand-tagline">Transparent · Accountable · Trusted</p>

          <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>Transparent. Secure. Unfakeable.</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '300px', margin: '0 auto 20px' }}>
              Join the movement towards total financial accountability. 
              Real-time tracking of public resources, secured by blockchain.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Are you a citizen?</span>
              <button 
                style={{ background: '#f5a623', color: '#0f1f3d', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                onClick={() => navigate('/public/home')}
              >
                Enter Public Portal →
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Projects</div>
              <div className="stat-value">25</div>
              <div className="stat-sub">Active this quarter</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Budget</div>
              <div className="stat-value">₹25 Cr</div>
              <div className="stat-sub">Allocated</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Released</div>
              <div className="stat-value">₹12.5 Cr</div>
              <div className="stat-sub">Disbursed so far</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Utilised</div>
              <div className="stat-value">62%</div>
              <div className="stat-sub">Of released funds</div>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="login-form-container">
            <div className="login-header">
              <h2>Welcome Back!</h2>
              <p>Login to your account</p>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <input
                  type="email"
                  id="email"
                  placeholder="admin@gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <polyline points="2,4 12,13 22,4" />
                </svg>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <button
                  className="eye-toggle"
                  type="button"
                  title="Show/Hide"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <svg id="eye-icon" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="form-footer">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="/login" className="forgot">
                Forgot Password?
              </a>
            </div>

            <button className="btn-login" onClick={handleLogin} type="button">
              Login
            </button>

            <div className="divider">
              <span>Login as</span>
            </div>

            <div className="role-grid">
              <button
                className={`role-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => selectRole("admin")}
                type="button"
              >
                <div className="role-icon admin">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="role-name">Admin</span>
              </button>
              <button
                className={`role-btn ${role === "auditor" ? "active" : ""}`}
                onClick={() => selectRole("auditor")}
                type="button"
              >
                <div className="role-icon auditor">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <span className="role-name">Auditor</span>
              </button>
              <button
                className={`role-btn ${role === "public" ? "active" : ""}`}
                onClick={() => selectRole("public")}
                type="button"
              >
                <div className="role-icon public">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 1 0-16 0" />
                  </svg>
                </div>
                <span className="role-name">Public</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
