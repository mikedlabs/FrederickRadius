import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { municipalities } from '../../data/municipalities';

const COUNTY_STATS = [
  { label: 'Population', value: 305000, display: '305K+', color: '#3B82F6', icon: '👥' },
  { label: 'Businesses', value: 4500, display: '4,500+', color: '#10B981', icon: '🏪' },
  { label: 'Annual Visitors', value: 1900000, display: '1.9M', color: '#F59E0B', icon: '🧳' },
  { label: 'Economic Impact', value: 560, display: '$560M', color: '#8B5CF6', icon: '💰' },
  { label: 'Municipalities', value: 12, display: '12', color: '#EC4899', icon: '🏘️' },
  { label: 'Data Sources', value: 500, display: '500+', color: '#06B6D4', icon: '📊' },
];

const ECONOMIC_HIGHLIGHTS = [
  { label: 'Median Household Income', value: '$120,458', context: '33% above national median', trend: 'up' },
  { label: 'Median Home Value', value: '$437,700', context: 'Strong real estate market', trend: 'up' },
  { label: 'Unemployment Rate', value: '2.5%', context: 'Well below national average', trend: 'down' },
  { label: 'Labor Force', value: '153,799', context: 'Highly educated workforce', trend: 'stable' },
];

export function CountyDashboard() {
  const totalPop = municipalities.reduce((sum, m) => sum + m.population, 0);

  return (
    <div className="space-y-5">
      {/* Hero stats grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-3 gap-2"
      >
        {COUNTY_STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            className="rounded-xl bg-bg-elevated border border-border p-3 text-center"
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="text-lg font-bold tabular-nums" style={{ color: stat.color }}>
              {stat.display}
            </div>
            <div className="text-[9px] text-text-muted uppercase tracking-wider mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Economic highlights */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
          Economic Indicators
        </h4>
        <div className="space-y-1.5">
          {ECONOMIC_HIGHLIGHTS.map((item) => (
            <div key={item.label} className="rounded-lg bg-bg-surface border border-border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-text-muted">{item.label}</div>
                  <div className="text-base font-bold text-text mt-0.5">{item.value}</div>
                </div>
                <div className="text-right">
                  <span className={`text-xs ${
                    item.trend === 'up' ? 'text-success' : item.trend === 'down' ? 'text-success' : 'text-text-muted'
                  }`}>
                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-text-muted mt-1">{item.context}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Municipality breakdown */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
          Municipality Population Share
        </h4>
        <div className="space-y-1.5">
          {municipalities
            .sort((a, b) => b.population - a.population)
            .slice(0, 6)
            .map((m) => {
              const pct = (m.population / totalPop) * 100;
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-text truncate">
                    {m.name.replace(/^(City of |Town of |Village of )/, '')}
                  </div>
                  <div className="flex-1 h-2 bg-bg-hover rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                  <div className="w-16 text-right text-xs text-text-muted tabular-nums">
                    {m.population.toLocaleString()}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Data sources summary */}
      <div className="rounded-xl bg-gradient-to-br from-accent/5 to-success/5 border border-accent/10 p-4">
        <div className="text-sm font-semibold text-text mb-2">Powered by Real Data</div>
        <div className="grid grid-cols-2 gap-y-1.5 text-xs text-text-secondary">
          <span>Frederick County GIS</span>
          <span>198 services</span>
          <span>City of Frederick GIS</span>
          <span>67 services</span>
          <span>Maryland iMAP</span>
          <span>120+ layers</span>
          <span>Federal APIs</span>
          <span>Census, FEMA, NPS, BLS</span>
          <span>Real-time feeds</span>
          <span>NWS, USGS, CHART, 311</span>
        </div>
      </div>

      <div className="text-xs text-text-muted text-center">
        Sources: Census ACS 2023, BLS, Frederick County Economic Development
      </div>
    </div>
  );
}
