export enum SessionType {
  FOCUS = 'focus',
  SHORT_BREAK = 'short_break',
  LONG_BREAK = 'long_break',
}

export enum CatState {
  IDLE = 'idle',
  MEOW = 'meow',
  PETTED = 'petted',
  SLEEPING = 'sleeping',
  AWAY = 'away',
}

export interface AudioSettings {
  musicVolume: number;
  asmrVolume: number;
  isPlaying: boolean; // Master Play/Pause
  toggles: {
    // Music
    rainLofi: boolean;
    jazzCafe: boolean;
    darkModeLofi: boolean;
    fireplaceAmbience: boolean;
    // ASMR
    rain: boolean;
    keyboardTyping: boolean;
    barista: boolean;
  };
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: 'cat_hat' | 'mug_skin' | 'lamp_skin' | 'background' | 'clock_style' | 'glasses';
  image: string;
  unlocked: boolean;
}

export enum TimeOfDay {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  SUNSET = 'sunset',
  NIGHT = 'night',
  MIDNIGHT = 'midnight',
}

export enum Weather {
  CLEAR = 'clear',
  RAIN = 'rain',
  THUNDER = 'thunder',
  SNOW = 'snow',
}

export interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserStats {
  coins: number;
  streak: number;
  completedSessions: number;
  dailySessions: number;
  totalFocusTime: number; // in seconds
  totalBreakTime: number; // in seconds
  dailyHistory: Record<string, number>; // date string -> sessions completed
  lastActiveDate?: string; // YYYY-MM-DD
  bestFocusDay?: {
    date: string;
    sessions: number;
  };
  unlockedItems: string[];
  isMuted: boolean;
  audioSettings: AudioSettings;
  timerSettings: {
    focus: number; // in seconds
    shortBreak: number; // in seconds
    longBreak: number; // in seconds
  };
  activeItems: {
    cat_hat?: string;
    mug_skin?: string;
    lamp_skin?: string;
    background?: string;
    clock_style?: string;
    glasses?: string;
  };
}

export interface GameState {
  timeLeft: number;
  isActive: boolean;
  sessionType: SessionType;
  sessionCount: number;
  catState: CatState;
  catDialogue?: string;
  stats: UserStats;
  tasks: TodoTask[];
  lastUpdate?: number;
}
