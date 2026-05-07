import { Link } from 'react-router-dom';
import { Diary } from '../../db';
import { formatDate, formatShortDate } from '../../utils/date';
import { getMoodIcon } from './MoodSelector';
import { getWeatherIcon } from './WeatherSelector';
import styles from './DiaryCard.module.css';

interface DiaryCardProps {
  diary: Diary;
  style?: React.CSSProperties;
}

export function DiaryCard({ diary, style }: DiaryCardProps) {
  const { month, day, year } = formatShortDate(diary.createdAt);
  const preview = diary.content.slice(0, 100).replace(/\n/g, ' ');

  return (
    <Link to={`/detail/${diary.id}`} className={styles.card} style={style}>
      <div className={styles.dateSection}>
        <span className={styles.month}>{month}</span>
        <span className={styles.day}>{day}</span>
        <span className={styles.year}>{year}</span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.mood}>{getMoodIcon(diary.mood)}</span>
          <span className={styles.weather}>{getWeatherIcon(diary.weather)}</span>
        </div>
        
        <h3 className={styles.title}>
          {diary.title || '无标题'}
        </h3>
        
        <p className={styles.preview}>
          {preview || '暂无内容...'}
        </p>
      </div>
    </Link>
  );
}

export function DiaryCardSkeleton() {
  return (
    <div className={`${styles.card} ${styles.skeleton}`}>
      <div className={styles.dateSection}>
        <span className={`${styles.month} skeleton`}>&nbsp;&nbsp;</span>
        <span className={`${styles.day} skeleton`}>&nbsp;&nbsp;</span>
        <span className={`${styles.year} skeleton`}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className="skeleton" style={{ width: 20, height: 20, display: 'inline-block' }}></span>
          <span className="skeleton" style={{ width: 20, height: 20, display: 'inline-block' }}></span>
        </div>
        <h3 className={`${styles.title} skeleton`} style={{ width: '60%', height: 24 }}>&nbsp;</h3>
        <p className={`${styles.preview} skeleton`} style={{ width: '100%', height: 16 }}>&nbsp;</p>
        <p className={`${styles.preview} skeleton`} style={{ width: '80%', height: 16 }}>&nbsp;</p>
      </div>
    </div>
  );
}
