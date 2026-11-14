import React, { createContext, useCallback, useMemo, useState } from 'react';
import { createInitialTasks } from '../data/initialTasks';
import { CreateTaskInput, Task, UpdateTaskInput } from '../types/task';
import { applyTaskUpdate, buildTask, getNextStatus } from '../utils/task';

export interface TasksContextValue {
  tasks: Task[];
  createTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  removeTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const TasksContext = createContext<TasksContextValue | undefined>(undefined);

const generateId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => createInitialTasks());

  const createTask = useCallback((input: CreateTaskInput) => {
    const task = buildTask(input, generateId());
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? applyTaskUpdate(task, input) : task)));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? applyTaskUpdate(task, { status: getNextStatus(task.status) }) : task
      )
    );
  }, []);

  const getTaskById = useCallback((id: string) => tasks.find((task) => task.id === id), [tasks]);

  const value = useMemo<TasksContextValue>(
    () => ({ tasks, createTask, updateTask, removeTask, toggleTaskStatus, getTaskById }),
    [tasks, createTask, updateTask, removeTask, toggleTaskStatus, getTaskById]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}
