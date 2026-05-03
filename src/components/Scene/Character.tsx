import { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SessionType } from '../../types';

interface CharacterProps {
  sessionType: SessionType;
  isActive: boolean;
  glasses?: string;
}

const Character = memo(function Character({ sessionType, isActive, glasses }: CharacterProps) {
  const isFocus = sessionType === SessionType.FOCUS && isActive;
  const isShortBreak = sessionType === SessionType.SHORT_BREAK;
  const isLongBreak = sessionType === SessionType.LONG_BREAK;

  return (
    <div className="absolute left-1/2 bottom-[15%] -translate-x-1/2 z-20 w-80 h-96 flex flex-col items-center scale-75 md:scale-100 origin-bottom">
      <div className="relative w-full h-full flex flex-col items-center">
        {/* Shadow */}
        <div className="absolute bottom-[2%] w-48 h-12 bg-black/30 blur-xl rounded-full" />
        
        {/* Body Container */}
        <motion.div 
          animate={{ 
            y: isLongBreak ? [0, 2, 0] : [0, -4, 0],
            rotate: isLongBreak ? 0 : isShortBreak ? [-1, 1, -1] : [-0.3, 0.3, -0.3],
            scaleX: isFocus ? [1, 1.01, 1] : 1
          }}
          transition={{ 
            duration: isLongBreak ? 6 : isShortBreak ? 4 : 5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative w-full h-full flex flex-col items-center will-change-transform"
        >
          {/* Torso/Sweater */}
          <motion.div 
            animate={isShortBreak ? { scaleY: 0.95 } : { scaleY: 1 }}
            className="absolute bottom-[10%] w-40 h-48 bg-stone-700 rounded-t-[60px] rounded-b-lg shadow-xl" 
          />
          
          {/* Arms holding book or stretching */}
          <div className="absolute bottom-[18%] w-56 h-24 flex justify-between px-4 z-10">
            {/* Left Arm */}
            <motion.div 
              animate={isShortBreak ? { rotate: -40, y: -20 } : isFocus ? { rotate: [-5, 0, -5] } : { rotate: 0 }}
              className="w-12 h-24 bg-stone-700 rounded-full origin-top -mt-2 will-change-transform" 
            />
            {/* Right Arm */}
            <motion.div 
              animate={isShortBreak ? { rotate: 40, y: -20 } : isFocus ? { rotate: [5, 0, 5] } : { rotate: 0 }}
              className="w-12 h-24 bg-stone-700 rounded-full origin-top -mt-2 will-change-transform" 
            />
          </div>
          
          {/* Hands and Book */}
          <motion.div 
            animate={isShortBreak || isLongBreak ? { opacity: 0, scale: 0.8, y: 50 } : { opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-[20%] z-20 flex flex-col items-center will-change-transform"
          >
            {/* Book */}
            <motion.div 
              animate={{ 
                rotateX: isFocus ? [0, 8, 0] : [0, 2, 0],
                y: isFocus ? [0, -5, 0] : 0
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-56 h-40 bg-stone-100 rounded-sm shadow-lg flex origin-bottom perspective-1000 will-change-transform"
            >
              <div className="w-1/2 h-full border-r border-stone-300 p-4">
                <div className="w-full h-1 my-1 bg-stone-200" />
                <div className="w-3/4 h-1 my-1 bg-stone-200" />
                <div className="w-full h-1 my-1 bg-stone-200" />
              </div>
              <div className="w-1/2 h-full p-4 relative overflow-hidden">
                <div className="w-full h-1 my-1 bg-stone-200" />
                <div className="w-full h-1 my-1 bg-stone-200" />
                <div className="w-1/2 h-1 my-1 bg-stone-200" />
                
                {/* Page turning animation sometimes */}
                <motion.div 
                  initial={{ rotateY: 0 }}
                  animate={isFocus ? { rotateY: [0, -165, 0] } : {}}
                  transition={{ duration: 1.2, delay: 10, repeat: Infinity, repeatDelay: 15 }}
                  className="absolute inset-0 bg-stone-50 border-l border-stone-200 origin-right shadow-sm will-change-transform"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Head */}
          <motion.div 
            animate={{ 
              rotate: isLongBreak ? 15 : isShortBreak ? [-5, 5, -5] : [-2, 2, -2],
              y: isLongBreak ? 5 : [0, -2, 0] 
            }}
            transition={{ duration: isLongBreak ? 6 : 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] w-28 h-32 bg-[#e0ac69] rounded-full shadow-md overflow-hidden will-change-transform"
          >
            {/* Hair */}
            <div className="absolute top-0 w-full h-1/2 bg-[#2d1e16] rounded-t-full" />
            
            {/* Face Details */}
            <div className="absolute top-[55%] w-full flex justify-center gap-6">
              {/* Eyes */}
              <motion.div 
                animate={{ 
                  scaleY: isLongBreak ? 0.1 : (isFocus ? [1, 1, 0, 1, 1] : [1, 0.1, 1]),
                  x: isFocus ? [0, 2, -2, 0] : 0,
                  y: isFocus ? [0, 1, 0] : 0
                }}
                transition={{ 
                  duration: isFocus ? 8 : 6, 
                  repeat: Infinity, 
                  times: isFocus ? [0, 0.45, 0.5, 0.55, 1] : [0, 0.05, 0.1],
                  x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 15, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-2 h-2 bg-stone-800 rounded-full will-change-transform" 
              />
              <motion.div 
                animate={{ 
                  scaleY: isLongBreak ? 0.1 : (isFocus ? [1, 1, 0, 1, 1] : [1, 0.1, 1]),
                  x: isFocus ? [0, 2, -2, 0] : 0,
                  y: isFocus ? [0, 1, 0] : 0
                }}
                transition={{ 
                  duration: isFocus ? 8 : 6, 
                  repeat: Infinity, 
                  times: isFocus ? [0, 0.45, 0.5, 0.55, 1] : [0, 0.05, 0.1],
                  x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 15, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-2 h-2 bg-stone-800 rounded-full will-change-transform" 
              />
            </div>

            {/* Glasses */}
            <AnimatePresence>
              {glasses === 'scholar_glasses' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-[48%] left-1/2 -translate-x-1/2 w-full flex justify-center items-center gap-4 z-10 pointer-events-none will-change-transform"
                >
                  <div className="w-8 h-8 rounded-full border border-stone-800/80 bg-white/5 backdrop-blur-[0.5px] shadow-[0_0_2px_rgba(255,255,255,0.2)]" />
                  <div className="w-4 h-[1px] bg-stone-800/80 -mt-1" />
                  <div className="w-8 h-8 rounded-full border border-stone-800/80 bg-white/5 backdrop-blur-[0.5px] shadow-[0_0_2px_rgba(255,255,255,0.2)]" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mouth */}
            <motion.div 
              animate={isShortBreak ? { scale: 1.2, y: 2 } : { scale: 1 }}
              className="absolute bottom-[20%] left-1/2 -translateX-1/2 w-4 h-[1px] bg-stone-800/20 will-change-transform" 
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
});

export default Character;

