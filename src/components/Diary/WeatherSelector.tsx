import { WeatherType } from '../../db';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudLightning } from 'lucide-react';
import styles from './WeatherSelector.module.css';

const weatherConfig: Record<WeatherType, { icon: typeof Sun; label: string; color: string }> = {
  sunny: { icon: Sun, label: '晴', color: '#fbbf24' },
  cloudy: { icon: Cloud, label: '阴', color: '#94a3b8' },
  rainy: { icon: CloudRain, label: '雨', color: '#60a5fa' },
  snowy: { icon: CloudSnow, label: '雪', color: '#e0f2fe' },
  windy: { icon: Wind, label: '风', color: '#a3e635' },
  stormy: { icon: CloudLightning, label: '雷暴', color: '#a78bfa' }
};

interface WeatherSelectorProps {
  value: WeatherType;
  onChange: (weather: WeatherType) => void;
  compact?: boolean;
}

export function WeatherSelector({ value, onChange, compact = false }: WeatherSelectorProps) {
  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      {!compact && <span className={styles.label}>天气</span>}
      <div className={styles.options}>
        {(Object.keys(weatherConfig) as WeatherType[]).map((weather) => {
          const config = weatherConfig[weather];
          const Icon = config.icon;
          const isSelected = value === weather;
          return (
            <button
              key={weather}
              className={`${styles.option} ${isSelected ? styles.selected : ''}`}
              onClick={() => onChange(weather)}
              title={config.label}
              style={{ '--weather-color': config.color } as React.CSSProperties}
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

export function getWeatherInfo(weather: WeatherType) {
  return weatherConfig[weather];
}

export function getWeatherIcon(weather: WeatherType) {
  const config = weatherConfig[weather];
  const Icon = config.icon;
  return <Icon size={20} />;
}
