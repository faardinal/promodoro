import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Coffee, Battery } from 'lucide-react';
import { SessionType } from '../../types';

interface TimerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    focus: number;
    shortBreak: number;
    longBreak: number;
  };
  onUpdate: (settings: { focus?: number, shortBreak?: number, longBreak?: number }) => void;
}

export default function TimerSettingsModal({ isOpen, onClose, settings, onUpdate }: TimerSettingsModalProps) {
  const formatTime = (seconds: number) => Math.floor(seconds / 60);

  const SettingRow = ({ 
    label, 
    value, 
    icon: Icon, 
    min, 
    max, 
    onChange 
  }: { 
    label: string, 
    value: number, 
    icon: any, 
    min: number, 
    max: number, 
    onChange: (val: number) => void 
  }) => (
    <div className="flex flex-col gap-3 py-4 border-b border-white/5 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5">
            <Icon className="w-4 h-4 text-stone-400" />
          </div>
          <span className="text-sm font-medium text-stone-300">{label}</span>
        </div>
        <span className="text-sm font-mono text-white font-bold">{formatTime(value)} min</span>
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        step={1}
        value={formatTime(value)}
        onChange={(e) => onChange(parseInt(e.target.value) * 60)}
        className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-stone-300 transition-all opacity-80 hover:opacity-100"
      />
      <div className="flex justify-between text-[10px] text-stone-500 font-medium px-1">
        <span>{min}m</span>
        <span>{max}m</span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm"
          >
            <div className="bg-stone-900/90 border border-white/10 rounded-3xl shadow-2xl p-6 overflow-hidden relative">
              {/* Background gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Timer Settings</h2>
                    <p className="text-xs text-stone-400">Customize your productivity flow</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-stone-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <SettingRow 
                    label="Focus duration" 
                    value={settings.focus} 
                    icon={Clock}
                    min={1}
                    max={120}
                    onChange={(val) => onUpdate({ focus: val })}
                  />
                  <SettingRow 
                    label="Short break" 
                    value={settings.shortBreak} 
                    icon={Coffee}
                    min={1}
                    max={30}
                    onChange={(val) => onUpdate({ shortBreak: val })}
                  />
                  <SettingRow 
                    label="Long break" 
                    value={settings.longBreak} 
                    icon={Battery}
                    min={5}
                    max={60}
                    onChange={(val) => onUpdate({ longBreak: val })}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full mt-8 py-3 bg-white hover:bg-stone-200 text-black rounded-2xl font-bold text-sm shadow-lg shadow-white/5 transition-all"
                >
                  Save Settings
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
