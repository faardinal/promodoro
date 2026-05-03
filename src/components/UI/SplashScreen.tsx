import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hold for 1.8 seconds before starting the exit animation
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1, ease: [0.4, 0, 0.2, 1] } 
          }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-[40px] pointer-events-none"
        >
          {/* Subtle Darkening Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(15px)' }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              filter: 'blur(0px)',
              transition: { 
                duration: 1.4, 
                ease: [0.22, 1, 0.36, 1] // Cinematic focus-pull easing
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.02,
              filter: 'blur(5px)',
              transition: { 
                duration: 0.8, 
                ease: "easeIn" 
              } 
            }}
            className="relative flex flex-col items-center"
          >
            {/* Elegant Minimal Accents */}
            <div className="w-16 h-[0.5px] bg-white/10 mb-8" />

            {/* Logo Text - Minimal Monochrome */}
            <h1 className="text-2xl md:text-3xl font-light tracking-[0.5em] text-white/95 uppercase select-none">
              Prodoro
            </h1>

            <div className="w-16 h-[0.5px] bg-white/10 mt-8" />
            
            {/* Soft Ambient Shadow Overlay */}
            <div className="absolute inset-0 -z-10 blur-3xl bg-white/5 rounded-full scale-150" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
