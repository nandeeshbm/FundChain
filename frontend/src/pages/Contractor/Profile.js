export default function ContractorProfile() {
  const name = localStorage.getItem('userName') || 'Contractor';
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", maxWidth: 600 }}>
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Banner */}
        <div style={{ height: 100, background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3260 100%)' }} />
        
        {/* Avatar */}
        <div style={{ padding: '0 28px 28px', marginTop: -40 }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: 'white', border: '4px solid white', marginBottom: 16 }}>
            {initials}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{name}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Contractor · Public Fund Tracking System</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
            {[
              { label: 'Role', value: 'Contractor' },
              { label: 'Portal', value: 'Public Fund Tracker' },
              { label: 'Status', value: '🟢 Active' },
              { label: 'User ID', value: localStorage.getItem('userId')?.slice(-8) || 'N/A' },
            ].map(row => (
              <div key={row.label} style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{row.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
