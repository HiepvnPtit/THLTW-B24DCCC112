import { useEffect, useState } from 'react';
import * as svc from '@/services/QuanLyTheDuc';

const KEY_WORKOUTS = 'quanlytheduc.workouts';
const KEY_METRICS = 'quanlytheduc.metrics';
const KEY_GOALS = 'quanlytheduc.goals';
const KEY_EXERCISES = 'quanlytheduc.exercises';

const readLocal = (key: string) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const writeLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export default () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    // load from localStorage or seed from service
    const w = readLocal(KEY_WORKOUTS);
    const m = readLocal(KEY_METRICS);
    const g = readLocal(KEY_GOALS);
    const e = readLocal(KEY_EXERCISES);

    if (w) setWorkouts(w);
    else svc.getWorkouts().then((d) => { setWorkouts(d); writeLocal(KEY_WORKOUTS, d); });

    if (m) setMetrics(m);
    else svc.getHealthMetrics().then((d) => { setMetrics(d); writeLocal(KEY_METRICS, d); });

    if (g) setGoals(g);
    else svc.getGoals().then((d) => { setGoals(d); writeLocal(KEY_GOALS, d); });

    if (e) setExercises(e);
    else svc.getExercises().then((d) => { setExercises(d); writeLocal(KEY_EXERCISES, d); });
  }, []);

  const getRecentWorkouts = async () => {
    const local = readLocal(KEY_WORKOUTS);
    if (local) return local.slice(0, 5);
    return workouts.slice(0, 5);
  };

  const getWorkouts = async () => {
    return readLocal(KEY_WORKOUTS) || workouts;
  };

  const addOrUpdateWorkout = async (payload: any) => {
    const all = readLocal(KEY_WORKOUTS) || [...workouts];
    if (!payload.id) payload.id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const idx = all.findIndex((x:any) => x.id === payload.id);
    if (idx >= 0) all[idx] = payload; else all.unshift(payload);
    writeLocal(KEY_WORKOUTS, all);
    setWorkouts(all);
    return payload;
  };

  const deleteWorkout = async (id: string) => {
    const all = (readLocal(KEY_WORKOUTS) || workouts).filter((x:any) => x.id !== id);
    writeLocal(KEY_WORKOUTS, all);
    setWorkouts(all);
    return true;
  };

  const getHealthMetrics = async () => readLocal(KEY_METRICS) || metrics;
  const addOrUpdateMetric = async (payload: any) => {
    const all = readLocal(KEY_METRICS) || [...metrics];
    if (!payload.id) payload.id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const idx = all.findIndex((x:any) => x.id === payload.id);
    if (idx >= 0) all[idx] = payload; else all.unshift(payload);
    writeLocal(KEY_METRICS, all);
    setMetrics(all);
    return payload;
  };
  const deleteMetric = async (id: string) => {
    const all = (readLocal(KEY_METRICS) || metrics).filter((x:any) => x.id !== id);
    writeLocal(KEY_METRICS, all);
    setMetrics(all);
    return true;
  };

  const getGoals = async () => readLocal(KEY_GOALS) || goals;
  const addOrUpdateGoal = async (payload: any) => {
    const all = readLocal(KEY_GOALS) || [...goals];
    if (!payload.id) payload.id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const idx = all.findIndex((x:any) => x.id === payload.id);
    if (idx >= 0) all[idx] = payload; else all.unshift(payload);
    writeLocal(KEY_GOALS, all);
    setGoals(all);
    return payload;
  };
  const deleteGoal = async (id: string) => {
    const all = (readLocal(KEY_GOALS) || goals).filter((x:any) => x.id !== id);
    writeLocal(KEY_GOALS, all);
    setGoals(all);
    return true;
  };

  const getExercises = async () => readLocal(KEY_EXERCISES) || exercises;
  const addOrUpdateExercise = async (payload: any) => {
    const all = readLocal(KEY_EXERCISES) || [...exercises];
    if (!payload.id) payload.id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const idx = all.findIndex((x: any) => x.id === payload.id);
    if (idx >= 0) all[idx] = payload;
    else all.unshift(payload);
    writeLocal(KEY_EXERCISES, all);
    setExercises(all);
    return payload;
  };

  const deleteExercise = async (id: string) => {
    const all = (readLocal(KEY_EXERCISES) || exercises).filter((x: any) => x.id !== id);
    writeLocal(KEY_EXERCISES, all);
    setExercises(all);
    return true;
  };

  return {
    workouts,
    metrics,
    goals,
    exercises,
    getRecentWorkouts,
    getWorkouts,
    addOrUpdateWorkout,
    deleteWorkout,
    getHealthMetrics,
    addOrUpdateMetric,
    deleteMetric,
    getGoals,
    addOrUpdateGoal,
    deleteGoal,
    getExercises,
    addOrUpdateExercise,
    deleteExercise,
  };
};
