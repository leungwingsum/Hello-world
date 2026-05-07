import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (date: Date | number | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (isToday(d)) {
    return '今天';
  }
  if (isYesterday(d)) {
    return '昨天';
  }
  
  return format(d, 'yyyy年M月d日', { locale: zhCN });
};

export const formatDateTime = (date: Date | number | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(d, 'yyyy年M月d日 HH:mm', { locale: zhCN });
};

export const formatRelativeTime = (date: Date | number | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return formatDistanceToNow(d, { addSuffix: true, locale: zhCN });
};

export const formatShortDate = (date: Date | number | string): { month: string; day: string; year: string } => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return {
    month: format(d, 'MM'),
    day: format(d, 'dd'),
    year: format(d, 'yyyy')
  };
};
