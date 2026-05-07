import { MoodType } from '../../db';
import { 
  Smile, Frown, Meh, Heart, Sparkles, CloudRain, Battery, Coffee
} from 'lucide-react';
import styles from './MoodSelector.module.css';

const moodConfig: Record<MoodType, { icon: typeof Smile; label: string; color: string }> = {
  peaceful: { icon: Coffee, label: '平静', color: '#8b9dc3' },
  happy: { icon: Smile, label: '愉悦', color: '#f59e0b' },
  sad: { icon: CloudRain, label: '忧伤', color: '#6b7280' },
  anxious: { icon: Battery, label: '焦虑', color: '#a78bfa' },
  grateful: { icon: Heart, label: '感恩', color: '#ec4899' },
  excited: { icon: Sparkles, label: '兴奋', color: '#fbbf24' },
  tired: { icon: Meh, label: '疲惫', color: '#9ca3af' },
  neutral: { icon: Frown, label: '一般', color: '#94a3b8' }
};

interface MoodSelectorProps {
  value: MoodType;
  onChange: (mood: MoodType) => void;
  compact?: boolean;
}

export function MoodSelector({ value, onChange, compact = false }: MoodSelectorProps) {
  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      {!compact && <span className={styles.label}>心情</span>}
      <div className={styles.options}>
        {(Object.keys(moodConfig) as MoodType[]).map((mood) => {
          const config = moodConfig[mood];
          const Icon = config.icon;
          const isSelected = value === mood;
          return (
            <button
              key={mood}
              className={`${styles.option} ${isSelected ? styles.selected : ''}`}
              onClick={() => onChange(mood)}
              title={config.label}
              style={{ '--mood-color': config.color } as React.CSSProperties}
            >
              <Icon size={compact ? 16 : 20} />
              {!compact && <span className={styles.optionLabel}>{config.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function getMoodInfo(mood: MoodType) {
  return moodConfig[mood];
}

export function getMoodIcon(mood: MoodType) {
  const config = moodConfig[mood];
  const Icon = config.icon;
  return <Icon size={20} />;
}
