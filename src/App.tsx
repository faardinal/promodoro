/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useGameStore } from './store/useGameStore';
import Room from './components/Scene/Room';
import Character from './components/Scene/Character';
import Cat from './components/Scene/Cat';
import Table from './components/Scene/Table';
import Mug from './components/Scene/Mug';
import Lamp from './components/Scene/Lamp';
import DigitalClock from './components/Scene/DigitalClock';
import TodoModal from './components/UI/TodoModal';
import GhostEvent from './components/Scene/GhostEvent';
import Controls from './components/UI/Controls';
import Shop from './components/UI/Shop';
import AudioMenu from './components/UI/AudioMenu';
import StatsModal from './components/UI/StatsModal';
import SplashScreen from './components/UI/SplashScreen';
import TimerSettingsModal from './components/UI/TimerSettingsModal';
import { audioService } from './services/audioService';

export default function App() {
  const { 
    gameState, 
    toggleTimer, 
    resetTimer, 
    skipSession, 
    buyItem, 
    equipItem,
    toggleMute,
    setAudioSettings,
    interactWithCat,
    addTask,
    toggleTask,
    deleteTask,
    moveTask,
    setTasks,
    environment,
    cycleTimeOfDay,
    resetToRealTime,
    updateTimerSettings,
    isGhostEventActive
  } = useGameStore();

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
  const [showCompletionPulse, setShowCompletionPulse] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  const handleUserInteraction = useCallback(() => {
    audioService.init();
  }, []);

  const openShop = useCallback(() => setIsShopOpen(true), []);
  const closeShop = useCallback(() => setIsShopOpen(false), []);
  const openAudio = useCallback(() => setIsAudioOpen(true), []);
  const closeAudio = useCallback(() => setIsAudioOpen(false), []);
  const toggleTodo = useCallback(() => setIsTodoOpen(prev => !prev), []);
  const openStats = useCallback(() => setIsStatsOpen(true), []);
  const closeStats = useCallback(() => setIsStatsOpen(false), []);
  const openTimerSettings = useCallback(() => setIsTimerSettingsOpen(true), []);
  const closeTimerSettings = useCallback(() => setIsTimerSettingsOpen(false), []);

  const prevIsActive = useRef(gameState.isActive);
  const prevSessionType = useRef(gameState.sessionType);

  useEffect(() => {
    if (!gameState.isActive && prevIsActive.current && gameState.timeLeft === 0) {
      setShowCompletionPulse(true);
      audioService.playSFX('complete');
      const timeout = setTimeout(() => setShowCompletionPulse(false), 2000);
      return () => clearTimeout(timeout);
    }

    prevIsActive.current = gameState.isActive;
    prevSessionType.current = gameState.sessionType;
  }, [gameState.isActive, gameState.timeLeft, gameState.sessionType]);

  useEffect(() => {
    const settings = gameState.stats.audioSettings;
    if (!settings) return;

    audioService.syncAudio(
      settings.toggles,
      settings.isPlaying,
      settings.musicVolume,
      settings.asmrVolume
    );
  }, [gameState.stats.audioSettings]);

  return (
    <div 
      className="relative w-full h-[100svh] overflow-hidden bg-black font-sans selection:bg-yellow-500/30 touch-none"
      onClick={handleUserInteraction}
      onKeyDown={handleUserInteraction}
    >
      <GhostEvent isActive={isGhostEventActive} />

      <motion.div 
        animate={{ 
          scale: gameState.isActive && gameState.sessionType === 'focus' ? [1.005, 1.015, 1.005] : [1, 1.005, 1],
          y: isGhostEventActive ? [0, 4, -4, 2, -2, 0] : [0, -2, 0],
          x: isGhostEventActive ? [0, -8, 8, -4, 4, 0] : (showCompletionPulse ? [0, -2, 2, -2, 0] : 0),
          rotate: isGhostEventActive ? [0, -0.5, 0.5, 0] : 0,
          filter: isGhostEventActive ? 'saturate(0.5) brightness(0.6) contrast(1.2)' : (showCompletionPulse ? ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] : 'brightness(1)'),
        }}
        transition={{ 
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          y: isGhostEventActive ? { duration: 0.3 } : { duration: 10, repeat: Infinity, ease: "easeInOut" },
          filter: { duration: isGhostEventActive ? 0.2 : 1 },
          x: isGhostEventActive ? { duration: 0.2 } : { duration: 0.1, repeat: 3 },
          rotate: { duration: 0.2 }
        }}
        className="relative w-full h-full flex flex-col items-center justify-center transition-colors duration-1000 will-change-transform origin-center"
      >
        <Room environment={environment} clockStyle={gameState.stats.activeItems.clock_style} />
        <div className="relative w-full h-full max-w-[1200px] flex items-center justify-center scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 transition-transform duration-500 origin-bottom">
          <DigitalClock 
            timeLeft={gameState.timeLeft} 
            sessionType={gameState.sessionType} 
            clockStyle={gameState.stats.activeItems.clock_style}
            onClick={openTimerSettings}
          />
          
          <Table />
          <Lamp isActive={gameState.isActive} timeOfDay={environment.timeOfDay} />
          
          <Character 
            sessionType={gameState.sessionType} 
            isActive={gameState.isActive} 
            glasses={gameState.stats.activeItems.glasses}
          />
          
          <Cat 
            hat={gameState.stats.activeItems.cat_hat} 
            state={gameState.catState}
            onInteract={interactWithCat}
            isActive={gameState.isActive}
            dialogue={gameState.catDialogue}
          />
          
          <Mug skin={gameState.stats.activeItems.mug_skin} isActive={gameState.isActive} />
          
          <AnimatePresence>
            {isTodoOpen && (
              <TodoModal 
                tasks={gameState.tasks} 
                onAddTask={addTask} 
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onMoveTask={moveTask}
                onReorder={setTasks}
                onClose={toggleTodo} 
              />
            )}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] z-50" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-black/40 z-40" />
      </motion.div>

      <div className="fixed top-4 md:top-8 left-4 md:left-8 z-50 flex flex-col gap-2">
        <button 
          onClick={openStats}
          className="flex items-center gap-2 md:gap-3 bg-stone-900/60 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-stone-800 hover:bg-stone-800/80 transition-all active:scale-95 group group-hover:border-stone-700"
        >
          <span className="text-yellow-500 font-bold group-hover:scale-110 transition-transform text-sm md:text-base">🔥 {gameState.stats.dailySessions}</span>
          <span className="text-[9px] md:text-[10px] uppercase text-stone-400 font-bold tracking-widest">Sessions</span>
        </button>
      </div>

      <Controls 
        isActive={gameState.isActive}
        onToggle={toggleTimer}
        onReset={resetTimer}
        onSkip={skipSession}
        onOpenShop={openShop}
        onToggleMute={openAudio}
        onCycleTime={cycleTimeOfDay}
        onToggleTodo={toggleTodo}
        onResetToRealTime={resetToRealTime}
        isManualMode={environment.isManualMode}
        isMuted={!gameState.stats.audioSettings.isPlaying}
        coins={gameState.stats.coins}
      />

      <AnimatePresence>
        {isShopOpen && (
          <Shop 
            stats={gameState.stats}
            onClose={closeShop}
            onBuy={buyItem}
            onEquip={equipItem}
          />
        )}
        {isAudioOpen && (
          <AudioMenu 
            settings={gameState.stats.audioSettings}
            onChange={setAudioSettings}
            onClose={closeAudio}
          />
        )}
        {isStatsOpen && (
          <StatsModal 
            stats={gameState.stats}
            onClose={closeStats}
          />
        )}
        <TimerSettingsModal 
          isOpen={isTimerSettingsOpen}
          onClose={closeTimerSettings}
          settings={gameState.stats.timerSettings}
          onUpdate={updateTimerSettings}
        />
      </AnimatePresence>

      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <style>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: black;
          color: white;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
