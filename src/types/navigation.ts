/** Параметры маршрутов, которые работают с конкретной задачей. */
export type TaskRouteParams = {
  id: string;
};

/** Все адреса приложения собраны в одном месте, чтобы экраны не собирали пути вручную. */
export const routes = {
  home: '/',
  settings: '/settings',
  newTask: '/task/new',
  taskDetails: (id: string) => ({ pathname: '/task/[id]', params: { id } }) as const,
  editTask: (id: string) => ({ pathname: '/task/edit/[id]', params: { id } }) as const,
} as const;
