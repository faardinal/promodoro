import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { TimeOfDay } from '../../types';

interface LampProps {
  isActive?: boolean;
  timeOfDay: TimeOfDay;
}

const Lamp = memo(function Lamp({ isActive, timeOfDay }: LampProps) {
  const isNight = timeOfDay === TimeOfDay.NIGHT || timeOfDay === TimeOfDay.MIDNIGHT;
  const isSunset = timeOfDay === TimeOfDay.SUNSET;
  
  const intensity = isNight ? 1 : isSunset ? 0.4 : 0;
  const glowOpacity = isActive ? 0.45 : 0.35;

  const dustParticles = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      id: i,
      x: Math.random() * 100 + '%', 
      y: Math.random() * 100 + '%',
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="absolute md:left-[30%] left-[12%] bottom-[22%] md:bottom-[25%] z-30 w-32 h-48 md:w-40 md:h-60 pointer-events-none transition-all duration-[3000ms]">
      <div className="relative w-full h-full scale-75 md:scale-100 origin-bottom">
        {/* Lamp Base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-stone-800 rounded-full shadow-2xl" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-40 bg-stone-700" />
        
        {/* Lamp Head */}
        <div className="absolute bottom-36 left-[-20px] w-48 h-24 bg-stone-800 rounded-t-full shadow-2xl origin-bottom rotate-[-10deg]">
          {/* Bulb Area */}
          <motion.div 
            animate={{ 
              backgroundColor: intensity > 0 ? 'rgba(253, 224, 71, 0.8)' : 'rgba(253, 224, 71, 0.1)',
              boxShadow: intensity > 0 ? '0 0 20px rgba(253, 224, 71, 0.5)' : 'none'
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-full blur-sm" 
          />
        </div>
        
        {/* Light Beam / Glow */}
        <motion.div 
          animate={{ 
            opacity: [intensity * glowOpacity, intensity * (glowOpacity + 0.1), intensity * glowOpacity],
            scale: isActive ? [1, 1.05, 1] : 1
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-24 left-[-150px] w-[500px] h-[600px] pointer-events-none will-change-transform"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, rgba(253, 224, 71, ${0.35 * intensity}) 0%, transparent 65%)`,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
            rotate: '-10deg'
          }}
        />

        {/* Floating Light Dust (Only in beam area) */}
        <div className="absolute top-[100px] left-[-100px] w-[400px] h-[500px] pointer-events-none z-50">
          {dustParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ 
                x: p.x, 
                y: p.y,
                opacity: 0 
              }}
              animate={{ 
                y: [null, '-=40', '+=10'],
                opacity: [0, 0.6 * intensity, 0]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay
              }}
              className="absolute w-1 h-1 bg-yellow-100 rounded-full blur-[0.5px] will-change-transform"
            />
          ))}
        </div>
        
        {/* Large light sources for highlights */}
        <motion.div 
          animate={{ 
            scale: isActive ? [1, 1.2, 1] : 1,
            opacity: intensity * 0.25
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-40 left-20 w-40 h-40 bg-yellow-400/25 rounded-full blur-[70px] will-change-transform" 
        />
      </div>
    </div>
  );
});

export default Lamp;

