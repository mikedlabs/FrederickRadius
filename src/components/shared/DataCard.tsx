import type { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  icon?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DataCard({ title, icon, children, className = '', onClick }: DataCardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-bg-surface p-3 ${onClick ? 'cursor-pointer hover:bg-bg-hover transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="mb-2 flex items-center gap-2">
        {icon && <span className="text-sm">{icon}</span>}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{title}</h3>
      </div>
      {children}
    </div>
  );
}
