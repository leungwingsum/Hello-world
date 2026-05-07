import Dexie, { Table } from 'dexie';

export type MoodType = 'peaceful' | 'happy' | 'sad' | 'anxious' | 'grateful' | 'excited' | 'tired' | 'neutral';
export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'stormy';

export interface Diary {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  weather: WeatherType;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  id: string;
  theme: 'light' | 'dark' | 'ink';
  fontSize: 'small' | 'medium' | 'large';
}

class DiaryDatabase extends Dexie {
  diaries!: Table<Diary>;
  settings!: Table<Settings>;

  constructor() {
    super('jingyu-diary');
    this.version(1).stores({
      diaries: 'id, createdAt, updatedAt, mood, weather',
      settings: 'id'
    });
  }
}

export const db = new DiaryDatabase();

export const getAllDiaries = async (): Promise<Diary[]> => {
  return await db.diaries.orderBy('createdAt').reverse().toArray();
};

export const getDiary = async (id: string): Promise<Diary | undefined> => {
  return await db.diaries.get(id);
};

export const createDiary = async (diary: Omit<Diary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Diary> => {
  const now = Date.now();
  const newDiary: Diary = {
    ...diary,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now
  };
  await db.diaries.add(newDiary);
  return newDiary;
};

export const updateDiary = async (id: string, data: Partial<Omit<Diary, 'id' | 'createdAt'>>): Promise<void> => {
  await db.diaries.update(id, {
    ...data,
    updatedAt: Date.now()
  });
};

export const deleteDiary = async (id: string): Promise<void> => {
  await db.diaries.delete(id);
};

export const getSettings = async (): Promise<Settings | undefined> => {
  return await db.settings.get('user-settings');
};

export const updateSettings = async (data: Partial<Omit<Settings, 'id'>>): Promise<void> => {
  const existing = await getSettings();
  if (existing) {
    await db.settings.update('user-settings', data);
  } else {
    await db.settings.add({
      id: 'user-settings',
      theme: 'light',
      fontSize: 'medium',
      ...data
    });
  }
};

export const exportAllDiaries = async (): Promise<{ exportDate: string; totalCount: number; diaries: Diary[] }> => {
  const diaries = await getAllDiaries();
  return {
    exportDate: new Date().toISOString(),
    totalCount: diaries.length,
    diaries
  };
};
