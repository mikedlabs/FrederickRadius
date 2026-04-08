import type { RewardsState } from '../../types';

interface Props {
  rewards: RewardsState;
}

export function RewardsPanel({ rewards }: Props) {
  const earnedCount = rewards.badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-4">
      {/* Points Summary */}
      <div className="rounded-lg bg-gradient-to-br from-accent/20 to-success/10 border border-accent/30 p-4 text-center">
        <div className="text-3xl font-bold text-text">{rewards.points}</div>
        <div className="text-sm text-text-secondary">Total Points</div>
        <div className="mt-1 text-xs text-text-muted">
          {rewards.municipalitiesVisited.length}/12 municipalities explored
        </div>
      </div>

      {/* Badges */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Badges ({earnedCount}/{rewards.badges.length})
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {rewards.badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-lg border p-3 text-center transition-all ${
                badge.earned
                  ? 'border-success/30 bg-success/5'
                  : 'border-border bg-bg-surface opacity-50'
              }`}
            >
              <div className="text-2xl">{badge.icon}</div>
              <div className="mt-1 text-xs font-medium text-text">{badge.name}</div>
              <div className="mt-0.5 text-[10px] text-text-muted">{badge.description}</div>
              {badge.earned && badge.earnedAt && (
                <div className="mt-1 text-[10px] text-success">
                  Earned {new Date(badge.earnedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {rewards.actions.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Recent Activity
          </h4>
          <div className="space-y-1">
            {rewards.actions.slice(0, 10).map((action, i) => (
              <div key={i} className="flex items-center justify-between rounded bg-bg-surface px-3 py-2">
                <span className="text-xs text-text-secondary">{action.description}</span>
                <span className="text-xs font-medium text-success">+{action.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
