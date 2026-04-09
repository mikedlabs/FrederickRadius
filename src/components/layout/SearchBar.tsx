import { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useAppState } from '../../hooks/useAppState';
import { useMapFlyTo } from '../../hooks/useMapFlyTo';
import { municipalities } from '../../data/municipalities';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { results, loading, error, search } = useSearch();
  const { dispatch } = useAppState();
  const { flyTo: mapFlyTo } = useMapFlyTo();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    clearTimeout(timerRef.current);
    if (value.trim().length > 2) {
      timerRef.current = setTimeout(() => {
        search(value);
        setShowResults(true);
      }, 400);
    } else {
      setShowResults(false);
    }
  }

  function handleSelect(lat: string, lon: string, name: string) {
    setShowResults(false);
    setQuery(name.split(',')[0]);
    mapFlyTo(parseFloat(lon), parseFloat(lat), 15);
    dispatch({
      type: 'ADDRESS_INTEL',
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      address: name,
    });
  }

  function handleMunicipalitySelect(id: string) {
    setShowResults(false);
    dispatch({ type: 'SELECT_MUNICIPALITY', id });
  }

  const matchedMunis = query.trim().length > 0
    ? municipalities.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center justify-between gap-2 px-1 pb-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
          Address Lookup
        </div>
        <div className="rounded-full border border-border/70 bg-white/55 px-2 py-1 text-[10px] font-medium text-text-muted">
          Fallback geocoder
        </div>
      </div>

      <div className="panel-surface rounded-[24px] p-2">
        <div className="flex items-center gap-3 rounded-[18px] border border-border/70 bg-white/75 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(12,101,126,0.18),rgba(177,129,41,0.12))] text-accent">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              onFocus={() => query.length > 2 && setShowResults(true)}
              placeholder="Search Frederick addresses"
              className="w-full bg-transparent text-sm font-medium text-text placeholder-text-muted outline-none"
            />
            <div className="mt-1 text-[11px] text-text-muted">
              Addresses help locate places but do not verify official jurisdiction or mailing status.
            </div>
          </div>
          {loading && (
            <div className="h-5 w-5 flex-shrink-0 animate-spin rounded-full border-2 border-border border-t-accent" />
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 rounded-2xl border border-danger/20 bg-danger/8 px-3 py-2 text-[11px] leading-5 text-danger">
          {error}
        </div>
      )}

      {showResults && (matchedMunis.length > 0 || results.length > 0) && (
        <div className="panel-surface-strong absolute left-0 right-0 top-full z-50 mt-3 max-h-80 overflow-y-auto rounded-[28px] p-3">
          {matchedMunis.length > 0 && (
            <div>
              <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                Municipality Reference
              </div>
              <div className="space-y-1.5">
                {matchedMunis.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleMunicipalitySelect(m.id)}
                    className="flex w-full items-center gap-3 rounded-[18px] border border-border/60 bg-white/70 px-3 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:bg-white/90"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(12,101,126,0.16),rgba(177,129,41,0.08))] text-sm font-semibold text-accent">
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-text">{m.name}</div>
                      <div className="text-[11px] text-text-muted">Manual reference snapshot</div>
                    </div>
                    <span className="ml-auto rounded-full border border-border/70 bg-bg-surface px-2 py-1 text-[10px] text-text-muted">
                      {m.population.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className={matchedMunis.length > 0 ? 'mt-4' : ''}>
              <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                Address Results (Nominatim)
              </div>
              <div className="space-y-1.5">
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(r.lat, r.lon, r.display_name)}
                    className="flex w-full items-start gap-3 rounded-[18px] border border-border/60 bg-white/70 px-3 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:bg-white/90"
                  >
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(29,125,102,0.14),rgba(12,101,126,0.08))] text-success">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="line-clamp-2 text-sm font-medium text-text">{r.display_name}</div>
                      <div className="mt-1 text-[11px] text-text-muted">
                        Search convenience only. Confirm jurisdiction with authoritative county or municipality sources.
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
