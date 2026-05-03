import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { SHOP_ITEMS } from '../../constants';
import { UserStats } from '../../types';
import { audioService } from '../../services/audioService';

interface ShopProps {
  stats: UserStats;
  onClose: () => void;
  onBuy: (id: string, price: number) => boolean;
  onEquip: (id: string, type: any) => void;
}

export default function Shop({ stats, onClose, onBuy, onEquip }: ShopProps) {
  const handleClick = (fn: () => void) => {
    audioService.playSFX('click');
    fn();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#2d1e16] border-2 border-[#5c4033] w-full max-w-2xl max-h-[90svh] md:max-h-[80vh] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[#5c4033] flex items-center justify-between bg-[#3d2b1f]">
          <h2 className="text-xl md:text-2xl font-bold text-stone-100 tracking-tight">Library Shop</h2>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="bg-black/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-[#5c4033]">
              <span className="text-yellow-500 font-bold text-sm md:text-base">✨ {stats.coins} <span className="text-[10px] uppercase opacity-60 hidden md:inline">coins</span></span>
            </div>
            <button onClick={() => handleClick(onClose)} className="text-stone-400 hover:text-white transition-colors p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 custom-scrollbar">
          {SHOP_ITEMS.map((item) => {
            const isUnlocked = stats.unlockedItems.includes(item.id);
            const isActive = Object.values(stats.activeItems).includes(item.id);

            return (
              <div 
                key={item.id}
                className={`group relative bg-[#1e140d]/50 border-2 p-4 rounded-2xl flex flex-col items-center gap-3 transition-all ${
                  isActive ? 'border-yellow-600 bg-yellow-900/10' : 'border-[#5c4033] hover:border-[#8b5e3c]'
                }`}
              >
                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">{item.image}</div>
                <div className="text-center">
                  <div className="text-sm font-bold text-stone-200">{item.name}</div>
                  <div className="text-[10px] uppercase text-stone-500 tracking-widest">{item.type.replace('_', ' ')}</div>
                </div>

                {!isUnlocked ? (
                  <button
                    onClick={() => handleClick(() => onBuy(item.id, item.price))}
                    disabled={stats.coins < item.price}
                    className={`mt-2 w-full py-2 rounded-xl font-bold text-xs transition-all ${
                      stats.coins >= item.price 
                        ? 'bg-yellow-600 text-stone-100 hover:bg-yellow-500 active:scale-95' 
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {item.price} Coins
                  </button>
                ) : (
                  <button
                    onClick={() => handleClick(() => onEquip(item.id, item.type))}
                    className={`mt-2 w-full py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      isActive 
                        ? 'bg-stone-100 text-stone-900' 
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 active:scale-95'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check size={14} />
                        Active
                      </>
                    ) : 'Equip'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
