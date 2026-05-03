import { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CatState } from '../../types';
import { audioService } from '../../services/audioService';

interface CatProps {
  hat?: string;
  state: CatState;
  onInteract: (action: 'meow' | 'pet' | 'idle') => void;
  isActive?: boolean;
  dialogue?: string;
}

const Cat = memo(function Cat({ hat, state, onInteract, isActive, dialogue }: CatProps) {
  if (state === CatState.AWAY) {
    return (
      <motion.div 
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 100, opacity: 0 }}
        className="absolute right-[15%] bottom-[12%] z-20 w-48 h-48 will-change-transform"
      />
    );
  }

  const isSleeping = state === CatState.SLEEPING;
  const isMeowing = state === CatState.MEOW;
  const isPetted = state === CatState.PETTED;
  const isFocus = isActive && !isSleeping;

  const handleMeow = () => {
    if (isSleeping) return;
    audioService.playSFX('meow');
    onInteract('meow');
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (e.buttons === 1 && !isSleeping) {
      onInteract('pet');
      audioService.playSFX('catPurr', 0.5);
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute md:right-[15%] right-[5%] bottom-[11%] md:bottom-[12%] z-20 w-32 h-32 md:w-48 md:h-48 flex items-end justify-center cursor-pointer group will-change-transform"
      onClick={handleMeow}
      onMouseMove={handleDrag}
    >
      <AnimatePresence>
        {dialogue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, y: -10, x: '-50%' }}
            className="absolute -top-12 md:-top-16 left-1/2 z-30 min-w-28 md:min-w-32 max-w-32 md:max-w-40 bg-stone-900/90 backdrop-blur-md border border-stone-800 text-stone-100 p-2 md:p-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-medium text-center shadow-2xl will-change-transform"
          >
            {dialogue}
            {/* Bubble Tail */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 bg-stone-900 rotate-45 border-r border-b border-stone-800" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full h-full flex items-end justify-center scale-75 md:scale-100 origin-bottom">
        {/* Shadow */}
        <div className="absolute bottom-0 w-32 h-8 bg-black/20 blur-xl rounded-full" />

        <motion.div 
          animate={isPetted ? { scaleY: [1, 1.05, 1], x: [0, 0.5, -0.5, 0] } : { scaleY: [1, 1.02, 1] }}
          transition={isPetted ? { duration: 0.1, repeat: Infinity } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-36 h-36 flex flex-col items-center will-change-transform"
          onMouseEnter={() => {/* Ready for pet */}}
        >
          {/* Tail */}
          <motion.div 
            animate={isSleeping ? { rotate: [-5, 5, -5] } : isPetted ? { rotate: [-40, 40, -40] } : { rotate: [-20, 20, -18, -22, -20] }}
            transition={{ 
              duration: isPetted ? 1 : 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: isSleeping || isPetted ? [0, 0.5, 1] : [0, 0.4, 0.5, 0.6, 1]
            }}
            className="absolute bottom-4 right-[-10px] w-8 h-24 bg-[#fdfaf5] border-4 border-[#eee] rounded-full origin-bottom will-change-transform" 
          >
            {/* Tail Tip Flick - Visual detail */}
            <motion.div 
               animate={isSleeping ? { rotate: 0 } : { rotate: [-5, 10, -5] }}
               transition={{ duration: 2, repeat: Infinity, delay: 1 }}
               className="absolute top-0 left-0 w-full h-8 bg-[#eee]/30 rounded-full will-change-transform"
            />
          </motion.div>

          {/* Body */}
          <motion.div 
            animate={isSleeping ? { scaleY: 0.7, scaleX: 1.2 } : { scaleY: 1, scaleX: 1 }}
            className="absolute bottom-0 w-full h-24 bg-[#fdfaf5] rounded-[40px] shadow-sm flex flex-col items-center origin-bottom will-change-transform" 
          >
            <AnimatePresence>
              {isPetted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, y: -20 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-10 text-xl will-change-transform"
                >
                  ✨
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Head */}
          <motion.div 
            animate={isSleeping ? { 
              y: 40, 
              rotate: 15,
            } : { 
              rotate: isMeowing ? [-5, 10, -5] : [-5, 5, -5],
              y: [0, -2, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 w-28 h-24 bg-[#fdfaf5] rounded-full shadow-sm flex flex-col items-center pt-4 will-change-transform"
          >
            {/* Ears */}
            <div className="absolute -top-4 w-full flex justify-between px-2">
              <motion.div 
                animate={{ 
                  rotate: isMeowing ? [-15, -30, -15] : [0, -12, 0, -5, 0],
                  scale: (isFocus && !isSleeping) ? [1, 1.05, 1] : 1
                }}
                transition={{ 
                  duration: isMeowing ? 0.2 : 8, 
                  repeat: Infinity,
                  times: isMeowing ? [0, 0.5, 1] : [0, 0.1, 0.15, 0.2, 1]
                }}
                className="w-10 h-12 bg-[#fdfaf5] rounded-t-full rounded-l-full rotate-[-15deg] origin-bottom shadow-inner will-change-transform" 
              />
              <motion.div 
                animate={{ 
                  rotate: isMeowing ? [15, 30, 15] : [0, 12, 0, 5, 0],
                  scale: (isFocus && !isSleeping) ? [1, 1.05, 1] : 1
                }}
                transition={{ 
                  duration: isMeowing ? 0.2 : 7, 
                  repeat: Infinity,
                  times: isMeowing ? [0, 0.5, 1] : [0, 0.15, 0.2, 0.25, 1],
                  delay: 0.5
                }}
                className="w-10 h-12 bg-[#fdfaf5] rounded-t-full rounded-r-full rotate-[15deg] origin-bottom shadow-inner will-change-transform" 
              />
            </div>

            {/* Face */}
            <div className="flex flex-col items-center mt-4">
              <div className="flex gap-8">
                {/* Eyes */}
                <motion.div 
                  animate={isSleeping || isPetted ? { scaleY: 0.1 } : { scaleY: [1, 1, 0, 1, 1] }}
                  transition={isSleeping || isPetted ? {} : { 
                    duration: 7, 
                    repeat: Infinity, 
                    times: [0, 0.6, 0.65, 0.7, 1] 
                  }}
                  className="w-3 h-3 bg-stone-800 rounded-full will-change-transform" 
                />
                <motion.div 
                  animate={isSleeping || isPetted ? { scaleY: 0.1 } : { scaleY: [1, 1, 0, 1, 1] }}
                  transition={isSleeping || isPetted ? {} : { 
                    duration: 7, 
                    repeat: Infinity, 
                    times: [0, 0.6, 0.65, 0.7, 1] 
                  }}
                  className="w-3 h-3 bg-stone-800 rounded-full will-change-transform" 
                />
              </div>
              
              {/* Nose */}
              <div className="w-2 h-1 bg-pink-200 rounded-full mt-2" />
              
              {/* Mouth */}
              <motion.div 
                animate={isMeowing ? { scaleY: 2, scaleX: 1.5, y: 2 } : { scaleY: 1, scaleX: 1 }}
                className="w-2 h-1 border-b-2 border-stone-300 rounded-full mt-1 will-change-transform"
              />
              
              {/* Whiskers */}
              <div className="relative mt-2 w-full h-4">
                <div className="absolute left-[-10px] w-8 h-[1px] bg-stone-300 rotate-6" />
                <div className="absolute left-[-10px] top-2 w-8 h-[1px] bg-stone-300" />
                <div className="absolute right-[-10px] w-8 h-[1px] bg-stone-300 -rotate-6" />
                <div className="absolute right-[-10px] top-2 w-8 h-[1px] bg-stone-300" />
              </div>
            </div>

            {/* Accessory/Hat */}
            {hat === 'red_bow' && (
              <div className="absolute top-0 text-3xl">🎀</div>
            )}
            {hat === 'wizard_hat' && (
              <div className="absolute -top-12 text-5xl">🧙</div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
});

export default Cat;

