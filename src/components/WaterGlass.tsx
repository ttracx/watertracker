'use client';

import { motion } from 'framer-motion';

interface WaterGlassProps {
  fillPercent: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function WaterGlass({ fillPercent, size = 'lg' }: WaterGlassProps) {
  const clampedPercent = Math.min(100, Math.max(0, fillPercent));
  
  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-24 h-32',
    lg: 'w-32 h-44',
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Glass outline */}
      <div className="absolute inset-0 border-4 border-cyan-300 rounded-b-3xl rounded-t-lg bg-white/10 backdrop-blur-sm overflow-hidden">
        {/* Water fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-cyan-300"
          initial={{ height: 0 }}
          animate={{ height: `${clampedPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Wave effect */}
          <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden">
            <motion.div
              className="w-[200%] h-full"
              animate={{ x: [0, '-50%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 25px, rgba(255,255,255,0.3) 25px, rgba(255,255,255,0.3) 50px)',
              }}
            />
          </div>
          {/* Bubbles */}
          {clampedPercent > 10 && (
            <>
              <motion.div
                className="absolute w-2 h-2 bg-white/40 rounded-full left-2"
                animate={{ y: [0, -20], opacity: [1, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <motion.div
                className="absolute w-1.5 h-1.5 bg-white/30 rounded-full right-3 bottom-2"
                animate={{ y: [0, -30], opacity: [1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
              />
            </>
          )}
        </motion.div>
      </div>
      {/* Glass shine */}
      <div className="absolute top-2 left-2 w-1 h-8 bg-white/30 rounded-full" />
    </div>
  );
}
