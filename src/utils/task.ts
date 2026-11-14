import {
  CreateTaskInput,
  Task,
  TaskDraft,
  TaskDraftErrors,
  TaskPriority,
  TaskStats,
  TaskStatus,
  TaskStatusFilter,
  UpdateTaskInput,
} from '../types/task';
import { isValidDateKey, parseDateKey, startOfDay } from './date';

// ---------- Справочники ----------

export const taskPriorities: readonly TaskPriority[] = ['low', 'medium', 'high'];
export const taskStatusFilters: readonly TaskStatusFilter[] = ['all', 'active', 'completed'];

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export const statusLabels: Record<TaskStatus, string> = {
  active: 'В процессе',
  completed: 'Выполнено',
};

export const statusFilterLabels: Record<TaskStatusFilter, string> = {
  all: 'Все',
  active: 'Активные',
  completed: 'Готовые',
};

/** Чем меньше число, тем выше задача в списке. */
const priorityRank: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

// ---------- Подсчёт, сортировка, фильтрация ----------

export function countTasks(tasks: readonly Task[]): TaskStats {
  const completed = tasks.filter((task) => task.status === 'completed').length;
  return { total: tasks.length, active: tasks.length - completed, completed };
}

/** Сортирует по убыванию приоритета; при равном приоритете сохраняет исходный порядок. */
export function sortByPriority(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
}

export function filterByStatus(tasks: readonly Task[], filter: TaskStatusFilter): Task[] {
  if (filter === 'all') return [...tasks];
  return tasks.filter((task) => task.status === filter);
}

/** Поиск по названию или предмету без учёта регистра. Пустой запрос возвращает все задачи. */
export function filterTasks(tasks: readonly Task[], query: string): Task[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [...tasks];

  return tasks.filter(
    (task) =>
      task.title.toLocaleLowerCase().includes(normalized) ||
      task.subject.toLocaleLowerCase().includes(normalized)
  );
}

export interface TaskListQuery {
  search: string;
  status: TaskStatusFilter;
}

/** Задачи, которые нужно показать в списке: фильтр по статусу → поиск → сортировка. */
export function selectVisibleTasks(tasks: readonly Task[], { search, status }: TaskListQuery): Task[] {
  return sortByPriority(filterTasks(filterByStatus(tasks, status), search));
}

/** Задача просрочена, если она не выполнена, а срок сдачи (включительно) уже прошёл. */
export function isTaskOverdue(task: Pick<Task, 'status' | 'dueDate'>, now: Date = new Date()): boolean {
  if (task.status === 'completed' || !task.dueDate) return false;
  const due = parseDateKey(task.dueDate);
  if (!due) return false;
  return due.getTime() < startOfDay(now).getTime();
}

// ---------- Создание и изменение ----------

export function getNextStatus(status: TaskStatus): TaskStatus {
  return status === 'active' ? 'completed' : 'active';
}

export function buildTask(input: CreateTaskInput, id: string, now: Date = new Date()): Task {
  return {
    ...input,
    id,
    status: 'active',
    createdAt: now.toISOString(),
  };
}

export function applyTaskUpdate(task: Task, input: UpdateTaskInput): Task {
  return { ...task, ...input };
}

// ---------- Форма ----------

export function inputToDraft(values?: Partial<CreateTaskInput>): TaskDraft {
  return {
    title: values?.title ?? '',
    subject: values?.subject ?? '',
    priority: values?.priority ?? 'medium',
    dueDate: values?.dueDate ?? '',
  };
}

export function validateTaskDraft(draft: TaskDraft): TaskDraftErrors {
  const errors: TaskDraftErrors = {};

  if (!draft.title.trim()) errors.title = 'Введите название задачи';
  if (!draft.subject.trim()) errors.subject = 'Введите предмет';

  const dueDate = draft.dueDate.trim();
  if (dueDate && !isValidDateKey(dueDate)) {
    errors.dueDate = 'Укажите дату в формате ГГГГ-ММ-ДД';
  }

  return errors;
}

export function hasErrors(errors: TaskDraftErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function draftToInput(draft: TaskDraft): CreateTaskInput {
  const dueDate = draft.dueDate.trim();
  return {
    title: draft.title.trim(),
    subject: draft.subject.trim(),
    priority: draft.priority,
    dueDate: dueDate || undefined,
  };
}
