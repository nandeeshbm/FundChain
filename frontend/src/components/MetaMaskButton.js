import { useState, useEffect } from 'react';
import {
  isMetaMaskAvailable, connectWallet, getConnectedAccount,
  ensureSepolia, shortAddress, onAccountChange
} from '../services/metaMask';

export default function MetaMaskButton({ onConnected, compact = false }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // On mount: check if already connected
  useEffect(() => {
    getConnectedAccount().then(acc => {
      if (acc) { setAccount(acc); onConnected?.(acc); }
    });
    const cleanup = onAccountChange(acc => {
      setAccount(acc);
      onConnected?.(acc);
    });
    return cleanup;
  }, []);

  const connect = async () => {
    setLoading(true); setError(null);
    try {
      if (!isMetaMaskAvailable()) {
        window.open('https://metamask.io/download/', '_blank');
        setError('MetaMask not found — please install it and refresh');
        return;
      }
      await ensureSepolia();
      const acc = await connectWallet();
      setAccount(acc);
      onConnected?.(acc);
    } catch (e) {
      setError(e.message || 'Connection failed');
    } finally { setLoading(false); }
  };

  if (account) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          padding: compact ? '5px 12px' : '8px 16px',
          borderRadius: 20,
          background: 'rgba(16,185,129,0.1)',
          border: '1.5px solid #10b981',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: compact ? 11 : 12, fontWeight: 700,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          🦊 {shortAddress(account)}
          <span style={{ fontSize: 10, color: '#10b981', marginLeft: 4 }}>Sepolia</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={connect} disabled={loading}
        style={{
          padding: compact ? '6px 14px' : '9px 20px',
          background: loading ? '#94a3b8' : 'linear-gradient(135deg, #f6851b, #e2761b)',
          color: 'white', border: 'none', borderRadius: 10,
          fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: compact ? 11 : 13, display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 8px rgba(246,133,27,0.3)',
        }}>
        🦊 {loading ? 'Connecting...' : 'Connect MetaMask'}
      </button>
      {error && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{error}</div>}
    </div>
  );
}
