/**
 * Unified Audio Service for Pomodoro Library Café
 * Manages Music, ASMR, and SFX with preloading and browser compatibility.
 */

class AudioService {
  private musicPlayer: HTMLAudioElement | null = null;
  private asmrPlayers: Map<string, HTMLAudioElement> = new Map();
  private sfxPlayers: Map<string, HTMLAudioElement> = new Map();
  private sfxCooldowns: Map<string, number> = new Map();
  
  private initialized = false;
  private masterVolume = 1;
  private asmrVolume = 1;
  private musicVolume = 1;

  // Sound Assets Map
  private static SOUND_URLS: Record<string, string> = {
    // Lofi Tracks
    'Rain Lofi': 'https://res.cloudinary.com/dz1a7jsy9/video/upload/v1777773011/rain_ambient_f1gke2.mp3', 
    'Jazz Café': 'https://res.cloudinary.com/dz1a7jsy9/video/upload/v1777773011/jazz_ambient_gt4kxu.mp3',
    'Dark Mode Lofi': 'https://res.cloudinary.com/dz1a7jsy9/video/upload/v1777775385/Apparat_-_Goodbye_-_Dark_Netflix_Theme_Song_wvyewj.mp3',
    'Fireplace Ambience': 'https://res.cloudinary.com/dz1a7jsy9/video/upload/v1777773020/fireplace_ambient_qklsav.mp3',

    // ASMR (Google Actions Library - Stable Endpoints)
    'keyboardTyping': 'https://res.cloudinary.com/dz1a7jsy9/video/upload/v1777775143/Slow_pace_typing_on_mechanical_keyboard_sound_effect_free_download_HD_2020_o0gui1.mp3',
    'catPurr': 'https://actions.google.com/sounds/v1/animals/cat_purr.ogg',
    'rain': 'https://res.cloudinary.com/dz1a7jsy9/video/upload/v1777801420/15_Minutes_of_Rain_and_Thunderstorm_Sounds_For_Focus_Relaxing_and_Sleep_Epidemic_ASMR_smxetm.mp3',
    'barista': 'https://res.cloudinary.com/dz1a7jsy9/video/upload/v1777801414/Pov_Relaxing_Barista_workflow_cdtuxi.mp3',

    // SFX
    'meow': 'https://res.cloudinary.com/dz1a7jsy9/video/upload/v1777800672/stu9-cute-cat-352656_x5g3ob.mp3',
    'click': 'https://res.cloudinary.com/dz1a7jsy9/video/upload/v1777775284/Click_Sound_Effect_cjht6q.mp3',
    'complete': 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.preload();
    }
  }

  private preload() {
    // Preload ALL sounds to avoid runtime lag
    Object.keys(AudioService.SOUND_URLS).forEach(key => {
      const url = AudioService.SOUND_URLS[key];
      if (!url) return;
      
      const audio = new Audio(url);
      audio.preload = 'auto';
      
      // Determine if it's ASMR or Music (loopable)
      // All sounds except meow, click, complete are loopable now
      if (key !== 'meow' && key !== 'click' && key !== 'complete') {
        audio.loop = true;
        this.asmrPlayers.set(key, audio);
      } else {
        this.sfxPlayers.set(key, audio);
      }

      audio.addEventListener('error', (e) => {
        const error = (e.target as HTMLAudioElement).error;
        console.warn(`Audio Asset Error [${key}]: ${error?.message || 'Unknown error'} for URL: ${url}`);
      });
    });
  }

  public init() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Warm up players
    this.sfxPlayers.forEach(p => p.load());
    this.asmrPlayers.forEach(p => p.load());

    console.log('Audio Service Initialized');
  }

  public playSFX(name: string, volume = 0.8) {
    if (name === 'click') return; // User requested to turn off click sound

    // Prevent overlapping SFX spam (200ms cooldown per SFX type)
    const now = Date.now();
    const lastPlayed = this.sfxCooldowns.get(name) || 0;
    if (now - lastPlayed < 200) return;
    
    const audio = this.sfxPlayers.get(name);
    if (!audio || audio.networkState === 3) return;

    try {
      this.sfxCooldowns.set(name, now);
      audio.currentTime = 0;
      audio.volume = volume * this.masterVolume;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name !== 'NotAllowedError') {
            console.debug(`SFX ${name} skip: ${e.message}`);
          }
        });
      }
    } catch (e) {
      // Catch synchronous errors
    }
  }

  public syncAudio(toggles: Record<string, boolean>, isMasterPlaying: boolean, musicVolume: number, asmrVolume: number) {
    this.musicVolume = musicVolume;
    this.asmrVolume = asmrVolume;

    Object.entries(toggles).forEach(([key, enabled]) => {
      // Keys in toggles should match SOUND_URLS keys
      // But we need to map camelCase toggles to PascalCase/original keys if they differ
      let soundKey = key;
      if (key === 'rainLofi') soundKey = 'Rain Lofi';
      if (key === 'jazzCafe') soundKey = 'Jazz Café';
      if (key === 'darkModeLofi') soundKey = 'Dark Mode Lofi';
      if (key === 'fireplaceAmbience') soundKey = 'Fireplace Ambience';

      const player = this.asmrPlayers.get(soundKey);
      if (!player) return;

      const isLofi = ['Rain Lofi', 'Jazz Café', 'Dark Mode Lofi', 'Fireplace Ambience'].includes(soundKey);
      player.volume = (isLofi ? musicVolume : asmrVolume);

      const targetPlaying = enabled && isMasterPlaying;

      if (targetPlaying && (player.paused || player.ended)) {
        player.play().catch(e => {
          if (e.name !== 'NotAllowedError') {
            console.debug(`Sound ${soundKey} playback inhibited: ${e.message}`);
          }
        });
      } else if (!targetPlaying && !player.paused) {
        player.pause();
      }
    });
  }
}

export const audioService = new AudioService();
