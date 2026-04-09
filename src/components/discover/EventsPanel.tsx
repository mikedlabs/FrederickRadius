import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getLocalEvents,
  eventCategoryMeta,
  eventCalendarLinks,
  type EventCategory,
  type LocalEvent,
} from '../../services/api/events';
import { staggerContainer, staggerItem } from '../../lib/motion';

const allCategories = Object.entries(eventCategoryMeta) as [EventCategory, typeof eventCategoryMeta[EventCategory]][];

export function EventsPanel() {
  const [filter, setFilter] = useState<EventCategory | 'all'>('all');
  const events = getLocalEvents();
  const filtered = filter === 'all' ? events : events.filter((e) => e.category === filter);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text">Events & Things to Do</h3>
        <p className="mt-1 text-[10px] text-text-muted">
          Curated Frederick events and venues. Check event websites for current schedules and tickets.
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
            filter === 'all'
              ? 'bg-accent text-white'
              : 'bg-bg-surface border border-border text-text-muted hover:text-text'
          }`}
        >
          All ({events.length})
        </button>
        {allCategories.map(([id, cat]) => {
          const count = events.filter((e) => e.category === id).length;
          if (count === 0) return null;
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filter === id
                  ? 'bg-accent text-white'
                  : 'bg-bg-surface border border-border text-text-muted hover:text-text'
              }`}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Event cards */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
        <AnimatePresence>
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Calendar links */}
      <div className="rounded-xl border border-border bg-bg-surface p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-2">
          More Event Calendars
        </div>
        <div className="space-y-1.5">
          {eventCalendarLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-text-muted hover:text-accent hover:bg-bg-hover transition-colors"
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
              <span className="ml-auto text-[10px]">↗</span>
            </a>
          ))}
        </div>
        <p className="mt-2 text-[9px] text-text-muted">
          These link to external event calendars. Frederick Radius does not control their content or availability.
        </p>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: LocalEvent }) {
  const [expanded, setExpanded] = useState(false);
  const catMeta = eventCategoryMeta[event.category];

  return (
    <motion.div
      variants={staggerItem}
      layout
      className="rounded-xl border border-border bg-bg-surface overflow-hidden"
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full px-3 py-2.5 text-left hover:bg-bg-hover transition-colors">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 text-sm">{catMeta.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-text">{event.title}</div>
            <div className="mt-0.5 flex items-center gap-2 text-[10px] text-text-muted">
              <span>📅 {event.date}</span>
              {event.time && <span>🕐 {event.time}</span>}
            </div>
            <div className="mt-0.5 text-[10px] text-text-muted truncate">📍 {event.venue}</div>
          </div>
          {event.price && (
            <span className="flex-shrink-0 rounded-full bg-success/10 text-success text-[10px] font-medium px-2 py-0.5">
              {event.price}
            </span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="px-3 py-2.5 space-y-2">
              <p className="text-[11px] leading-5 text-text-secondary">{event.description}</p>

              {event.address && (
                <div className="text-[10px] text-text-muted">
                  <span className="font-medium">Address:</span> {event.address}
                </div>
              )}

              <div className="flex items-center gap-2">
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-white hover:bg-accent/80 transition-colors"
                >
                  Visit Website ↗
                </a>
                {event.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-text-muted hover:text-accent transition-colors"
                  >
                    Directions ↗
                  </a>
                )}
              </div>

              <div className="text-[9px] text-text-muted">
                Source: {event.source === 'curated' ? 'Frederick Radius curated listing' : 'Community calendar'}. Verify details on the official website.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
