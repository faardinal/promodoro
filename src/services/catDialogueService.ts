
export enum DialogueCategory {
  SKIP_SESSION = 'skip_session',
  COMPLETE_SESSION = 'complete_session',
  AUDIO_START = 'audio_start',
  IDLE = 'idle',
  WELCOME_BACK = 'welcome_back',
  PETTED = 'petted',
}

const DIALOGUES: Record<DialogueCategory, string[]> = {
  [DialogueCategory.SKIP_SESSION]: [
    "Hey! That timer didn’t skip itself...",
    "Focus escaped again. Shall I catch it?",
    "Productivity called. You missed it.",
    "Even my naps are more organized than this.",
    "The task is waiting... dramatically.",
    "Meow? Did we just give up? Just kidding!",
    "Aborting mission? I'll just stay here and look cute.",
    "The clock is crying. Just a little bit.",
    "Running away from work? I'm an expert at that.",
    "Focus is like a red dot... hard to catch, isn't it?",
  ],
  [DialogueCategory.COMPLETE_SESSION]: [
    "Purrfect work! One session conquered.",
    "Look at you being productive!",
    "Focus level increased!",
    "You did it! I’m proud in a cat way.",
    "Another win for Team Us.",
    "Mission accomplished. Treat time?",
    "You're a focus master. Mrrrp!",
    "That was impressive. Even for a human.",
    "Session complete. My whiskers are tingling with pride.",
    "Great job! Now, take a tiny stretch like me.",
  ],
  [DialogueCategory.AUDIO_START]: [
    "Nice choice. Let’s get focused.",
    "Good sound picked. Time to lock in.",
    "Mood set. Brain activated.",
    "Excellent vibe selection.",
    "This soundtrack smells like productivity.",
    "Purrr... I like this rhythm.",
    "Music to my ears. Literally.",
    "Ah, the sweet sound of focus.",
    "Vibes are immaculate. Proceed.",
    "Dynamic sounds for a dynamic human.",
  ],
  [DialogueCategory.IDLE]: [
    "I'm watching you... in a supportive way.",
    "Is it nap time yet? No? Okay.",
    "You're doing great. Keep going!",
    "Staring at the wall is my hobby. Yours is working!",
    "I believe in you. Mostly because you give me treats.",
    "Focus is a journey. I'm the navigator.",
    "Just a cat, doing cat things. You, do human things.",
    "Need a meow-tivation? Here it is: MEOW!",
    "The keyboard is warm. I must resist.",
    "Success is 90% showing up and 10% not being a cat.",
  ],
  [DialogueCategory.WELCOME_BACK]: [
    "Oh, you're back! The chair was getting lonely.",
    "Missed me? I missed the attention.",
    "Back to work? I'll supervise.",
    "The focus returneth!",
    "Welcome back to our cozy corner.",
    "I was just about to go looking for you. Not really.",
    "Ah, the human returns. Let the productivity resume.",
    "Glad you're back. My ears were bored.",
    "Found your way back? Excellent.",
    "The break is over, the legend continues.",
  ],
  [DialogueCategory.PETTED]: [
    "Mrrrp! That's the spot.",
    "Purrr... More of that, please.",
    "I'll allow it. For now.",
    "My fur is now 10% more magical.",
    "Quality interaction detected.",
  ]
};

class CatDialogueService {
  private history: Map<DialogueCategory, string[]> = new Map();
  private readonly HISTORY_LIMIT = 5;

  public getRandomLine(category: DialogueCategory): string {
    const lines = DIALOGUES[category];
    const categoryHistory = this.history.get(category) || [];
    
    // Filter out recently used lines
    let availableLines = lines.filter(line => !categoryHistory.includes(line));
    
    // If all lines used, reset history for this category but keep it varied
    if (availableLines.length === 0) {
      availableLines = lines;
      this.history.set(category, []);
    }

    const randomIndex = Math.floor(Math.random() * availableLines.length);
    const selectedLine = availableLines[randomIndex];

    // Update history
    const newHistory = [selectedLine, ...categoryHistory].slice(0, this.HISTORY_LIMIT);
    this.history.set(category, newHistory);

    return selectedLine;
  }
}

export const catDialogueService = new CatDialogueService();
