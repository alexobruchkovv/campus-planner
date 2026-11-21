import { Easing, FadeInDown, FadeOutLeft, LinearTransition, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

/**
 * Единые параметры анимаций приложения.
 * spring — для прямой реакции на действие пользователя (отметка статуса),
 * timing — для спокойных переходов с известной длительностью (раскрытие, прогресс).
 */
export const motion = {
  spring: { damping: 14, stiffness: 180, mass: 1 } satisfies WithSpringConfig,
  timing: { duration: 260, easing: Easing.out(Easing.cubic) } satisfies WithTimingConfig,
  progress: { duration: 500, easing: Easing.out(Easing.cubic) } satisfies WithTimingConfig,
  highlight: { delay: 400, fadeIn: 180, fadeOut: 700 },
} as const;

/** Layout-анимации элементов списка задач. */
export const listAnimations = {
  /** Новая карточка выезжает снизу с небольшим смещением. */
  entering: FadeInDown.duration(350),
  /** Удалённая карточка уходит влево; из состояния она уже удалена. */
  exiting: FadeOutLeft.duration(250),
  /** Соседние карточки плавно занимают освободившееся место. */
  layout: LinearTransition.duration(250),
};
