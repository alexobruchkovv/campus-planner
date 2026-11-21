import { useEffect } from 'react';
import { SharedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { motion } from '../theme/motion';

export type AnimatedFlagMode = 'spring' | 'timing';

/**
 * Превращает логический флаг из React-состояния в плавное число 0…1 для анимаций.
 *
 * Источник истины — сам `flag` (например, `task.status === 'completed'`).
 * SharedValue только «догоняет» его визуально и никогда не меняется в обход React.
 */
export function useAnimatedFlag(flag: boolean, mode: AnimatedFlagMode = 'timing'): SharedValue<number> {
  const progress = useSharedValue(flag ? 1 : 0);

  useEffect(() => {
    const target = flag ? 1 : 0;
    progress.value = mode === 'spring' ? withSpring(target, motion.spring) : withTiming(target, motion.timing);
  }, [flag, mode, progress]);

  return progress;
}
