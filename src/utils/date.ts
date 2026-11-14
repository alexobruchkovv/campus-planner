const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (value: number): string => String(value).padStart(2, '0');

/** Дата → строка ГГГГ-ММ-ДД в локальном часовом поясе. */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Строка ГГГГ-ММ-ДД → дата (полночь по местному времени) или null, если дата некорректна. */
export function parseDateKey(value: string): Date | null {
  const match = DATE_KEY_PATTERN.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  // Отсекает несуществующие даты вроде 2026-02-31, которые Date молча переносит.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

export function isValidDateKey(value: string): boolean {
  return parseDateKey(value) !== null;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Дата → ДД.ММ.ГГГГ. */
export function formatDate(date: Date): string {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

/** ГГГГ-ММ-ДД или ISO-строка → ДД.ММ.ГГГГ; некорректное значение возвращается как есть. */
export function formatDateString(value: string): string {
  const date = parseDateKey(value) ?? new Date(value);
  return Number.isNaN(date.getTime()) ? value : formatDate(date);
}
