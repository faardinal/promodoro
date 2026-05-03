import { motion } from 'motion/react';
import { X, Trophy, Clock, Coffee, Zap, TrendingUp, Calendar, Target } from 'lucide-react';
import { UserStats } from '../../types';

interface StatsModalProps {
  stats: UserStats;
  onClose: () => void;
}

export default function StatsModal({ stats, onClose }: StatsModalProps) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const todaySessions = stats.dailySessions || 0;

  const historyEntries = Object.values(stats.dailyHistory);
  const avgSessions = historyEntries.length > 0 
    ? (historyEntries.reduce((a, b) => a + b, 0) / historyEntries.length).toFixed(1)
    : '0';

  const productivityScore = Math.min(100, Math.round(
    (stats.totalFocusTime / 3600) * 5 + stats.completedSessions * 2 + (stats.streak * 5)
  ));

  const motivationalLines = [
    "You’re building focus momentum.",
    "Consistency looks good on you.",
    "Your future self says thanks.",
    "Progress is a series of tiny wins.",
    "Each session is a block in your empire.",
  ];
  const randomMotto = motivationalLines[Math.floor(Math.random() * motivationalLines.length)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm shadow-2xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-[2rem] overflow-hidden shadow-2xl max-h-[90svh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 md:p-6 border-b border-stone-800 bg-gradient-to-r from-stone-900 via-stone-800/50 to-stone-900 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-stone-100 tracking-tight">Focus Laboratory</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-800 rounded-full transition-colors text-stone-400 hover:text-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Main Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
            <StatCard 
              icon={<Target className="w-4 h-4 text-orange-500" />} 
              label="Total Sessions" 
              value={stats.completedSessions}
              subLabel="Conquered"
            />
            <StatCard 
              icon={<Zap className="w-4 h-4 text-yellow-500" />} 
              label="Current Streak" 
              value={`${stats.streak} Days`}
              subLabel="On fire!"
            />
            <StatCard 
              icon={<Clock className="w-4 h-4 text-blue-500" />} 
              label="Focus Time" 
              value={formatTime(stats.totalFocusTime)}
              subLabel="Deep work"
            />
            <StatCard 
              icon={<Coffee className="w-4 h-4 text-green-500" />} 
              label="Break Time" 
              value={formatTime(stats.totalBreakTime)}
              subLabel="Well deserved"
            />
          </div>

          {/* Detailed Stats */}
          <div className="space-y-4">
            <div className="bg-stone-800/40 border border-stone-700/50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-stone-400" />
                <div>
                  <p className="text-[10px] uppercase text-stone-500 font-bold tracking-widest">Today's Sessions</p>
                  <p className="text-lg font-bold text-stone-200">{todaySessions} sessions</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-6 rounded-full ${i < todaySessions ? 'bg-orange-500' : 'bg-stone-700'}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-800/40 border border-stone-700/50 p-4 rounded-2xl">
                <Trophy className="w-5 h-5 text-yellow-500 mb-2" />
                <p className="text-[10px] uppercase text-stone-500 font-bold tracking-widest">Best Focus Day</p>
                <p className="text-lg font-bold text-stone-200">
                  {stats.bestFocusDay?.sessions || 0} <span className="text-xs text-stone-500 font-normal">sessions</span>
                </p>
                <p className="text-[10px] text-stone-500 mt-1">{stats.bestFocusDay?.date || 'No record yet'}</p>
              </div>

              <div className="bg-stone-800/40 border border-stone-700/50 p-4 rounded-2xl">
                <TrendingUp className="w-5 h-5 text-purple-500 mb-2" />
                <p className="text-[10px] uppercase text-stone-500 font-bold tracking-widest">Average Daily</p>
                <p className="text-lg font-bold text-stone-200">
                  {avgSessions} <span className="text-xs text-stone-500 font-normal">sessions</span>
                </p>
                <p className="text-[10px] text-stone-500 mt-1">Consistency is key</p>
              </div>
            </div>

            {/* Productivity Score */}
            <div className="bg-stone-800 p-5 rounded-2xl border border-stone-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">Productivity Score</span>
                </div>
                <span className="text-lg font-black text-yellow-500">{productivityScore}%</span>
              </div>
              <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${productivityScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-3 italic text-center">
                "{randomMotto}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-stone-850/50 border-t border-stone-800 text-center">
          <p className="text-[10px] text-stone-600 font-medium tracking-tight">
            Keep at it! Your focus level is currently <span className="text-yellow-500/80 uppercase font-bold">Resilient</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, subLabel }: { icon: React.ReactNode, label: string, value: string | number, subLabel: string }) {
  return (
    <div className="bg-stone-800/40 border border-stone-700/50 p-3 md:p-4 rounded-2xl hover:bg-stone-800 transition-colors group">
      <div className="flex items-center gap-2 mb-1 md:mb-2">
        {icon}
        <span className="text-[9px] md:text-[10px] uppercase text-stone-500 font-bold tracking-widest leading-tight">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-xl md:text-2xl font-bold text-stone-100 group-hover:scale-105 transition-transform origin-left">{value}</p>
      </div>
      <p className="text-[9px] md:text-[10px] text-stone-500 mt-0.5 md:mt-1 font-medium italic">{subLabel}</p>
    </div>
  );
}
