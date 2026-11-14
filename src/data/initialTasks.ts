import { Task } from '../types/task';
import { addDays, toDateKey } from '../utils/date';

/** Демо-данные. Даты считаются от текущего дня, чтобы пример с просрочкой оставался актуальным. */
export function createInitialTasks(now: Date = new Date()): Task[] {
  const daysAgo = (days: number) => addDays(now, -days).toISOString();
  const inDays = (days: number) => toDateKey(addDays(now, days));

  return [
    {
      id: '1',
      title: 'Сделать лабораторную по сетям',
      subject: 'Сети ЭВМ',
      priority: 'high',
      status: 'active',
      createdAt: daysAgo(3),
      dueDate: inDays(2),
    },
    {
      id: '2',
      title: 'Прочитать главу учебника',
      subject: 'Матанализ',
      priority: 'low',
      status: 'completed',
      createdAt: daysAgo(5),
    },
    {
      id: '3',
      title: 'Подготовить презентацию',
      subject: 'История',
      priority: 'medium',
      status: 'active',
      createdAt: daysAgo(7),
      dueDate: inDays(-1),
    },
    {
      id: '4',
      title: 'Сдать отчёт по практике',
      subject: 'Программирование',
      priority: 'high',
      status: 'active',
      createdAt: daysAgo(1),
    },
  ];
}
