import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore';
import { ToastContainer, ToastData } from '../Common/Toast';
import { useState, createContext, useContext } from 'react';
import styles from './Layout.module.css';

interface ToastContextType {
  showToast: (message: string, type?: ToastData['type']) => void;
}

export const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { loadSettings, isLoaded } = useSettingsStore();
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const showToast = (message: string, type: ToastData['type'] = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const closeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (!isLoaded) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className={styles.layout}>
        {children}
        <Outlet />
        <ToastContainer toasts={toasts} onClose={closeToast} />
      </div>
    </ToastContext.Provider>
  );
}
