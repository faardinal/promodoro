import { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, SkipForward, ShoppingBag, Volume2, VolumeX, Sun, ListTodo, Clock } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface ControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  onOpenShop: () => void;
  onToggleMute: () => void;
  onCycleTime: () => void;
  onToggleTodo: () => void;
  onResetToRealTime: () => void;
  isManualMode: boolean;
  isMuted: boolean;
  coins: number;
}

const Controls = memo(function Controls({ 
  isActive, 
  onToggle, 
  onReset, 
  onSkip, 
  onOpenShop,
  onToggleMute,
  onCycleTime,
  onToggleTodo,
  onResetToRealTime,
  isManualMode,
  isMuted,
  coins 
}: ControlsProps) {
  const handleClick = (fn: () => void, sfx: string = 'click') => {
    audioService.playSFX(sfx);
    fn();
  };

  return (
    <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-6 z-50 w-[95%] md:w-auto justify-center">
      <div className="flex items-center gap-1.5 md:gap-4">
        <button
          onClick={() => handleClick(onToggleTodo)}
          className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-500 hover:text-white transition-all active:scale-95 shadow-2xl overflow-hidden cursor-pointer flex-shrink-0"
          title="To-Do List"
        >
          <ListTodo size={18} className="md:w-5 md:h-5" />
        </button>

        <div className="relative group flex-shrink-0">
          <button
            onClick={() => handleClick(onCycleTime)}
            className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-stone-900/80 backdrop-blur-md border transition-all active:scale-95 shadow-2xl cursor-pointer ${isManualMode ? 'border-yellow-500/50 text-yellow-500' : 'border-stone-800 text-stone-400 hover:text-white'}`}
            title="Change Time of Day"
          >
            <Sun size={18} className="md:w-5 md:h-5" />
          </button>
          
          <AnimatePresence>
            {isManualMode && (
              <motion.button
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                onClick={() => handleClick(onResetToRealTime)}
                className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-stone-900/90 border border-stone-800 text-[10px] font-bold text-stone-400 hover:text-white rounded-full whitespace-nowrap backdrop-blur-sm flex items-center gap-2 cursor-pointer z-10"
              >
                <Clock size={12} />
                REAL TIME
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800 p-1.5 md:p-2 rounded-xl md:rounded-2xl flex items-center gap-1 md:gap-2 shadow-2xl flex-shrink-0">
        <button
          onClick={() => handleClick(onReset)}
          className="p-3 md:p-4 rounded-lg md:rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all active:scale-95 cursor-pointer"
          title="Reset Session"
        >
          <RotateCcw size={18} className="md:w-5 md:h-5" />
        </button>

        <button
          onClick={() => handleClick(onToggle, 'click')}
          className="p-4 md:p-5 rounded-lg md:rounded-2xl bg-stone-100 text-stone-900 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        >
          {isActive ? <Pause size={24} className="md:w-7 md:h-7" fill="currentColor" /> : <Play size={24} className="md:w-7 md:h-7 ml-0.5 md:ml-1" fill="currentColor" />}
        </button>

        <button
          onClick={() => handleClick(onSkip)}
          className="p-3 md:p-4 rounded-lg md:rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all active:scale-95 cursor-pointer"
          title="Skip Session"
        >
          <SkipForward size={18} className="md:w-5 md:h-5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 md:gap-4">
        <button
          onClick={() => handleClick(onOpenShop)}
          className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-400 hover:text-yellow-400 transition-all hover:border-yellow-900/50 group flex items-center gap-2 md:gap-3 active:scale-95 shadow-2xl cursor-pointer flex-shrink-0"
        >
          <ShoppingBag size={18} className="md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs md:text-sm font-bold text-yellow-500/80">{coins}</span>
        </button>
        
        <button
          onClick={() => handleClick(onToggleMute)}
          className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-400 hover:text-white transition-all active:scale-95 shadow-2xl cursor-pointer flex-shrink-0"
        >
          {isMuted ? <VolumeX size={18} className="md:w-5 md:h-5" /> : <Volume2 size={18} className="md:w-5 md:h-5" />}
        </button>
      </div>
    </div>
  );
});

export default Controls;

