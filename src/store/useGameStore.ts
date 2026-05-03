import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, SessionType, UserStats, CatState, AudioSettings, TimeOfDay, Weather, TodoTask } from '../types';
import { FOCUS_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME } from '../constants';
import { catDialogueService, DialogueCategory } from '../services/catDialogueService';

const INITIAL_AUDIO: AudioSettings = {
  musicVolume: 0.5,
  asmrVolume: 0.3,
  isPlaying: true, // Renamed from isActive for clarity, master play/pause
  toggles: {
    // Music
    rainLofi: false,
    jazzCafe: false,
    darkModeLofi: false,
    fireplaceAmbience: false,
    // ASMR
    rain: false,
    keyboardTyping: false,
    barista: false,
  },
};

const INITIAL_STATS: UserStats = {
  coins: 0,
  streak: 0,
  completedSessions: 0,
  dailySessions: 0,
  totalFocusTime: 0,
  totalBreakTime: 0,
  dailyHistory: {},
  unlockedItems: ['rainy_night'],
  isMuted: false,
  audioSettings: INITIAL_AUDIO,
  activeItems: {
    background: 'rainy_night',
  },
};

const SAVE_KEY = 'pomodoroCafeSave';

export function useGameStore() {
  const [environment, setEnvironment] = useState({
    timeOfDay: TimeOfDay.AFTERNOON,
    weather: Weather.RAIN,
    isManualMode: false,
  });

  const updateEnvironment = useCallback(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    setGameState(prev => {
      if (prev.stats.lastActiveDate && prev.stats.lastActiveDate !== today) {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            dailySessions: 0,
            lastActiveDate: today
          }
        };
      }
      return prev;
    });

    setEnvironment(prev => {
      if (prev.isManualMode) return prev;

      const hour = now.getHours();
      let timeOfDay = TimeOfDay.AFTERNOON;

      if (hour >= 5 && hour < 11) timeOfDay = TimeOfDay.MORNING;
      else if (hour >= 11 && hour < 17) timeOfDay = TimeOfDay.AFTERNOON;
      else if (hour >= 17 && hour < 19) timeOfDay = TimeOfDay.SUNSET;
      else if (hour >= 19 && hour < 24) timeOfDay = TimeOfDay.NIGHT;
      else timeOfDay = TimeOfDay.MIDNIGHT;

      if (prev.timeOfDay === timeOfDay) return prev;
      return { ...prev, timeOfDay };
    });
  }, []);

  useEffect(() => {
    updateEnvironment();
    const interval = setInterval(updateEnvironment, 60000);
    return () => clearInterval(interval);
  }, [updateEnvironment]);

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    const defaults = {
      timeLeft: FOCUS_TIME,
      isActive: false,
      sessionType: SessionType.FOCUS,
      sessionCount: 0,
      catState: CatState.IDLE,
      stats: INITIAL_STATS,
      tasks: [],
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        const today = new Date().toISOString().split('T')[0];
        let restored = { ...defaults, ...parsed };

        // Handle daily reset
        if (restored.stats.lastActiveDate !== today) {
          restored.stats = {
            ...restored.stats,
            dailySessions: 0
          };
        }

        // Timer Recovery Logic
        if (restored.isActive && restored.lastUpdate) {
          const elapsed = Math.floor((now - restored.lastUpdate) / 1000);
          if (elapsed > 0) {
            if (elapsed < restored.timeLeft) {
              restored.timeLeft -= elapsed;
            } else {
              // Session finished while offline
              restored.timeLeft = 0;
              // We'll let the timer loop handle completion to avoid complex state updates during init
            }
          }
        }
        
        // Ensure nested objects are merged correctly
        const currentToggles = { ...INITIAL_AUDIO.toggles };
        const savedAudio = parsed.stats?.audioSettings || {};
        const savedToggles = savedAudio.toggles || {};
        
        // Merge saved values for keys that still exist (ASMR)
        Object.keys(currentToggles).forEach(key => {
          const k = key as keyof typeof currentToggles;
          if (savedToggles[k] !== undefined) {
            currentToggles[k] = savedToggles[k];
          }
        });

        // Migration logic for old structure
        if (savedAudio.activeTrack && savedAudio.isPlaying) {
          const keyMap: Record<string, keyof typeof currentToggles> = {
            'Rain Lofi': 'rainLofi',
            'Jazz Café': 'jazzCafe',
            'Dark Mode Lofi': 'darkModeLofi',
            'Fireplace Ambience': 'fireplaceAmbience'
          };
          const mappedKey = keyMap[savedAudio.activeTrack];
          if (mappedKey) {
            currentToggles[mappedKey] = true;
          }
        }

        restored.stats = {
          ...INITIAL_STATS,
          ...parsed.stats,
          audioSettings: {
            ...INITIAL_AUDIO,
            ...savedAudio,
            toggles: currentToggles,
            isPlaying: savedAudio.isPlaying !== undefined ? savedAudio.isPlaying : true
          },
          activeItems: {
            ...INITIAL_STATS.activeItems,
            ...(parsed.stats?.activeItems || {}),
          }
        };

        return restored;
      } catch (e) {
        console.error('Failed to parse save data', e);
      }
    }
    return defaults;
  });

  // Centralized Save Function
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const saveGame = useCallback((state: GameState, immediate = false) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    const performSave = () => {
      const dataToSave = {
        ...state,
        lastUpdate: Date.now(),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
    };

    if (immediate) {
      performSave();
    } else {
      saveTimeoutRef.current = setTimeout(performSave, 5000); // Debounce saves to every 5s
    }
  }, []);

  // Auto-save effect for critical state changes (debounced)
  useEffect(() => {
    saveGame(gameState);
  }, [
    gameState.isActive, 
    gameState.sessionType, 
    gameState.stats.coins, 
    gameState.stats.activeItems,
    gameState.stats.unlockedItems,
    gameState.tasks,
    saveGame
  ]);

  // Periodic save and visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveGame(gameState, true); // Immediate save when hiding
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', () => saveGame(gameState, true));

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameState, saveGame]);

  const catReturnTimer = useRef<NodeJS.Timeout | null>(null);
  const catInteractionTimer = useRef<NodeJS.Timeout | null>(null);
  const dialogueTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerDialogue = useCallback((category: DialogueCategory, duration = 5000) => {
    const line = catDialogueService.getRandomLine(category);
    setGameState(prev => ({ ...prev, catDialogue: line }));

    if (dialogueTimer.current) clearTimeout(dialogueTimer.current);
    dialogueTimer.current = setTimeout(() => {
      setGameState(prev => ({ ...prev, catDialogue: undefined }));
      dialogueTimer.current = null;
    }, duration);
  }, []);

  // Welcome back dialogue
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerDialogue(DialogueCategory.WELCOME_BACK);
    }, 2000);
    return () => clearTimeout(timer);
  }, [triggerDialogue]);

  // Idle dialogue system
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.catState === CatState.IDLE && !gameState.catDialogue && Math.random() < 0.15) {
        triggerDialogue(DialogueCategory.IDLE);
      }
    }, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [gameState.catState, gameState.catDialogue, triggerDialogue]);

  // Sync session type with cat state
  useEffect(() => {
    setGameState(prev => {
      const newCatState = prev.sessionType === SessionType.LONG_BREAK 
        ? CatState.SLEEPING 
        : (prev.catState === CatState.SLEEPING ? CatState.IDLE : prev.catState);
      
      if (newCatState === prev.catState) return prev;
      return { ...prev, catState: newCatState };
    });
  }, [gameState.sessionType]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.catState === CatState.IDLE && Math.random() < 0.05) {
        setGameState(prev => ({ ...prev, catState: CatState.AWAY }));
        if (catReturnTimer.current) clearTimeout(catReturnTimer.current);
        catReturnTimer.current = setTimeout(() => {
          setGameState(prev => ({ ...prev, catState: CatState.IDLE }));
          catReturnTimer.current = null;
        }, 10000 + Math.random() * 20000);
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(interval);
      if (catReturnTimer.current) clearTimeout(catReturnTimer.current);
    };
  }, [gameState.catState]);

  const getNextSessionState = (prev: GameState) => {
    let nextType = SessionType.FOCUS;
    let nextTime = FOCUS_TIME;
    let coinsEarned = 0;
    let nextSessionCount = prev.sessionCount;
    let newStats = { ...prev.stats };

    if (prev.sessionType === SessionType.FOCUS) {
      nextSessionCount += 1;
      coinsEarned = 25;
      
      const today = new Date().toISOString().split('T')[0];
      const currentDaySessions = (newStats.dailyHistory[today] || 0) + 1;
      
      newStats.dailyHistory = {
        ...newStats.dailyHistory,
        [today]: currentDaySessions
      };
      
      newStats.completedSessions += 1;
      newStats.dailySessions = (newStats.dailySessions || 0) + 1;
      newStats.coins += coinsEarned;

      // Update best focus day
      if (!newStats.bestFocusDay || currentDaySessions > newStats.bestFocusDay.sessions) {
        newStats.bestFocusDay = {
          date: today,
          sessions: currentDaySessions
        };
      }

      // Streak logic
      const lastDate = newStats.lastActiveDate;
      if (!lastDate) {
        newStats.streak = 1;
      } else if (lastDate !== today) {
        const last = new Date(lastDate);
        const current = new Date(today);
        const diffTime = Math.abs(current.getTime() - last.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStats.streak += 1;
        } else if (diffDays > 1) {
          newStats.streak = 1;
        }
      }
      newStats.lastActiveDate = today;

      if (nextSessionCount % 4 === 0) {
        nextType = SessionType.LONG_BREAK;
        nextTime = LONG_BREAK_TIME;
      } else {
        nextType = SessionType.SHORT_BREAK;
        nextTime = SHORT_BREAK_TIME;
      }
    } else {
      nextType = SessionType.FOCUS;
      nextTime = FOCUS_TIME;
    }

    return {
      timeLeft: nextTime,
      isActive: false,
      sessionType: nextType,
      sessionCount: nextSessionCount,
      stats: newStats
    };
  };

  useEffect(() => {
    if (!gameState.isActive) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        const isFocus = prev.sessionType === SessionType.FOCUS;
        
        if (prev.timeLeft > 1) {
          return { 
            ...prev, 
            timeLeft: prev.timeLeft - 1,
            stats: {
              ...prev.stats,
              totalFocusTime: isFocus ? prev.stats.totalFocusTime + 1 : prev.stats.totalFocusTime,
              totalBreakTime: !isFocus ? prev.stats.totalBreakTime + 1 : prev.stats.totalBreakTime,
            }
          };
        } else {
          // Trigger dialogue on completion
          setTimeout(() => triggerDialogue(DialogueCategory.COMPLETE_SESSION), 100);
          return { ...prev, ...getNextSessionState(prev) };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.isActive, triggerDialogue]);

  const toggleTimer = useCallback(() => setGameState(prev => ({ ...prev, isActive: !prev.isActive })), []);
  
  const [isGhostEventActive, setIsGhostEventActive] = useState(false);
  const ghostTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerGhostEvent = useCallback(() => {
    setIsGhostEventActive(true);
    if (ghostTimeoutRef.current) clearTimeout(ghostTimeoutRef.current);
    ghostTimeoutRef.current = setTimeout(() => {
      setIsGhostEventActive(false);
      ghostTimeoutRef.current = null;
    }, 2500);
  }, []);

  const resetTimer = useCallback(() => {
    setGameState(prev => {
      // Trigger ghost event if cancelling an active focus session
      if (prev.isActive && prev.sessionType === SessionType.FOCUS) {
        triggerGhostEvent();
      }

      let time = FOCUS_TIME;
      if (prev.sessionType === SessionType.SHORT_BREAK) time = SHORT_BREAK_TIME;
      if (prev.sessionType === SessionType.LONG_BREAK) time = LONG_BREAK_TIME;
      return { ...prev, timeLeft: time, isActive: false };
    });
  }, [triggerGhostEvent]);

  const skipSession = useCallback(() => {
    setGameState(prev => {
      if (prev.sessionType === SessionType.FOCUS) {
        triggerGhostEvent();
      }
      return { ...prev, ...getNextSessionState(prev) };
    });
    triggerDialogue(DialogueCategory.SKIP_SESSION);
  }, [triggerGhostEvent, triggerDialogue]);

  const buyItem = (itemId: string, price: number) => {
    if (gameState.stats.coins >= price) {
      setGameState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          coins: prev.stats.coins - price,
          unlockedItems: [...prev.stats.unlockedItems, itemId],
        }
      }));
      return true;
    }
    return false;
  };

  const equipItem = (itemId: string, type: keyof UserStats['activeItems']) => {
    setGameState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        activeItems: {
          ...prev.stats.activeItems,
          [type]: itemId,
        }
      }
    }));
  };

  const setAudioSettings = (settings: Partial<AudioSettings>) => {
    setGameState(prev => {
      const newSettings = { ...prev.stats.audioSettings, ...settings };
      
      // Trigger dialogue if audio just started (any toggle became true while master playing)
      const anyNewToggle = settings.toggles && Object.entries(settings.toggles).some(([k, v]) => v === true && !prev.stats.audioSettings.toggles[k as keyof typeof prev.stats.audioSettings.toggles]);
      
      if (anyNewToggle || (settings.isPlaying === true && !prev.stats.audioSettings.isPlaying)) {
        setTimeout(() => triggerDialogue(DialogueCategory.AUDIO_START), 500);
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          audioSettings: newSettings
        }
      };
    });
  };

  const interactWithCat = (action: 'meow' | 'pet' | 'idle') => {
    if (gameState.catState === CatState.AWAY || gameState.catState === CatState.SLEEPING) return;
    
    let newState = CatState.IDLE;
    if (action === 'meow') newState = CatState.MEOW;
    if (action === 'pet') {
      newState = CatState.PETTED;
      triggerDialogue(DialogueCategory.PETTED, 3000);
    }

    setGameState(prev => ({ ...prev, catState: newState }));
    
    if (action !== 'idle') {
      if (catInteractionTimer.current) clearTimeout(catInteractionTimer.current);
      catInteractionTimer.current = setTimeout(() => {
        setGameState(prev => ({ ...prev, catState: CatState.IDLE }));
        catInteractionTimer.current = null;
      }, action === 'meow' ? 2000 : 5000);
    }
  };

  const addTask = (text: string) => {
    setGameState(prev => ({
      ...prev,
      tasks: [{ id: crypto.randomUUID(), text, completed: false }, ...prev.tasks]
    }));
  };

  const toggleTask = (id: string) => {
    setGameState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setGameState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const moveTask = (fromIndex: number, toIndex: number) => {
    setGameState(prev => {
      const newTasks = [...prev.tasks];
      const [movedTask] = newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, movedTask);
      return { ...prev, tasks: newTasks };
    });
  };

  const setTasks = (tasks: TodoTask[]) => {
    setGameState(prev => ({ ...prev, tasks }));
  };

  const cycleTimeOfDay = () => {
    setEnvironment(prev => {
      const times = Object.values(TimeOfDay);
      const currentIndex = times.indexOf(prev.timeOfDay);
      const nextIndex = (currentIndex + 1) % times.length;
      return { ...prev, timeOfDay: times[nextIndex], isManualMode: true };
    });
  };

  const resetToRealTime = () => {
    setEnvironment(prev => ({ ...prev, isManualMode: false }));
    updateEnvironment();
  };

  const toggleMute = () => {
    setGameState(prev => ({
      ...prev,
      stats: { ...prev.stats, isMuted: !prev.stats.isMuted }
    }));
  };

  return {
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
    isGhostEventActive,
  };
}
