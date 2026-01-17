import { FC, memo, useCallback } from 'react';
import styles from './modal.module.css';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => {
    const handleButtonClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
      },
      [onClose]
    );
    const handleModalClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    return (
      <>
        <div className={styles.modal} onClick={handleModalClick}>
          <div className={styles.header}>
            <h3 className={`${styles.title} text text_type_main-large`}>
              {title}
            </h3>
            <button
              className={styles.button}
              type='button'
              onClick={handleButtonClick}
            >
              <CloseIcon type='primary' />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <ModalOverlayUI onClick={onClose} />
      </>
    );
  }
);
