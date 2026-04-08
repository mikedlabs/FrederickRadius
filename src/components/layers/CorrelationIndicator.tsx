import { motion, AnimatePresence } from 'framer-motion';
import { useCorrelation } from '../../hooks/useCorrelation';

export function CorrelationIndicator() {
  const message = useCorrelation();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-lg bg-accent/5 border border-accent/20 px-3 py-2.5"
        >
          <div className="flex items-start gap-2">
            <span className="text-xs mt-0.5">🔗</span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-0.5">
                Correlation
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
