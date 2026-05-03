import { memo } from 'react';
import { motion } from 'motion/react';
import { SessionType } from '../../types';
import { SESSION_COLORS } from '../../constants';

interface DigitalClockProps {
  timeLeft: number;
  sessionType: SessionType;
  clockStyle?: string;
  onClick?: () => void;
}

const DigitalClock = memo(function DigitalClock({ timeLeft, sessionType, clockStyle, onClick }: DigitalClockProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div 
      className="absolute top-[10%] md:top-[20%] left-1/2 -translate-x-1/2 md:left-auto md:right-[15%] md:translate-x-0 flex flex-col items-center z-[10]"
      style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
    >
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="p-4 md:p-6 rounded-xl shadow-2xl relative overflow-hidden border-4 transition-all duration-500 cursor-pointer group bg-neutral-900 border-stone-800 hover:border-stone-700 active:border-white/20"
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"
          style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }}
        />
        
        <div className="flex items-center gap-1">
          <div 
            className="text-4xl md:text-6xl font-mono tracking-tighter will-change-transform text-white/95"
            style={{ 
              textShadow: '0 0 15px rgba(255,255,255,0.3)' 
            }}
          >
            {timeString}
          </div>
        </div>
        
        <div 
          className="text-[10px] md:text-xs font-bold text-center mt-1 md:mt-2 uppercase tracking-widest text-stone-300 opacity-80"
        >
          <span>{sessionType.replace('_', ' ')}</span>
        </div>
      </motion.button>
      
      {/* Wall Bracket */}
      <div className="w-1.5 md:w-2 h-10 md:h-16 bg-stone-800 -mt-2 shadow-inner hidden md:block" />
    </div>
  );
});

export default DigitalClock;

