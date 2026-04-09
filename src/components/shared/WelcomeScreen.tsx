import { mapLayers } from '../../data/layers';
import { municipalities } from '../../data/municipalities';
import { sourceRegistry } from '../../data/source-registry';

interface Props {
  onComplete: () => void;
}

const trustCards = [
  {
    title: 'Official feeds first',
    body: 'Weather, water, traffic, and county GIS layers should look and behave differently from community reports or manual snapshots.',
  },
  {
    title: 'Guided civic views',
    body: 'Start from real local questions like flood readiness, planning context, or civic services before browsing the raw catalog.',
  },
  {
    title: 'Uncertainty stays visible',
    body: 'If Frederick Radius only has a manual snapshot or approximate lookup, the interface should state that directly.',
  },
  {
    title: 'Utility over hype',
    body: 'The product should feel like a serious county atlas rather than a novelty civic dashboard.',
  },
];

export function WelcomeScreen({ onComplete }: Props) {
  const sourceCount = Object.keys(sourceRegistry).length;
  const officialCount = Object.values(sourceRegistry).filter((source) => source.official).length;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden text-text">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(12,101,126,0.2),transparent_28%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_16%,rgba(177,129,41,0.16),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,244,235,0.98),rgba(235,223,205,0.96))]" />

      <div className="relative mx-auto flex min-h-full max-w-7xl items-center px-6 py-8">
        <div className="grid w-full gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="panel-surface-strong topographic-lines flex flex-col justify-between rounded-[40px] p-7 md:p-10">
            <div>
              <div className="eyebrow">Civic intelligence preview</div>
              <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[0.9] tracking-tight md:text-7xl">
                Frederick Radius is designed as a local atlas, not a generic map app.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-text-secondary md:text-lg">
                A trust-first civic and place context product for Frederick County and the City of Frederick. The strongest sources are official feeds and GIS catalogs. The weaker areas remain visibly labeled as manual or approximate.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={onComplete}
                  className="rounded-full bg-text px-6 py-3 text-sm font-semibold text-bg-elevated transition-transform hover:-translate-y-0.5"
                >
                  Open Frederick Radius
                </button>
                <div className="rounded-full border border-border/70 bg-white/60 px-4 py-3 text-xs text-text-secondary">
                  Press Enter to continue
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              <MetricCard
                label="Sources in registry"
                value={String(sourceCount)}
                detail="Documented with authority, cadence, and risk notes"
              />
              <MetricCard
                label="Official sources"
                value={String(officialCount)}
                detail="Government-published feeds or catalogs"
              />
              <MetricCard
                label="Configured layers"
                value={String(mapLayers.length)}
                detail={`${municipalities.length} municipality profiles with manual snapshot notes`}
              />
            </div>
          </section>

          <section className="grid gap-4">
            <div className="panel-surface rounded-[34px] p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                Operating standard
              </div>
              <h2 className="font-display mt-3 text-3xl leading-none text-text">
                Designed to show confidence and limits at the same time.
              </h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                The goal is to make strong local data feel usable without pretending the weak parts are stronger than they are.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {trustCards.map((card) => (
                <div key={card.title} className="panel-surface rounded-[30px] p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                    Product principle
                  </div>
                  <div className="mt-3 text-xl font-semibold text-text">{card.title}</div>
                  <div className="mt-2 text-sm leading-7 text-text-secondary">{card.body}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[28px] border border-border/70 bg-white/60 p-5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">{label}</div>
      <div className="mt-3 text-4xl font-semibold tracking-tight text-text">{value}</div>
      <div className="mt-2 text-xs leading-6 text-text-secondary">{detail}</div>
    </div>
  );
}
