import type { Representative } from '../../types';
import { countyRepresentatives, stateRepresentatives, federalRepresentatives } from '../../data/civic';

export function RepresentativesPanel() {
  const groups = [
    { label: 'County Government', reps: countyRepresentatives },
    { label: 'State Legislature', reps: stateRepresentatives },
    { label: 'Federal', reps: federalRepresentatives },
  ];

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {group.label}
          </h4>
          <div className="space-y-1">
            {group.reps.map((rep, i) => (
              <RepCard key={i} rep={rep} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RepCard({ rep }: { rep: Representative }) {
  return (
    <div className="rounded-lg bg-bg-surface p-2.5 border border-border">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium text-text truncate">{rep.name}</div>
          <div className="text-xs text-text-muted">
            {rep.title}
            {rep.district && ` - ${rep.district}`}
            {rep.party && ` (${rep.party})`}
          </div>
        </div>
        {rep.website && (
          <a
            href={rep.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-accent hover:text-accent-hover"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
