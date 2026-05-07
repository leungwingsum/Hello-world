import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiaryStore } from '../stores/diaryStore';
import { useToast } from '../components/Layout/Layout';
import { MoodSelector } from '../components/Diary/MoodSelector';
import { WeatherSelector } from '../components/Diary/WeatherSelector';
import { MoodType, WeatherType } from '../db';
import { Save, X } from 'lucide-react';
import styles from './EditorPage.module.css';

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createDiary, updateDiary, getDiary, currentDiary } = useDiaryStore();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('neutral');
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const hasLoaded = useRef(false);

  const isEditing = !!id;

  useEffect(() => {
    if (id && !hasLoaded.current) {
      hasLoaded.current = true;
      getDiary(id).then(diary => {
        if (diary) {
          setTitle(diary.title);
          setContent(diary.content);
          setMood(diary.mood);
          setWeather(diary.weather);
        }
      });
    }
  }, [id, getDiary]);

  useEffect(() => {
    if (!isEditing) {
      contentRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && !title && !content) return;

    const timer = setTimeout(async () => {
      if (!isDirty) return;
      
      setIsSaving(true);
      try {
        if (isEditing && id) {
          await updateDiary(id, { title, content, mood, weather });
        } else if (!id) {
          await createDiary({ title, content, mood, weather });
          navigate('/');
          return;
        }
        setLastSaved(new Date());
        setIsDirty(false);
        showToast('已保存', 'success');
      } catch {
        showToast('保存失败', 'error');
      } finally {
        setIsSaving(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [title, content, mood, weather, isDirty, isEditing, id, createDiary, updateDiary, navigate, showToast]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isDirty && (title || content)) {
        const data: any = { title, content, mood, weather };
        if (isEditing && id) {
          updateDiary(id, data);
        } else {
          createDiary(data);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, title, content, mood, weather, isEditing, id, createDiary, updateDiary]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  const handleMoodChange = (newMood: MoodType) => {
    setMood(newMood);
    setIsDirty(true);
  };

  const handleWeatherChange = (newWeather: WeatherType) => {
    setWeather(newWeather);
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isEditing && id) {
        await updateDiary(id, { title, content, mood, weather });
        showToast('已保存', 'success');
        setLastSaved(new Date());
        setIsDirty(false);
      } else {
        await createDiary({ title, content, mood, weather });
        showToast('日记已创建', 'success');
        navigate('/');
      }
    } catch {
      showToast('保存失败', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isDirty && (title || content)) {
      handleSave();
    }
    navigate('/');
  };

  const wordCount = content.replace(/\s/g, '').length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.closeBtn} onClick={handleClose}>
          <X size={20} />
        </button>
        <div className={styles.actions}>
          <span className={styles.saveStatus}>
            {isSaving ? '保存中...' : lastSaved ? `已保存 ${lastSaved.toLocaleTimeString()}` : ''}
          </span>
          <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
            <Save size={18} />
            <span>保存</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <input
            type="text"
            className={styles.title}
            placeholder="标题"
            value={title}
            onChange={handleTitleChange}
          />
          
          <textarea
            ref={contentRef}
            className={styles.editor}
            placeholder="开始书写..."
            value={content}
            onChange={handleContentChange}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <MoodSelector value={mood} onChange={handleMoodChange} compact />
          <WeatherSelector value={weather} onChange={handleWeatherChange} compact />
          <span className={styles.wordCount}>{wordCount} 字</span>
        </div>
      </footer>
    </div>
  );
}
