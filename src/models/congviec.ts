import { useEffect, useState } from 'react';

export type TaskItem = {
  id: string;
  title: string;
  description?: string;
  deadline?: string | null;
  priority?: 'High' | 'Medium' | 'Low';
  tags?: string[];
  status: 'todo' | 'doing' | 'done';
  createdAt: string;
};

const STORAGE_KEY = 'congviec_tasks';

export default () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    const raw: any = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setTasks(JSON.parse(raw));
      } catch (e) {
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks || []));
  }, [tasks]);

  const load = () => {
    const raw: any = localStorage.getItem(STORAGE_KEY);
    setTasks(raw ? JSON.parse(raw) : []);
  };

  const addTask = (t: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const item: TaskItem = {
      ...t,
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((s) => [item, ...(s || [])]);
    return item;
  };

  const updateTask = (id: string, patch: Partial<TaskItem>) => {
    setTasks((s) => (s || []).map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const moveTask = (id: string, status: TaskItem['status'], index: number) => {
    setTasks((currentTasks) => {
      const sourceIndex = (currentTasks || []).findIndex((task) => task.id === id);
      if (sourceIndex < 0) {
        return currentTasks;
      }

      const nextTasks = [...(currentTasks || [])];
      const [draggedTask] = nextTasks.splice(sourceIndex, 1);
      const updatedTask = { ...draggedTask, status };

      const reorderedTasks: TaskItem[] = [];
      let statusCount = 0;
      let inserted = false;

      nextTasks.forEach((task) => {
        if (!inserted && task.status === status && statusCount === index) {
          reorderedTasks.push(updatedTask);
          inserted = true;
        }

        reorderedTasks.push(task);

        if (task.status === status) {
          statusCount += 1;
        }
      });

      if (!inserted) {
        reorderedTasks.push(updatedTask);
      }

      return reorderedTasks;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((s) => (s || []).filter((it) => it.id !== id));
  };

  const getById = (id?: string) => (tasks || []).find((t) => t.id === id);

  const stats = () => {
    const total = (tasks || []).length;
    const done = (tasks || []).filter((t) => t.status === 'done').length;
    const overdue = (tasks || []).filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done').length;
    return { total, done, overdue };
  };

  return {
    tasks,
    setTasks,
    load,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    getById,
    stats,
  } as const;
};
