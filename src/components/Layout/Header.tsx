import { Link, useLocation } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {isHome ? (
          <div className={styles.left}>
            <h1 className={styles.logo}>静语</h1>
            <span className={styles.tagline}>记录生活，倾听内心</span>
          </div>
        ) : (
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>返回</span>
          </Link>
        )}

        <nav className={styles.nav}>
          <Link to="/settings" className={styles.navLink} title="设置">
            <Settings size={22} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
