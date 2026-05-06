import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const statusMeta = {
  active: { label: 'Active', color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  in_progress: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  completed: { label: 'Completed', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  planning: { label: 'Planning', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
  flagged: { label: 'Flagged', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const formatMoney = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;

const DepartmentIcon = ({ department }) => {
  const stroke = department === 'Water Dept' ? '#0ea5e9' : department === 'Education' ? '#8b5cf6' : '#f59e0b';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M6 21V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13" />
      <path d="M10 21v-6h4v6" />
      <path d="M8 10h2" />
      <path d="M14 10h2" />
    </svg>
  );
};

const PublicSearch = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setProjects([]);
    setPage(1);
  }, [searchTerm, department]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ page: String(page), limit: '12' });
        if (searchTerm) params.append('search', searchTerm);
        if (department) params.append('department', department);
        const res = await axios.get(`${API}/public/projects?${params.toString()}`);
        if (res.data.success) {
          const next = res.data.data || [];
          setProjects((prev) => (page === 1 ? next : [...prev, ...next]));
          setTotal(res.data.pagination?.total || next.length);
          setHasMore(page < (res.data.pagination?.totalPages || 1));
        } else {
          setError('Unable to load projects.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [page, searchTerm, department]);

  const displayProjects = useMemo(() => {
    let list = [...projects];
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter);
    }
    list.sort((a, b) => {
      if (sortBy === 'budget_desc') return (b.totalBudget || 0) - (a.totalBudget || 0);
      if (sortBy === 'budget_asc') return (a.totalBudget || 0) - (b.totalBudget || 0);
      if (sortBy === 'progress_desc') return (b.progress || 0) - (a.progress || 0);
      if (sortBy === 'progress_asc') return (a.progress || 0) - (b.progress || 0);
      if (sortBy === 'name_asc') return String(a.projectName || '').localeCompare(String(b.projectName || ''));
      const aDate = new Date(a.projectCreationDateTime || a.createdAt || 0).getTime();
      const bDate = new Date(b.projectCreationDateTime || b.createdAt || 0).getTime();
      return sortBy === 'oldest' ? aDate - bDate : bDate - aDate;
    });
    return list;
  }, [projects, statusFilter, sortBy]);

  const totalBudget = displayProjects.reduce((sum, p) => sum + Number(p.totalBudget || 0), 0);
  const visibleCount = statusFilter === 'all' ? total : displayProjects.length;

  const handleSearch = () => setSearchTerm(query.trim());

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <div style={styles.searchRow}>
          <div style={styles.searchBar}>
            <span style={styles.searchIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              style={styles.input}
              value={query}
              placeholder="Search by project name or ID"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button style={styles.searchBtn} onClick={handleSearch}>Search</button>
          </div>
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              Sort by
              <select style={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="budget_desc">Budget High to Low</option>
                <option value="budget_asc">Budget Low to High</option>
                <option value="progress_desc">Progress High to Low</option>
                <option value="progress_asc">Progress Low to High</option>
                <option value="name_asc">Name A to Z</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              Filter
              <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="planning">Planning</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              Department
              <select style={styles.select} value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">All Departments</option>
                <option value="PWD">PWD</option>
                <option value="Water Dept">Water Dept</option>
                <option value="Education">Education</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </div>

        <div style={styles.statsBar}>
          <span style={styles.statsText}>Found {visibleCount} projects | Total Budget: {formatMoney(totalBudget)}</span>
          {loading && <span style={styles.loadingBadge}>Updating...</span>}
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.resultsGrid}>
          {displayProjects.length === 0 && !loading ? (
            <div style={styles.emptyState}>No projects match your filters.</div>
          ) : displayProjects.map((proj) => {
            const meta = statusMeta[proj.status] || { label: proj.status || 'Unknown', color: '#64748b', bg: 'rgba(148,163,184,0.1)' };
            return (
              <div key={proj._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.iconWrap}><DepartmentIcon department={proj.department} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.cardTitle}>{proj.projectName}</div>
                    <div style={styles.cardSub}>{proj.department || 'Department'} - {proj.projectId}</div>
                  </div>
                  <span style={{ ...styles.statusPill, background: meta.bg, color: meta.color }}>{meta.label}</span>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.metaRow}><span>Budget</span><strong>{formatMoney(proj.totalBudget)}</strong></div>
                  <div style={styles.metaRow}><span>Released</span><strong>{formatMoney(proj.releasedAmount)}</strong></div>
                  <div style={styles.metaRow}><span>Contractor</span><strong>{proj.contractorName || 'N/A'}</strong></div>
                  <div style={styles.progressRow}>
                    <div style={styles.progressTrack}>
                      <div style={{ ...styles.progressFill, width: `${proj.progress || 0}%` }} />
                    </div>
                    <span style={styles.progressLabel}>{proj.progress || 0}%</span>
                  </div>
                </div>
                <button style={styles.viewBtn} onClick={() => navigate(`/public/project-details/${proj.projectId}`)}>
                  View Details
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          {hasMore && (
            <button style={styles.loadMoreBtn} onClick={() => setPage((p) => p + 1)} disabled={loading}>
              {loading ? 'Loading...' : 'Load More Results'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { width: '100%', fontFamily: "'Sora', sans-serif" },
  main: { width: '100%', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 },
  searchRow: { display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' },
  searchBar: { flex: '1 1 360px', display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderRadius: 12, padding: '10px 14px', border: '1px solid #e2e8f0' },
  searchIcon: { color: '#94a3b8', display: 'flex', alignItems: 'center' },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#1e293b', background: 'transparent' },
  searchBtn: { background: '#0f1f3d', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' },
  filterRow: { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' },
  filterGroup: { display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, fontWeight: 700, color: '#94a3b8' },
  select: { border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, color: '#1e293b', outline: 'none', cursor: 'pointer', borderRadius: 8, padding: '6px 10px', fontSize: 12 },
  statsBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #e2e8f0' },
  statsText: { fontSize: 13, color: '#64748b' },
  loadingBadge: { fontSize: 11, color: '#2563eb', fontWeight: 700 },
  errorBox: { background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 10, fontSize: 12 },
  resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 },
  card: { background: 'white', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0', boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)', display: 'flex', flexDirection: 'column', gap: 12 },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: 800, color: '#1e293b' },
  cardSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  statusPill: { padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 },
  cardBody: { display: 'flex', flexDirection: 'column', gap: 6 },
  metaRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' },
  progressRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 },
  progressTrack: { flex: 1, height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#2563eb', borderRadius: 999 },
  progressLabel: { fontSize: 11, fontWeight: 700, color: '#475569' },
  viewBtn: { border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', borderRadius: 10, padding: '8px 12px', fontWeight: 700, fontSize: 12, cursor: 'pointer' },
  loadMoreBtn: { padding: '10px 20px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer' },
  emptyState: { gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: 24, fontWeight: 600 },
};

export default PublicSearch;
