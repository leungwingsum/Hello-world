import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDiaryStore } from '../stores/diaryStore';
import { useToast } from '../components/Layout/Layout';
import { ConfirmModal } from '../components/Common/Modal';
import { getMoodIcon, getMoodInfo } from '../components/Diary/MoodSelector';
import { getWeatherIcon, getWeatherInfo } from '../components/Diary/WeatherSelector';
import { formatDateTime } from '../utils/date';
import { Edit, Trash2, Calendar } from 'lucide-react';
import styles from './DetailPage.module.css';

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDiary, deleteDiary, currentDiary } = useDiaryStore();
  const { showToast } = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      getDiary(id);
    }
  }, [id, getDiary]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteDiary(id);
      showToast('日记已删除', 'success');
      navigate('/');
    } catch {
      showToast('删除失败', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (!currentDiary) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Link to="/" className={styles.backLink}>
            返回
          </Link>
        </header>
        <main className={styles.main}>
          <div className={styles.loading}>加载中...</div>
        </main>
      </div>
    );
  }

  const moodInfo = getMoodInfo(currentDiary.mood);
  const weatherInfo = getWeatherInfo(currentDiary.weather);
  const wordCount = currentDiary.content.replace(/\s/g, '').length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>
          返回
        </Link>
        <div className={styles.actions}>
          <Link to={`/editor/${id}`} className={styles.actionBtn}>
            <Edit size={18} />
            <span>编辑</span>
          </Link>
          <button className={styles.actionBtn} onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 size={18} />
            <span>删除</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <article className={styles.article}>
          <div className={styles.meta}>
            <div className={styles.tags}>
              <span className={styles.tag} style={{ color: moodInfo.color }}>
                {getMoodIcon(currentDiary.mood)}
                <span>{moodInfo.label}</span>
              </span>
              <span className={styles.tag} style={{ color: weatherInfo.color }}>
                {getWeatherIcon(currentDiary.weather)}
                <span>{weatherInfo.label}</span>
              </span>
            </div>
            <div className={styles.date}>
              <Calendar size={14} />
              <span>{formatDateTime(currentDiary.createdAt)}</span>
            </div>
          </div>

          <h1 className={styles.title}>{currentDiary.title || '无标题'}</h1>

          <div className={styles.content}>
            {currentDiary.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph || '\u00A0'}</p>
            ))}
          </div>

          <div className={styles.footer}>
            <span className={styles.wordCount}>{wordCount} 字</span>
          </div>
        </article>
      </main>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="删除日记"
        message="确定要删除这篇日记吗？删除后将无法恢复。"
        confirmText={isDeleting ? '删除中...' : '删除'}
        type="danger"
      />
    </div>
  );
}
