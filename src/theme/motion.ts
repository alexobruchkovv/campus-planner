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

// ---------- Свайп карточки (ЛР №5) ----------

/** Дистанция (px), после которой отпущенный свайп выполняет действие. */
export const SWIPE_ACTION_THRESHOLD = 96;
/** Максимальное смещение карточки: дальше она не уезжает. */
export const SWIPE_MAX_OFFSET = 140;
/**
 * Pan активируется только после 16 px горизонтального движения —
 * короткое смещение пальца при нажатии остаётся обычным тапом.
 */
export const SWIPE_ACTIVATION_OFFSET = 16;
/** Если палец сначала ушёл на 12 px по вертикали — это прокрутка списка, а не свайп. */
export const SWIPE_FAIL_OFFSET_Y = 12;
/** Пружина возврата карточки на место: быстрая, почти без колебаний. */
export const swipeSpring = { damping: 20, stiffness: 220, mass: 0.8 } satisfies WithSpringConfig;

/** Сколько живёт кнопка «Отменить» после удаления. */
export const UNDO_TIMEOUT_MS = 5000;

/** Layout-анимации элементов списка задач. */
export const listAnimations = {
  /** Новая карточка выезжает снизу с небольшим смещением. */
  entering: FadeInDown.duration(350),
  /** Удалённая карточка уходит влево; из состояния она уже удалена. */
  exiting: FadeOutLeft.duration(250),
  /** Соседние карточки плавно занимают освободившееся место. */
  layout: LinearTransition.duration(250),
};
