import { motion, AnimatePresence } from 'motion/react';
import { TimeOfDay, Weather } from '../../types';
import ImmersionLayer from './ImmersionLayer';
import { useState, useEffect, memo, useMemo } from 'react';

interface RoomProps {
  environment: {
    timeOfDay: TimeOfDay;
    weather: Weather;
  };
  clockStyle?: string;
}

const BirdSystem = memo(function BirdSystem() {
  const [birds, setBirds] = useState<{ id: number, delay: number, y: number, duration: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const id = Date.now();
        const newBird = {
          id,
          delay: 0,
          y: 20 + Math.random() * 60,
          duration: 6 + Math.random() * 4
        };
        setBirds(prev => [...prev, newBird]);
        const timeout = setTimeout(() => {
          setBirds(prev => prev.filter(b => b.id !== id));
        }, (newBird.duration + 2) * 1000);
        return () => clearTimeout(timeout);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {birds.map(bird => (
          <motion.div
            key={bird.id}
            initial={{ left: '-10%', top: `${bird.y}%`, opacity: 0 }}
            animate={{ left: '110%', opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: bird.duration, ease: "linear" }}
            className="absolute z-0 will-change-transform"
          >
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-stone-800/60 opacity-60">
              <path d="M0 4C3 0 6 4 6 4C6 4 9 0 12 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

const Bookshelves = memo(function Bookshelves() {
  return (
    <div className="absolute top-0 left-0 w-full h-[60%] flex gap-2 md:gap-4 p-4 md:p-8 pointer-events-none opacity-40">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex-1 flex flex-col gap-2">
          {[...Array(4)].map((_, j) => (
            <div key={j} className="h-24 w-full bg-[#1e140d] border-b-4 border-[#3d2b1f] relative flex items-end px-1 gap-[1px]">
              {[...Array(12)].map((_, k) => (
                <div 
                  key={k} 
                  className="flex-1 h-[70%]" 
                  style={{ 
                    backgroundColor: ['#5c4033', '#4a3728', '#3d2b1f', '#2d1e16'][Math.floor(Math.random() * 4)],
                    height: `${40 + Math.random() * 50}%`
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

const NightSky = memo(({ timeOfDay }: { timeOfDay: TimeOfDay }) => {
  const stars = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 60}%`,
      left: `${Math.random() * 100}%`,
      opacity: 0.2 + Math.random() * 0.5,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none"
    >
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute w-1 h-1 bg-white rounded-full will-change-transform"
          initial={{ 
            top: star.top, 
            left: star.left,
            opacity: star.opacity
          }}
          animate={{ 
            opacity: [star.opacity, 0.8, star.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay
          }}
        />
      ))}

      <motion.div
        initial={{ top: '80%', left: '10%', opacity: 0 }}
        animate={{ 
          top: timeOfDay === TimeOfDay.MIDNIGHT ? '20%' : '40%', 
          left: timeOfDay === TimeOfDay.MIDNIGHT ? '70%' : '20%',
          opacity: 1 
        }}
        transition={{ duration: 10, ease: "easeInOut" }}
        className="absolute w-12 h-12 rounded-full bg-[#f4f4f4] shadow-[0_0_30px_rgba(255,255,255,0.3)] will-change-transform"
      >
        <div className="absolute top-2 left-3 w-3 h-3 bg-stone-200/50 rounded-full" />
        <div className="absolute bottom-3 right-2 w-2 h-2 bg-stone-200/50 rounded-full" />
      </motion.div>
    </motion.div>
  );
});

const RainEffect = memo(() => {
  const rainDrops = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: 0.3 + Math.random() * 0.3,
      delay: Math.random() * 2
    }));
  }, []);

  const droplets = useMemo(() => {
    return [...Array(6)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 10
    }));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none"
    >
      {rainDrops.map((drop) => (
        <motion.div
          key={`rain-${drop.id}`}
          className="absolute w-[1px] h-8 bg-blue-100/30 will-change-transform"
          initial={{ top: -40, left: drop.left, opacity: 0 }}
          animate={{ top: '120%', opacity: [0, 0.7, 0] }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear"
          }}
        />
      ))}

      {droplets.map((drop) => (
        <motion.div
          key={`droplet-${drop.id}`}
          className="absolute w-1.5 h-1.5 bg-blue-200/40 rounded-full blur-[1px] will-change-transform"
          initial={{ top: drop.top, left: drop.left, opacity: 0 }}
          animate={{ 
            top: '100%',
            opacity: [0, 0.6, 0.6, 0]
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "easeIn"
          }}
        />
      ))}
    </motion.div>
  );
});

const SnowEffect = memo(() => {
  const snowflakes = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none"
    >
      {snowflakes.map((flake) => (
        <motion.div
          key={`snow-${flake.id}`}
          className="absolute w-2 h-2 bg-white/60 blur-sm rounded-full will-change-transform"
          initial={{ top: -40, left: flake.left, opacity: 0 }}
          animate={{ 
            top: '120%', 
            left: `${(Math.random() * 10) + parseFloat(flake.left)}%`,
            opacity: [0, 1, 0] 
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear"
          }}
        />
      ))}
    </motion.div>
  );
});

const DustParticles = memo(({ timeOfDay }: { timeOfDay: TimeOfDay }) => {
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100 + '%',
      y: Math.random() * 100 + '%',
      duration: 8 + Math.random() * 12
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full blur-[1px] will-change-transform"
          animate={{ 
            backgroundColor: timeOfDay === TimeOfDay.MORNING ? 'rgba(253, 224, 71, 0.4)' : 
                            timeOfDay === TimeOfDay.SUNSET ? 'rgba(251, 146, 60, 0.3)' :
                            'rgba(255, 255, 255, 0.2)',
            y: [null, '-=30', '+=10'],
            x: [null, '+=15', '-=5'],
            opacity: [0, 0.6, 0] 
          }}
          transition={{
            backgroundColor: { duration: 4 },
            y: { duration: p.duration, repeat: Infinity, ease: "easeInOut" },
            x: { duration: p.duration, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: p.duration, repeat: Infinity, ease: "easeInOut" }
          }}
          initial={{ 
            x: p.x, 
            y: p.y,
            opacity: 0 
          }}
        />
      ))}
    </div>
  );
});

export default function Room({ environment, clockStyle }: RoomProps) {
  const [thunderFlash, setThunderFlash] = useState(false);

  useEffect(() => {
    if (environment.weather === Weather.RAIN || environment.weather === Weather.THUNDER) {
      const triggerThunder = () => {
        if (Math.random() < 0.1) {
          setThunderFlash(true);
          const timeout = setTimeout(() => setThunderFlash(false), 150);
          return () => clearTimeout(timeout);
        }
      };
      const interval = setInterval(triggerThunder, 10000);
      return () => clearInterval(interval);
    }
  }, [environment.weather]);

  return (
    <div className="absolute inset-0 bg-[#1a1a1a] overflow-hidden -z-10">
      <div className="absolute inset-0 bg-[#2d3a2d] opacity-90" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />

      <Bookshelves />

      <div className="absolute top-[10%] left-[5%] w-[25%] h-[40%] bg-[#0a0a0a] border-8 border-[#3d2b1f] shadow-inner overflow-hidden rounded-sm">
        <motion.div 
          animate={{ 
            background: environment.timeOfDay === TimeOfDay.MORNING ? 'linear-gradient(to bottom, #87ceeb, #e0f6ff)' :
                        environment.timeOfDay === TimeOfDay.AFTERNOON ? 'linear-gradient(to bottom, #4682b4, #87ceeb)' :
                        environment.timeOfDay === TimeOfDay.SUNSET ? 'linear-gradient(to bottom, #ff4500, #ff8c00)' :
                        'linear-gradient(to bottom, #050a14, #0a0f1a)'
          }}
          transition={{ duration: 4 }}
          className="absolute inset-0" 
        />

        <AnimatePresence>
          {(environment.timeOfDay === TimeOfDay.MORNING || environment.timeOfDay === TimeOfDay.AFTERNOON) && (
            <BirdSystem />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(environment.timeOfDay === TimeOfDay.NIGHT || environment.timeOfDay === TimeOfDay.MIDNIGHT) && (
            <NightSky timeOfDay={environment.timeOfDay} />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {(environment.weather === Weather.RAIN || environment.weather === Weather.THUNDER) && (
            <RainEffect />
          )}

          {environment.weather === Weather.SNOW && (
            <SnowEffect />
          )}
        </AnimatePresence>

        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], x: [-10, 10, -10] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12"
        />

        <div className="absolute left-1/2 top-0 w-2 h-full bg-[#3d2b1f]/80" />
        <div className="absolute left-0 top-1/2 h-2 w-full bg-[#3d2b1f]/80" />
      </div>

      <AnimatePresence>
        {clockStyle === 'grand_clock' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-[12%] right-[28%] w-28 h-28 z-10 flex items-center justify-center pointer-events-none will-change-transform"
          >
            <div className="absolute inset-0 rounded-full border-[6px] border-[#5c4033] bg-[#3d2b1f] shadow-2xl" />
            <div className="absolute inset-1 rounded-full border-2 border-yellow-600/50" />
            
            <div className="absolute inset-4 rounded-full bg-[#fdfaf1] shadow-inner flex items-center justify-center overflow-hidden">
               {[...Array(12)].map((_, i) => (
                 <div 
                   key={i} 
                   className="absolute h-full w-[1px] bg-stone-900/10" 
                   style={{ rotate: `${i * 30}deg` }}
                 />
               ))}
               
               <div className="absolute top-1 text-[8px] font-serif text-stone-800 font-bold">XII</div>
               <div className="absolute bottom-1 text-[8px] font-serif text-stone-800 font-bold">VI</div>
               <div className="absolute right-1 text-[8px] font-serif text-stone-800 font-bold">III</div>
               <div className="absolute left-1 text-[8px] font-serif text-stone-800 font-bold">IX</div>

               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 3600, repeat: Infinity, ease: "linear" }}
                 className="absolute w-[2px] h-8 bg-stone-800 origin-bottom rounded-full -mt-8 will-change-transform"
               />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 43200, repeat: Infinity, ease: "linear" }}
                 className="absolute w-[3px] h-6 bg-stone-800 origin-bottom rounded-full -mt-6 will-change-transform"
               />
               
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                 className="absolute w-[1px] h-10 bg-red-800 origin-bottom -mt-10 will-change-transform"
               />
               
               <div className="absolute w-2 h-2 bg-stone-900 rounded-full" />
            </div>

            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-[10%] w-20 h-40 flex flex-col items-center will-change-transform"
      >
        <div className="w-1 h-32 bg-green-900/50" />
        <div className="w-8 h-8 bg-green-800 rounded-full blur-sm -mt-4 opacity-40" />
      </motion.div>

      <ImmersionLayer timeOfDay={environment.timeOfDay} weather={environment.weather} />

      <DustParticles timeOfDay={environment.timeOfDay} />

      <AnimatePresence>
        {thunderFlash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white pointer-events-none z-50 mix-blend-overlay"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

