import { exportAllDiaries } from '../db';

export const exportDiaries = async (): Promise<void> => {
  try {
    const data = await exportAllDiaries();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:-]/g, '').replace('T', '_').split('.')[0];
    const filename = `静语日记_${timestamp}.json`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    throw new Error('导出失败');
  }
};
