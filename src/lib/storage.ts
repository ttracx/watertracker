// LocalStorage utilities for WaterTracker

export interface DayData {
  date: string;
  glasses: number;
  goal: number;
  timestamps: string[];
}

export interface UserSettings {
  dailyGoal: number;
  glassSize: number; // in ml
  reminderEnabled: boolean;
  reminderInterval: number; // in minutes
}

const STORAGE_KEYS = {
  SETTINGS: 'watertracker_settings',
  HISTORY: 'watertracker_history',
};

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 8,
  glassSize: 250,
  reminderEnabled: false,
  reminderInterval: 60,
};

export function getSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDayData(date: string): DayData {
  if (typeof window === 'undefined') {
    return { date, glasses: 0, goal: DEFAULT_SETTINGS.dailyGoal, timestamps: [] };
  }
  const history = getHistory();
  return history[date] || { date, glasses: 0, goal: getSettings().dailyGoal, timestamps: [] };
}

export function getHistory(): Record<string, DayData> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return stored ? JSON.parse(stored) : {};
}

export function saveDayData(data: DayData): void {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  history[data.date] = data;
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function getWeekData(): DayData[] {
  const days: DayData[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    days.push(getDayData(key));
  }
  
  return days;
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}
