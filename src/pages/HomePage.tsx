import { useEffect } from 'react';
import { useDiaryStore } from '../stores/diaryStore';
import { Header } from '../components/Layout/Header';
import { FloatingButton } from '../components/Layout/FloatingButton';
import { DiaryCard, DiaryCardSkeleton } from '../components/Diary/DiaryCard';
import { Feather } from 'lucide-react';
import styles from './HomePage.module.css';

export function HomePage() {
  const { diaries, isLoading, loadDiaries } = useDiaryStore();

  useEffect(() => {
    loadDiaries();
  }, [loadDiaries]);

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          {isLoading ? (
            <div className={styles.list}>
              {[1, 2, 3].map(i => (
                <DiaryCardSkeleton key={i} />
              ))}
            </div>
          ) : diaries.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <Feather size={48} strokeWidth={1} />
              </div>
              <h2 className={styles.emptyTitle}>尚未开始书写</h2>
              <p className={styles.emptyText}>点击右下角的按钮，开启你的第一篇日记</p>
            </div>
          ) : (
            <div className={styles.list}>
              {diaries.map((diary, index) => (
                <DiaryCard 
                  key={diary.id} 
                  diary={diary}
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <FloatingButton />
    </div>
  );
}
