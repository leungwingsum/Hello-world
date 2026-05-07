import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../stores/settingsStore';
import { useDiaryStore } from '../stores/diaryStore';
import { useToast } from '../components/Layout/Layout';
import { exportDiaries } from '../utils/export';
import { ArrowLeft, Sun, Moon, Cloud, Type, Download, Info } from 'lucide-react';
import styles from './SettingsPage.module.css';

const themes = [
  { value: 'light' as const, label: '晨曦', icon: Sun, description: '温暖的浅色主题' },
  { value: 'dark' as const, label: '月夜', icon: Moon, description: '柔和的深色主题' },
  { value: 'ink' as const, label: '水墨', icon: Cloud, description: '典雅的墨色主题' }
];

const fontSizes = [
  { value: 'small' as const, label: '小' },
  { value: 'medium' as const, label: '中' },
  { value: 'large' as const, label: '大' }
];

export function SettingsPage() {
  const navigate = useNavigate();
  const { theme, fontSize, setTheme, setFontSize } = useSettingsStore();
  const { diaries } = useDiaryStore();
  const { showToast } = useToast();

  const handleExport = async () => {
    try {
      await exportDiaries();
      showToast('导出成功', 'success');
    } catch {
      showToast('导出失败', 'error');
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>返回</span>
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Sun size={18} />
              主题
            </h2>
            <div className={styles.themeGrid}>
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    className={`${styles.themeCard} ${theme === t.value ? styles.active : ''}`}
                    onClick={() => setTheme(t.value)}
                  >
                    <div className={styles.themeIcon} data-theme={t.value}>
                      <Icon size={24} />
                    </div>
                    <div className={styles.themeInfo}>
                      <span className={styles.themeName}>{t.label}</span>
                      <span className={styles.themeDesc}>{t.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Type size={18} />
              字体大小
            </h2>
            <div className={styles.fontSizeGrid}>
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  className={`${styles.fontSizeBtn} ${fontSize === size.value ? styles.active : ''}`}
                  onClick={() => setFontSize(size.value)}
                >
                  <span className={styles.fontSizeLabel}>{size.label}</span>
                  <span className={styles.fontSizePreview} style={{ fontSize: size.value === 'small' ? '14px' : size.value === 'medium' ? '16px' : '18px' }}>
                    静语日记
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Download size={18} />
              数据管理
            </h2>
            <div className={styles.dataCard}>
              <div className={styles.dataInfo}>
                <span className={styles.dataLabel}>日记总数</span>
                <span className={styles.dataValue}>{diaries.length} 篇</span>
              </div>
              <button className={styles.exportBtn} onClick={handleExport}>
                <Download size={16} />
                <span>导出数据</span>
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Info size={18} />
              关于
            </h2>
            <div className={styles.aboutCard}>
              <h3 className={styles.appName}>静语</h3>
              <p className={styles.appDesc}>记录生活，倾听内心</p>
              <p className={styles.appVersion}>版本 1.0.0</p>
              <p className={styles.appNote}>
                一款极简主义风格的个人日记工具，为你创造宁静专注的写作空间。
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
