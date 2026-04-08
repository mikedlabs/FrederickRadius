import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiscover } from '../../hooks/useDiscover';

export function DiscoverButton() {
  const { discover } = useDiscover();
  const [burst, setBurst] = useState(false);

  function handleClick() {
    discover();
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-success px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
      >
        <motion.span
          animate={burst ? { rotate: [0, 360] } : {}}
          transition={{ duration: 0.5 }}
          className="text-base"
        >
          ✦
        </motion.span>
        Discover
      </motion.button>

      {/* Burst particles */}
      <AnimatePresence>
        {burst && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i / 8) * Math.PI * 2) * 40,
                  y: Math.sin((i / 8) * Math.PI * 2) * 25,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? '#3B82F6' : '#10B981',
                  marginLeft: -3,
                  marginTop: -3,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
