import React, { createContext, useContext, useState } from 'react';
import { Task } from '../types/task';

interface TasksContextValue {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

const initialTasks: Task[] = [
  { id: '1', title: 'Сделать лабораторную по сетям', subject: 'Сети ЭВМ', priority: 'high', isCompleted: false },
  { id: '2', title: 'Прочитать главу учебника', subject: 'Матанализ', priority: 'low', isCompleted: true },
  { id: '3', title: 'Подготовить презентацию', subject: 'История', priority: 'medium', isCompleted: false },
  { id: '4', title: 'Сдать отчёт по практике', subject: 'Программирование', priority: 'high', isCompleted: false },
];

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const getTaskById = (id: string) => tasks.find((t) => t.id === id);

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleStatus, getTaskById }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}