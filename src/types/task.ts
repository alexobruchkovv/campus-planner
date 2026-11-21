export type TaskStatus = 'active' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: TaskPriority;
  status: TaskStatus;
  /** Дата создания в формате ISO 8601. */
  createdAt: string;
  /** Срок сдачи в формате ГГГГ-ММ-ДД. */
  dueDate?: string;
  /** Подробное описание задачи (необязательно). */
  description?: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'status'>;
export type UpdateTaskInput = Partial<CreateTaskInput> & {
  status?: TaskStatus;
};

/** Фильтр списка: конкретный статус или все задачи. */
export type TaskStatusFilter = TaskStatus | 'all';

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
}

/** Сырые значения формы: всё хранится строками, как их вводит пользователь. */
export interface TaskDraft {
  title: string;
  subject: string;
  priority: TaskPriority;
  dueDate: string;
  description: string;
}

export type TaskDraftErrors = Partial<Record<'title' | 'subject' | 'dueDate', string>>;
