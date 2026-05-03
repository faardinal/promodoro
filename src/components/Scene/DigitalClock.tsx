import { memo } from 'react';
import { motion } from 'motion/react';
import { SessionType } from '../../types';
import { SESSION_COLORS } from '../../constants';

interface DigitalClockProps {
  timeLeft: number;
  sessionType: SessionType;
  clockStyle?: string;
}

const DigitalClock = memo(function DigitalClock({ timeLeft, sessionType, clockStyle }: DigitalClockProps) {
  const isNeon = clockStyle === 'neon_clock';
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const color = SESSION_COLORS[sessionType];

  return (
    <div 
      className="absolute top-[10%] md:top-[20%] left-1/2 -translate-x-1/2 md:left-auto md:right-[15%] md:translate-x-0 flex flex-col items-center z-[10]"
      style={{ filter: isNeon ? 'drop-shadow(0 0 15px rgba(0,255,255,0.4))' : 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
    >
      <div className={`p-4 md:p-6 rounded-xl shadow-2xl relative overflow-hidden border-4 transition-all duration-500 ${isNeon ? 'bg-black border-cyan-500/50' : 'bg-neutral-900 border-stone-800'}`}>
        {/* Glow effect */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: isNeon ? `radial-gradient(circle, #06b6d4 0%, transparent 70%)` : `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
        />
        
        <div className="flex items-center gap-1">
          <div 
            className="text-4xl md:text-6xl font-mono tracking-tighter will-change-transform"
            style={{ 
              color: isNeon ? '#06b6d4' : color, 
              textShadow: isNeon ? '0 0 20px #06b6d4, 0 0 40px #06b6d4' : `0 0 15px ${color}` 
            }}
          >
            {timeString}
          </div>
        </div>
        
        <div 
          className="text-[10px] md:text-xs font-bold text-center mt-1 md:mt-2 uppercase tracking-widest"
          style={{ color: isNeon ? '#06b6d4' : color, opacity: 0.8 }}
        >
          {sessionType.replace('_', ' ')}
        </div>
      </div>
      
      {/* Wall Bracket */}
      <div className="w-1.5 md:w-2 h-10 md:h-16 bg-stone-800 -mt-2 shadow-inner hidden md:block" />
    </div>
  );
});

export default DigitalClock;

