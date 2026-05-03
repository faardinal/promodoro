import { motion } from 'motion/react';
import { TimeOfDay, Weather } from '../../types';

interface ImmersionLayerProps {
  timeOfDay: TimeOfDay;
  weather: Weather;
}

const TIME_OVERLAYS: Record<TimeOfDay, string> = {
  [TimeOfDay.MORNING]: 'rgba(255, 240, 200, 0.05)',
  [TimeOfDay.AFTERNOON]: 'rgba(255, 255, 255, 0)',
  [TimeOfDay.SUNSET]: 'rgba(255, 80, 0, 0.12)',
  [TimeOfDay.NIGHT]: 'rgba(0, 10, 40, 0.25)',
  [TimeOfDay.MIDNIGHT]: 'rgba(0, 5, 20, 0.45)',
};

const TIME_FILTERS: Record<TimeOfDay, string> = {
  [TimeOfDay.MORNING]: 'brightness(1.05) contrast(0.95) saturate(1)',
  [TimeOfDay.AFTERNOON]: 'brightness(1) contrast(1) saturate(1)',
  [TimeOfDay.SUNSET]: 'brightness(0.85) contrast(1.1) saturate(1.3)',
  [TimeOfDay.NIGHT]: 'brightness(0.65) contrast(1.15) saturate(0.8)',
  [TimeOfDay.MIDNIGHT]: 'brightness(0.45) contrast(1.2) saturate(0.7)',
};

export default function ImmersionLayer({ timeOfDay, weather }: ImmersionLayerProps) {
  const isBadWeather = weather === Weather.RAIN || weather === Weather.THUNDER;
  
  // Calculate weather modifier for brightness
  const brightnessMod = isBadWeather ? 0.85 : 1;
  
  // Parse base filter and apply modifier
  const baseFilter = TIME_FILTERS[timeOfDay];
  const brightnessMatch = baseFilter.match(/brightness\(([^)]+)\)/);
  const baseBrightness = brightnessMatch ? parseFloat(brightnessMatch[1]) : 1;
  
  const finalFilter = baseFilter.replace(
    /brightness\([^)]+\)/, 
    `brightness(${baseBrightness * brightnessMod})`
  );

  return (
    <>
      {/* Global Lighting Tints */}
      <motion.div 
        animate={{ 
          backgroundColor: isBadWeather ? 'rgba(0, 10, 30, 0.1)' : TIME_OVERLAYS[timeOfDay],
          backdropFilter: finalFilter
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none z-40 transition-colors"
      />

      {/* Night Window View - Exterior Darkness Overlay */}
      <motion.div 
        animate={{
          opacity: (timeOfDay === TimeOfDay.NIGHT || timeOfDay === TimeOfDay.MIDNIGHT) ? 1 : 0
        }}
        transition={{ duration: 3 }}
        className="absolute top-[10.5%] left-[5.5%] w-[23.5%] h-[38.5%] bg-blue-900/30 pointer-events-none -z-5" 
      />
    </>
  );
}
