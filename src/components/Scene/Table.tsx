import { memo } from 'react';

const Table = memo(function Table() {
  return (
    <div className="absolute bottom-0 w-full h-[35%] overflow-visible z-10">
      <div className="w-full h-full bg-[#3d2b1f] relative shadow-2xl border-t-2 border-[#5c4033]">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
        
        <div className="absolute left-[30%] top-0 w-[40%] h-full bg-gradient-to-b from-yellow-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="absolute bottom-0 w-full h-4 bg-black/30" />
      </div>
      
      <div className="absolute -bottom-20 left-[10%] w-12 h-40 bg-[#2d1e16] shadow-xl" />
      <div className="absolute -bottom-20 right-[10%] w-12 h-40 bg-[#2d1e16] shadow-xl" />
    </div>
  );
});

export default Table;

