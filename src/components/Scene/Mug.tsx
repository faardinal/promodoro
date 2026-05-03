import { memo } from 'react';
import { motion } from 'motion/react';
import Steam from './Steam';

const Mug = memo(function Mug({ skin, isActive }: { skin?: string, isActive?: boolean }) {
  return (
    <div className="absolute md:left-[10%] left-[2%] bottom-[10%] md:bottom-[12%] z-20 w-16 h-20 md:w-20 md:h-24 scale-75 md:scale-100 origin-bottom">
      <div className="relative w-full h-full flex flex-col items-center justify-end">
        {/* Soft shadow on table */}
        <div className="absolute bottom-[-5%] w-[120%] h-[15%] bg-black/40 blur-md rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)]" />
        
        {/* Mug Body - Handcrafted Ceramic Style */}
        <motion.div 
          animate={{
            scale: isActive ? [1, 1.01, 1] : 1,
            y: isActive ? [0, -0.5, 0] : 0
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-14 h-18 rounded-b-2xl rounded-t-[5px] shadow-inner border-b-2 border-stone-400/20 will-change-transform"
          style={{
            background: skin === 'blue_mug' 
              ? 'linear-gradient(145deg, #2563eb 0%, #1e3a8a 100%)' 
              : 'linear-gradient(145deg, #fdfcf0 0%, #edeada 100%)'
          }}
        >
          {/* Top Rim and Coffee Surface */}
          <div className="absolute -top-[3px] left-0 w-full h-6 bg-inherit rounded-[50%] flex items-center justify-center border-t border-white/40 shadow-sm z-10">
            <div className="w-[85%] h-[82%] bg-[#2d1e16] rounded-[50%] overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
              {/* Coffee Crema / Foam Layer */}
              <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_70%_30%,#a27b5c_0%,transparent_70%),radial-gradient(circle_at_20%_60%,#8b5e3c_0%,transparent_60%)]" />
              <motion.div 
                animate={{ opacity: [0.2, 0.4, 0.2], rotate: [0, 360] }}
                transition={{ opacity: { duration: 5, repeat: Infinity }, rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
                className="absolute inset-[-50%] bg-[url('https://www.transparenttextures.com/patterns/granite.png')] opacity-10 will-change-transform" 
              />
              {/* Liquid Glossy Reflection */}
              <motion.div 
                animate={{ x: [-15, 15, -15], opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent rotate-45 will-change-transform"
              />
            </div>
            
            {/* Steam rising from liquid */}
            <div className="absolute bottom-2 w-full">
              <Steam />
            </div>
          </div>

          {/* Lamp Lighting Highlights */}
          <motion.div 
            animate={{ opacity: isActive ? 0.8 : 0.4 }}
            className="absolute left-2.5 top-5 w-2 h-10 bg-white/30 rounded-full blur-[1px] mix-blend-overlay will-change-transform" 
          />
          <motion.div 
            animate={{ opacity: isActive ? 0.4 : 0.2 }}
            className="absolute right-2 top-3 w-1 h-6 bg-yellow-100/20 rounded-full blur-[2px] will-change-transform" 
          />
          
          <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
        </motion.div>
        
        <div className="absolute bottom-4 left-[88%] w-4 h-9 border-[5px] border-inherit border-l-0 rounded-r-3xl opacity-90 shadow-sm" 
             style={{ 
               borderColor: skin === 'blue_mug' ? '#1e3a8a' : '#edeada',
             }}
        />
      </div>
    </div>
  );
});

export default Mug;


