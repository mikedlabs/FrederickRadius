import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemePreference } from '../../hooks/useTheme';

const OPTIONS: Array<{ value: ThemePreference; label: string; Icon: typeof Sun }> = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'dark', label: 'Dark', Icon: Moon },
];

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={`inline-flex items-center rounded-full border border-border bg-bg-elevated p-0.5 shadow-[var(--shadow-surface-1)] ${className}`}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setPreference(value)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              active
                ? 'bg-accent text-white'
                : 'text-text-muted hover:bg-bg-hover hover:text-text'
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
