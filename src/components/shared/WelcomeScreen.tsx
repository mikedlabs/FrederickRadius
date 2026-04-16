import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const HERO_STATS = [
  { label: 'Residents', value: 305, suffix: 'K+', color: '#3B82F6' },
  { label: 'Businesses', value: 4.5, suffix: 'K+', color: '#10B981' },
  { label: 'Annual Visitors', value: 1.9, suffix: 'M', color: '#F59E0B' },
  { label: 'Economic Impact', value: 560, suffix: 'M', color: '#8B5CF6', prefix: '$' },
];

const AUDIENCES = [
  {
    icon: '👥',
    title: 'Residents',
    desc: 'Discover local experiences and connect with your community',
    features: ['Real-time local events', 'Civic engagement tools', 'Neighborhood alerts'],
  },
  {
    icon: '🏪',
    title: 'Businesses',
    desc: 'Engage customers and grow within our local ecosystem',
    features: ['Targeted local reach', 'Customer analytics', 'Promotion tools'],
  },
  {
    icon: '🧭',
    title: 'Visitors',
    desc: 'Experience the best of Frederick County\'s 12 communities',
    features: ['Interactive map', 'Events & attractions', 'Hidden gems'],
  },
];

export function WelcomeScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'hero' | 'audience' | 'ready'>('hero');
  const [counters, setCounters] = useState(HERO_STATS.map(() => 0));

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('audience'), 2200);
    const t2 = setTimeout(() => setPhase('ready'), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Animate counters
  useEffect(() => {
    if (phase === 'hero') {
      const duration = 1400;
      const steps = 40;
      const interval = duration / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = Math.min(step / steps, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCounters(HERO_STATS.map((s) => {
          const val = s.value * eased;
          return s.value >= 100 ? Math.round(val) : Math.round(val * 10) / 10;
        }));
        if (step >= steps) clearInterval(timer);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [phase]);

  function handleEnter() {
    onComplete();
  }

  // Enter key shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') handleEnter(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-bg">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 800, height: 800, background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 -translate-x-1/2 rounded-full"
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ width: 600, height: 600, background: 'radial-gradient(circle, #10B981 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <AnimatePresence mode="wait">
          {/* ── PHASE: HERO ── */}
          {phase === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Pin icon */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-4 text-5xl"
              >
                📍
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold tracking-tight"
              >
                <span className="text-text">Frederick</span>
                <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Radius</span>
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mx-auto mt-3 h-0.5 w-16 bg-gradient-to-r from-accent to-success rounded-full"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-lg text-text-secondary"
              >
                Connect Locally. One Radius.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="mt-2 text-sm text-text-muted max-w-md mx-auto"
              >
                Seamlessly bringing everything local right to your fingertips across all 12 communities of Frederick County.
              </motion.p>

              {/* Stats bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8 flex items-center justify-center gap-6 md:gap-10 flex-wrap"
              >
                {HERO_STATS.map((stat, i) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold tabular-nums" style={{ color: stat.color }}>
                      {stat.prefix || ''}{counters[i]}{stat.suffix}
                    </div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── PHASE: AUDIENCE ── */}
          {phase === 'audience' && (
            <motion.div
              key="audience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-text mb-2">One County. Twelve Communities. Connected.</h2>
              <p className="text-sm text-text-muted mb-8">Be part of the digital revolution connecting Frederick County</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {AUDIENCES.map((a, i) => (
                  <motion.div
                    key={a.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="rounded-xl bg-bg-surface border border-border p-5 text-left"
                  >
                    <div className="text-3xl mb-3">{a.icon}</div>
                    <h3 className="text-base font-semibold text-text">{a.title}</h3>
                    <p className="mt-1 text-xs text-text-secondary">{a.desc}</p>
                    <ul className="mt-3 space-y-1.5">
                      {a.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-success">
                          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PHASE: READY ── */}
          {phase === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-5xl mb-4"
              >
                🗺️
              </motion.div>

              <h2 className="text-3xl font-bold text-text">Ready to Explore?</h2>
              <p className="mt-2 text-sm text-text-secondary">
                500+ live data sources. 60 map layers. 12 municipalities.
              </p>

              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-hover px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25"
              >
                Explore Frederick County
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-[10px] text-text-muted"
              >
                Press <kbd className="rounded bg-bg-surface border border-border px-1.5 py-0.5 text-[9px]">Enter</kbd> to begin
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
