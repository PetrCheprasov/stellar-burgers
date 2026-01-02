import React, { FC } from 'react';
import styles from './app-header.module.css';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export interface AppHeaderUIProps {
  userName: string | undefined;
  onConstructorClick: () => void;
  onFeedClick: () => void;
  onProfileClick: () => void;
  onLogoutClick?: () => void;
}

export const AppHeaderUI: FC<AppHeaderUIProps> = ({
  userName,
  onConstructorClick,
  onFeedClick,
  onProfileClick,
  onLogoutClick
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <button
          onClick={onConstructorClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <BurgerIcon type={'primary'} />
          <span className='text text_type_main-default ml-2 mr-10'>
            Конструктор
          </span>
        </button>

        <button
          onClick={onFeedClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ListIcon type={'primary'} />
          <span className='text text_type_main-default ml-2'>
            Лента заказов
          </span>
        </button>
      </div>

      <div className={styles.logo}>
        <button
          onClick={onConstructorClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Logo className='' />
        </button>
      </div>

      <div className={styles.link_position_last}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={onProfileClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ProfileIcon type={'primary'} />
            <span className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </span>
          </button>

          {userName && onLogoutClick && (
            <button
              onClick={onLogoutClick}
              className='text text_type_main-default text_color_inactive'
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.05)'
              }}
            >
              Выйти
            </button>
          )}
        </div>
      </div>
    </nav>
  </header>
);
