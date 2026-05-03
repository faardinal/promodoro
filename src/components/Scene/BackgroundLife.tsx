import { motion } from 'motion/react';

export default function BackgroundLife() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-20">
      {/* Blurred NCP Silhouettes at background tables */}
      <div className="absolute top-[25%] left-[60%] w-12 h-16 bg-stone-900 blur-xl rounded-full animate-pulse" />
      <div className="absolute top-[30%] left-[80%] w-14 h-18 bg-stone-900 blur-xl rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Barista Silhouette behind counter */}
      <motion.div 
        animate={{ x: [-10, 10, -10] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] right-[10%] w-16 h-24 bg-stone-900 blur-2xl rounded-t-full"
      />
      
      {/* Subtle dust particles in air */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
          initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', opacity: 0 }}
          animate={{
            y: ['-10%', '110%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>
  );
}
