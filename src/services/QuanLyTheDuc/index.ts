// Mock service functions for QuanLyTheDuc
const genId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export type WorkoutRecord = {
  id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
  note?: string;
  status: 'completed' | 'missed' | 'planned';
};

export type HealthMetric = {
  id: string;
  date: string;
  weight: number; // kg
  height: number; // cm
  restingHeartRate?: number;
  sleepHours?: number;
};

export type Goal = {
  id: string;
  name: string;
  type: string;
  targetValue: number;
  currentValue: number;
  deadline?: string;
  status: 'active' | 'achieved' | 'cancelled';
};

export type ExerciseItem = {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  desc?: string;
  caloriesPerHour?: number;
};

const now = new Date();

const sampleWorkouts: WorkoutRecord[] = Array.from({ length: 8 }).map((_, i) => ({
  id: genId(),
  date: new Date(now.getTime() - i * 86400000).toISOString(),
  type: ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'][i % 5],
  duration: 30 + (i % 4) * 10,
  calories: 200 + i * 50,
  note: i % 2 === 0 ? 'Buổi tập tốt' : '',
  status: i % 3 === 0 ? 'missed' : 'completed',
}));

const sampleMetrics: HealthMetric[] = Array.from({ length: 10 }).map((_, i) => ({
  id: genId(),
  date: new Date(now.getTime() - i * 3 * 86400000).toISOString(),
  weight: 70 + (i % 5) * 0.5,
  height: 175,
  restingHeartRate: 60 + (i % 4),
  sleepHours: 7 + (i % 3) * 0.5,
}));

const sampleGoals: Goal[] = [
  { id: genId(), name: 'Giảm 3kg', type: 'Giảm cân', targetValue: 3, currentValue: 1.2, deadline: undefined, status: 'active' },
  { id: genId(), name: 'Chạy 5km', type: 'Cải thiện sức bền', targetValue: 5, currentValue: 5, deadline: undefined, status: 'achieved' },
];

const sampleExercises: ExerciseItem[] = [
  { id: genId(), name: 'Push-up', muscleGroup: 'Chest', difficulty: 'Medium', desc: 'Thực hiện chống đẩy', caloriesPerHour: 400 },
  { id: genId(), name: 'Squat', muscleGroup: 'Legs', difficulty: 'Medium', desc: 'Đứng dậy ngồi xuống', caloriesPerHour: 420 },
  { id: genId(), name: 'Plank', muscleGroup: 'Core', difficulty: 'Hard', desc: 'Giữ người thẳng', caloriesPerHour: 250 },
];

export const getRecentWorkouts = async (): Promise<WorkoutRecord[]> => {
  return Promise.resolve(sampleWorkouts.slice(0, 5));
};

export const getWorkouts = async (): Promise<WorkoutRecord[]> => {
  return Promise.resolve(sampleWorkouts);
};

export const addOrUpdateWorkout = async (payload: Partial<WorkoutRecord>) => {
  if (!payload.id) payload.id = genId();
  return Promise.resolve(payload as WorkoutRecord);
};

export const deleteWorkout = async (id: string) => Promise.resolve(true);

export const getHealthMetrics = async (): Promise<HealthMetric[]> => Promise.resolve(sampleMetrics);
export const addOrUpdateMetric = async (payload: Partial<HealthMetric>) => {
  if (!payload.id) payload.id = genId();
  return Promise.resolve(payload as HealthMetric);
};
export const deleteMetric = async (id: string) => Promise.resolve(true);

export const getGoals = async (): Promise<Goal[]> => Promise.resolve(sampleGoals);
export const addOrUpdateGoal = async (payload: Partial<Goal>) => {
  if (!payload.id) payload.id = genId();
  return Promise.resolve(payload as Goal);
};
export const deleteGoal = async (id: string) => Promise.resolve(true);

export const getExercises = async (): Promise<ExerciseItem[]> => Promise.resolve(sampleExercises);
export const addOrUpdateExercise = async (payload: Partial<ExerciseItem>) => {
  if (!payload.id) payload.id = genId();
  return Promise.resolve(payload as ExerciseItem);
};
export const deleteExercise = async (id: string) => Promise.resolve(true);

export default {};
