import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/orders-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    console.log('ProfileOrders mounted, fetching orders...');
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    console.log('Orders in component:', {
      count: orders.length,
      orders: orders.slice(0, 3) // Покажем первые 3 для отладки
    });
  }, [orders]);

  if (isLoading && orders.length === 0) {
    console.log('Showing loader...');
    return <Preloader />;
  }

  if (error) {
    console.log('Error:', error);
    return <div>Ошибка: {error}</div>;
  }

  if (orders.length === 0) {
    console.log('No orders to show');
    return <div>Заказов нет</div>;
  }

  console.log('Passing', orders.length, 'orders to ProfileOrdersUI');

  return <ProfileOrdersUI orders={orders} />;
};
