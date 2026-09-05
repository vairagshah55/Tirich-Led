import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import styles from './LeadListPage.module.css';
import { isLocalhost } from '../../utils/browser';
import Seo from '../../components/Seo/Seo';

// The lead API lives on the shared 57facets backend (Node + Postgres) — the
// tirichled.com domain only serves this static frontend, so calls go to
// 57facets.in in prod (CORS is allow-listed there for tirichled.com).
// Auto-selects by host; override with REACT_APP_LEAD_API_BASE if needed.
const LEAD_API_BASE =
  process.env.REACT_APP_LEAD_API_BASE ||
  (isLocalhost() ? 'http://localhost:5000/api' : 'https://57facets.in/api');

// Optional API key — set REACT_APP_TIRICH_LEADS_KEY to match TIRICH_LEADS_KEY
// on the server. Sent as the x-api-key header when present.
const LEADS_KEY = process.env.REACT_APP_TIRICH_LEADS_KEY || '';

const PAGE_SIZE = 50;

const BUSINESS_LABELS = {
  'led-showroom': 'LED Showroom',
  'electrical-shop': 'Electrical Shop',
  distributor: 'Distributor',
  other: 'Other',
};

const DESIGNATION_LABELS = {
  owner: 'Owner',
  interior: 'Interior Designer',
  architect: 'Architect',
};

function businessLabel(lead) {
  if (lead.business_type === 'other') return lead.business_other || 'Other';
  return BUSINESS_LABELS[lead.business_type] || lead.business_type || '—';
}

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function LeadListPage() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  // Debounce the search input so we don't fire a request per keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setOffset(0);
      setDebouncedSearch(search.trim());
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const fetchLeads = useCallback(async () => {
    setStatus('loading');
    setError('');
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
      });
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`${LEAD_API_BASE}/sub-domain/lead-list/data?${params}`, {
        headers: LEADS_KEY ? { 'x-api-key': LEADS_KEY } : undefined,
      });

      if (res.status === 401) {
        throw new Error('Unauthorized — a valid API key is required to view leads.');
      }
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const json = await res.json();
      const data = json?.data || {};
      setLeads(Array.isArray(data.leads) ? data.leads : []);
      setTotal(typeof data.total === 'number' ? data.total : 0);
      setStatus('ready');
    } catch (err) {
      setError(err.message || 'Could not load leads.');
      setLeads([]);
      setStatus('error');
    }
  }, [offset, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Export current view (respects the active search) to .xlsx. The export
  // endpoint sends the key as a header, so fetch as a blob rather than
  // navigating — a plain link can't set the x-api-key header.
  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      const qs = params.toString();

      const res = await fetch(
        `${LEAD_API_BASE}/sub-domain/lead-list/export${qs ? `?${qs}` : ''}`,
        { headers: LEADS_KEY ? { 'x-api-key': LEADS_KEY } : undefined }
      );
      if (!res.ok) throw new Error(`Export failed (${res.status})`);

      // Prefer the server-provided filename, else stamp our own.
      const disp = res.headers.get('Content-Disposition') || '';
      const match = disp.match(/filename="?([^"]+)"?/i);
      const filename = match
        ? match[1]
        : `tirich-leads-${new Date().toISOString().slice(0, 10)}.xlsx`;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Could not export leads.');
    } finally {
      setExporting(false);
    }
  }, [debouncedSearch]);

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : offset + 1;
  const rangeEnd = Math.min(offset + PAGE_SIZE, total);

  const summary = useMemo(() => {
    if (status === 'loading') return 'Loading…';
    if (status === 'error') return '—';
    return total === 1 ? '1 lead' : `${total} leads`;
  }, [status, total]);

  return (
    <div className={styles.page}>
      <Seo title="Leads" noindex nofollow />
      <section className={styles.wrap}>
        {/* Toolbar — search + count, no page header */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, or city"
              aria-label="Search leads"
            />
          </div>
          <div className={styles.toolbarRight}>
            <span className={styles.count}>{summary}</span>
            <button
              type="button"
              className={styles.exportBtn}
              onClick={handleExport}
              disabled={exporting || status === 'loading' || total === 0}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {exporting ? 'Exporting…' : 'Export'}
            </button>
          </div>
        </div>

        {/* Body */}
        {status === 'error' ? (
          <div className={styles.stateCard}>
            <p className={styles.stateTitle}>Couldn’t load leads</p>
            <p className={styles.stateText}>{error}</p>
            <button type="button" className={styles.retryBtn} onClick={fetchLeads}>
              Try again
            </button>
          </div>
        ) : status === 'loading' ? (
          <div className={styles.tableCard}>
            <div className={styles.skeletonHead} />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeletonRow} />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className={styles.stateCard}>
            <p className={styles.stateTitle}>No leads found</p>
            <p className={styles.stateText}>
              {debouncedSearch
                ? `Nothing matched “${debouncedSearch}”.`
                : 'No one has submitted the lead form yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className={styles.tableCard}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.colNum}>#</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Business</th>
                      <th>Designation</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <motion.tr
                        key={lead.id ?? `${lead.phone}-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: Math.min(i * 0.015, 0.3) }}
                      >
                        <td className={styles.colNum}>{offset + i + 1}</td>
                        <td className={styles.cellName}>{lead.name || '—'}</td>
                        <td>
                          <a className={styles.phoneLink} href={`tel:${String(lead.phone || '').replace(/[^\d+]/g, '')}`}>
                            {lead.phone || '—'}
                          </a>
                        </td>
                        <td>{lead.city || '—'}</td>
                        <td>
                          <span className={styles.pill}>{businessLabel(lead)}</span>
                        </td>
                        <td>{DESIGNATION_LABELS[lead.designation] || lead.designation || '—'}</td>
                        <td className={styles.cellDate}>{formatDate(lead.created_at)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className={styles.pager}>
              <span className={styles.pagerInfo}>
                Showing <strong>{rangeStart}–{rangeEnd}</strong> of <strong>{total}</strong>
              </span>
              <div className={styles.pagerBtns}>
                <button
                  type="button"
                  className={styles.pagerBtn}
                  onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
                  disabled={offset === 0}
                >
                  Previous
                </button>
                <span className={styles.pagerPage}>Page {page} / {pageCount}</span>
                <button
                  type="button"
                  className={styles.pagerBtn}
                  onClick={() => setOffset((o) => (o + PAGE_SIZE < total ? o + PAGE_SIZE : o))}
                  disabled={offset + PAGE_SIZE >= total}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
