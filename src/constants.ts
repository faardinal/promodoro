import { SessionType, ShopItem } from './types';

export const FOCUS_TIME = 25 * 60;
export const SHORT_BREAK_TIME = 5 * 60;
export const LONG_BREAK_TIME = 15 * 60;

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'red_bow', name: 'Red Bow', price: 50, type: 'cat_hat', image: '🎀', unlocked: false },
  { id: 'wizard_hat', name: 'Wizard Hat', price: 150, type: 'cat_hat', image: '🧙', unlocked: false },
  { id: 'blue_mug', name: 'Cerulean Mug', price: 30, type: 'mug_skin', image: '☕', unlocked: false },
  { id: 'gold_lamp', name: 'Antique Gold', price: 100, type: 'lamp_skin', image: '💡', unlocked: false },
  { id: 'scholar_glasses', name: 'Rounded Scholar Glasses', price: 80, type: 'glasses', image: '👓', unlocked: false },
  { id: 'grand_clock', name: 'Grand Library Timepiece', price: 300, type: 'clock_style', image: '🕰️', unlocked: false },
  { id: 'neon_clock', name: 'Cyber Neon', price: 200, type: 'clock_style', image: '🕒', unlocked: false },
  { id: 'rainy_night', name: 'Stormy Night', price: 0, type: 'background', image: '🌧️', unlocked: true },
];

export const SESSION_COLORS = {
  [SessionType.FOCUS]: '#4ade80', // Green
  [SessionType.SHORT_BREAK]: '#60a5fa', // Blue
  [SessionType.LONG_BREAK]: '#a855f7', // Purple
};

export const SESSION_LABELS = {
  [SessionType.FOCUS]: 'Focus',
  [SessionType.SHORT_BREAK]: 'Short Break',
  [SessionType.LONG_BREAK]: 'Long Break',
};
