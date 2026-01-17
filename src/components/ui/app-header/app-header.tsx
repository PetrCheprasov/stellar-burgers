import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
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
        <NavLink
          to='/'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
          onClick={onConstructorClick}
        >
          <BurgerIcon type={'primary'} />
          <span className='text text_type_main-default ml-2 mr-10'>
            Конструктор
          </span>
        </NavLink>

        <NavLink
          to='/feed'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
          onClick={onFeedClick}
        >
          <ListIcon type={'primary'} />
          <span className='text text_type_main-default ml-2'>
            Лента заказов
          </span>
        </NavLink>
      </div>

      <div className={styles.logo}>
        <NavLink to='/' onClick={onConstructorClick}>
          <Logo className='' />
        </NavLink>
      </div>

      <div className={styles.link_position_last}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
            onClick={onProfileClick}
          >
            <ProfileIcon type={'primary'} />
            <span className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </span>
          </NavLink>

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
