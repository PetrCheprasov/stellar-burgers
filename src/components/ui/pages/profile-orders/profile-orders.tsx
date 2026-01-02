import { FC } from 'react';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => {
  console.log('ProfileOrdersUI: orders count', orders?.length);

  return (
    <main className={styles.main}>
      <div className={styles.menu}>
        <ProfileMenu />
      </div>
      <div className={styles.orders}>
        <OrdersList orders={orders} />
      </div>
    </main>
  );
}