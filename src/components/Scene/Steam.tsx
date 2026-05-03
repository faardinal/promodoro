import { memo, useMemo } from 'react';
import { motion } from 'motion/react';

const Steam = memo(function Steam() {
  const clouds = useMemo(() => {
    return [...Array(6)].map((_, i) => ({
      id: i,
      width: 40 + i * 8,
      duration: 7 + i * 0.6,
      delay: i * 0.8
    }));
  }, []);

  const strands = useMemo(() => {
    return [...Array(4)].map((_, i) => ({
      id: i,
      duration: 8 + i * 1.5,
      delay: i * 1.2
    }));
  }, []);

  const sparkles = useMemo(() => {
    return [...Array(4)].map((_, i) => ({
      id: i,
      duration: 5 + i * 0.8,
      delay: i * 0.6
    }));
  }, []);

  return (
    <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-32 h-60 pointer-events-none overflow-visible">
      {/* Base Warm Glow from coffee hot surface */}
      <motion.div 
        animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white/10 blur-2xl rounded-full will-change-transform" 
      />

      {/* Layered semi-transparent cloud steam */}
      {clouds.map((cloud) => (
        <motion.div
          key={`cloud-layer-${cloud.id}`}
          className="absolute bottom-8 left-1/2 bg-white/5 blur-[25px] rounded-full will-change-transform"
          style={{ width: cloud.width, height: cloud.width }}
          initial={{ y: 20, x: '-50%', opacity: 0, scale: 0.5 }}
          animate={{
            y: [-30, -220 - cloud.id * 15],
            x: [
              '-50%', 
              (cloud.id % 2 === 0 ? `-48%` : `-52%`), 
              (cloud.id % 3 === 0 ? `-45%` : `-55%`),
              '-50%'
            ],
            opacity: [0, 0.3 + (cloud.id * 0.02), 0.1, 0],
            scale: [0.5, 2.0 + cloud.id * 0.1, 3.5],
            rotate: cloud.id % 2 === 0 ? [0, 10, 0] : [0, -10, 0]
          }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            delay: cloud.delay,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Thin elegant strands rising */}
      {strands.map((strand) => (
        <motion.div
          key={`strand-${strand.id}`}
          className="absolute bottom-12 left-1/2 w-4 h-24 bg-gradient-to-t from-white/20 to-transparent blur-xl rounded-full origin-bottom will-change-transform"
          initial={{ y: 0, x: '-50%', opacity: 0, scale: 0.8 }}
          animate={{
            y: [-10, -260 - strand.id * 20],
            x: [
              '-50%', 
              strand.id % 2 === 0 ? '-42%' : '-58%', 
              '-50%'
            ],
            opacity: [0, 0.5, 0],
            scale: [0.8, 3.5, 2.0],
            rotate: [0, strand.id % 2 === 0 ? 15 : -15, 0]
          }}
          transition={{
            duration: strand.duration,
            repeat: Infinity,
            delay: strand.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Tiny magical vapor sparkles */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={`vapor-sparkle-${sparkle.id}`}
          className="absolute bottom-16 left-1/2 w-1.5 h-1.5 bg-yellow-50/40 rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(255,255,255,0.3)] will-change-transform"
          animate={{
            y: [-10, -200 - sparkle.id * 30],
            x: ['-50%', (sparkle.id % 2 === 0 ? '-120%' : '20%'), (sparkle.id % 2 === 0 ? '-40%' : '-60%')],
            opacity: [0, 1, 0.3, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            delay: sparkle.delay,
          }}
        />
      ))}
    </div>
  );
});

export default Steam;


