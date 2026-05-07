import { create } from 'zustand';
import { Diary, MoodType, WeatherType, getAllDiaries, getDiary, createDiary as dbCreateDiary, updateDiary as dbUpdateDiary, deleteDiary as dbDeleteDiary } from '../db';

interface DiaryStore {
  diaries: Diary[];
  currentDiary: Diary | null;
  isLoading: boolean;
  error: string | null;
  
  loadDiaries: () => Promise<void>;
  getDiary: (id: string) => Promise<Diary | null>;
  createDiary: (data: { title: string; content: string; mood: MoodType; weather: WeatherType }) => Promise<Diary>;
  updateDiary: (id: string, data: Partial<Omit<Diary, 'id' | 'createdAt'>>) => Promise<void>;
  deleteDiary: (id: string) => Promise<void>;
  setCurrentDiary: (diary: Diary | null) => void;
  clearError: () => void;
}

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  diaries: [],
  currentDiary: null,
  isLoading: false,
  error: null,

  loadDiaries: async () => {
    set({ isLoading: true, error: null });
    try {
      const diaries = await getAllDiaries();
      set({ diaries, isLoading: false });
    } catch (err) {
      set({ error: '加载日记失败', isLoading: false });
    }
  },

  getDiary: async (id: string) => {
    try {
      const diary = await getDiary(id);
      if (diary) {
        set({ currentDiary: diary });
      }
      return diary || null;
    } catch (err) {
      set({ error: '获取日记失败' });
      return null;
    }
  },

  createDiary: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newDiary = await dbCreateDiary(data);
      const diaries = [newDiary, ...get().diaries];
      set({ diaries, currentDiary: newDiary, isLoading: false });
      return newDiary;
    } catch (err) {
      set({ error: '创建日记失败', isLoading: false });
      throw err;
    }
  },

  updateDiary: async (id: string, data) => {
    set({ error: null });
    try {
      await dbUpdateDiary(id, data);
      const diary = await getDiary(id);
      if (diary) {
        set({
          diaries: get().diaries.map(d => d.id === id ? diary : d),
          currentDiary: diary
        });
      }
    } catch (err) {
      set({ error: '更新日记失败' });
      throw err;
    }
  },

  deleteDiary: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await dbDeleteDiary(id);
      set({
        diaries: get().diaries.filter(d => d.id !== id),
        currentDiary: get().currentDiary?.id === id ? null : get().currentDiary,
        isLoading: false
      });
    } catch (err) {
      set({ error: '删除日记失败', isLoading: false });
    }
  },

  setCurrentDiary: (diary) => {
    set({ currentDiary: diary });
  },

  clearError: () => {
    set({ error: null });
  }
}));
