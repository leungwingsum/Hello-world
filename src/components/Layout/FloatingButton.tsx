import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import styles from './FloatingButton.module.css';

export function FloatingButton() {
  return (
    <Link to="/editor" className={styles.button} title="新建日记">
      <Plus size={24} />
    </Link>
  );
}
