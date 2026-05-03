import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef } from 'react';

interface GhostEventProps {
  isActive: boolean;
}

export default function GhostEvent({ isActive }: GhostEventProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isActive) {
      // Play ghost whisper sound
      // Using a synthesized whoosh if possible, but for now we'll just handle the visual
      // For audio, I'll use a public accessible placeholder or just mock the trigger
      if (audioRef.current) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isActive]);

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <>
            {/* Global Flash/Dimming */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.4, 0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, times: [0, 0.1, 0.4, 0.8, 1] }}
              className="fixed inset-0 bg-[#0a0f1a] z-[100] pointer-events-none mix-blend-multiply"
            />

            {/* Cold Tone Shift */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5 }}
              className="fixed inset-0 bg-blue-900/20 z-[101] pointer-events-none mix-blend-color"
            />

            {/* Screen Shake Helper - Applied via class on body or just a transform container */}
            <motion.div
              initial={{ x: 0, y: 0 }}
              animate={{ 
                x: [0, -4, 4, -2, 2, 0],
                y: [0, 2, -2, 1, -1, 0]
              }}
              transition={{ duration: 0.5, repeat: 0 }}
              className="fixed inset-0 pointer-events-none z-[102]"
            />

            {/* The Ghost in the Window */}
            <div className="absolute top-[10%] left-[5%] w-[25%] h-[40%] z-10 pointer-events-none overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 0.7, 0.5, 0.7, 0],
                  y: [40, 10, 0],
                  scale: [0.8, 1, 1.1]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Stylized Ghost Shape */}
                <div className="relative w-40 h-64 bg-blue-100/40 blur-2xl rounded-full">
                  <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-black/60 rounded-full blur-sm" />
                  <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-black/60 rounded-full blur-sm" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-10 h-16 bg-black/30 rounded-full blur-md" />
                </div>
                
                {/* Inner Glow */}
                <div className="absolute w-32 h-56 bg-white/20 blur-3xl rounded-full animate-pulse" />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <audio 
        ref={audioRef} 
        src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" 
        preload="auto"
      />
    </>
  );
}
