import { motion, AnimatePresence } from 'motion/react';
import { Music, Wind, Volume2 } from 'lucide-react';
import { AudioSettings } from '../../types';
import { useEffect } from 'react';

interface AudioMenuProps {
  settings: AudioSettings;
  onChange: (settings: Partial<AudioSettings>) => void;
  onClose: () => void;
}

const LOFI_CONFIG = [
  { key: 'rainLofi', label: 'Rain Lofi' },
  { key: 'jazzCafe', label: 'Jazz Café' },
  { key: 'darkModeLofi', label: 'Dark Mode Lofi' },
  { key: 'fireplaceAmbience', label: 'Fireplace Ambience' }
] as const;

function ASMRButton({ label, enabled, onClick }: { label: string, enabled: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
        enabled 
        ? 'bg-stone-100 text-stone-900 border-stone-100 shadow-[0_4px_12px_rgba(255,255,255,0.1)]' 
        : 'bg-stone-800/30 text-stone-500 border-stone-800 hover:border-stone-700'
      }`}
    >
      {label}
    </button>
  );
}

export default function AudioMenu({ settings, onChange, onClose }: AudioMenuProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-[340px] md:max-w-sm bg-stone-900/90 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-[90svh] flex flex-col"
      >
        <div className="p-4 md:p-5 space-y-5 md:space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Lofi Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-500">
              <Music size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">LoFi Channels</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LOFI_CONFIG.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => onChange({ toggles: { ...settings.toggles, [key]: !settings.toggles[key as keyof typeof settings.toggles] } })}
                  className={`px-3 py-2.5 rounded-xl text-left transition-all text-[11px] md:text-xs font-medium border ${
                    settings.toggles[key as keyof typeof settings.toggles]
                    ? 'bg-stone-100 text-stone-900 border-stone-100 shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                    : 'bg-stone-800/50 text-stone-400 border-stone-700/50 hover:bg-stone-800 hover:text-stone-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ASMR Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-500">
              <Wind size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Ambient ASMR</span>
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              <ASMRButton 
                label="Rain & Storm" 
                enabled={settings.toggles.rain} 
                onClick={() => onChange({ toggles: { ...settings.toggles, rain: !settings.toggles.rain } })} 
              />
              <ASMRButton 
                label="Keyboard Typing" 
                enabled={settings.toggles.keyboardTyping} 
                onClick={() => onChange({ toggles: { ...settings.toggles, keyboardTyping: !settings.toggles.keyboardTyping } })} 
              />
              <ASMRButton 
                label="Barista ASMR" 
                enabled={settings.toggles.barista} 
                onClick={() => onChange({ toggles: { ...settings.toggles, barista: !settings.toggles.barista } })} 
              />
            </div>
          </div>

          {/* Master Volume */}
          <div className="space-y-3 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-500">
                <Volume2 size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Master Volume</span>
              </div>
              <span className="text-[10px] font-mono text-stone-500">{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={settings.musicVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                onChange({ musicVolume: vol, asmrVolume: vol });
              }}
              className="w-full accent-stone-100 h-1 bg-stone-800 rounded-full cursor-pointer appearance-none"
            />
          </div>
        </div>

        {/* Global Mute Toggle */}
        <button 
          onClick={() => onChange({ isPlaying: !settings.isPlaying })}
          className={`w-full py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] transition-all flex-shrink-0 ${
            settings.isPlaying 
            ? 'bg-stone-100/5 text-stone-500 hover:text-stone-300' 
            : 'bg-stone-100 text-stone-900'
          }`}
        >
          {settings.isPlaying ? 'Mute World' : 'Play Ambience'}
        </button>
      </motion.div>
    </div>
  );
}
