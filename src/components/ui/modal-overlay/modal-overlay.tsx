import styles from './modal-overlay.module.css';
import { FC } from 'react';

export const ModalOverlayUI: FC<{ onClick: () => void }> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClick();
    }
  };

  return <div className={styles.overlay} onClick={handleClick} />;
};