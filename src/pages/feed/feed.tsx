// src/pages/feed/feed.tsx (страница)
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { orders, total, totalToday, isLoading, error } = useSelector(
    (state) => state.feed
  );

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p className='text text_type_main-medium'>Ошибка загрузки</p>
        <p className='text text_type_main-default text_color_inactive mt-2'>
          {error}
        </p>
        <button
          className='text text_type_main-default mt-4'
          onClick={() => dispatch(fetchFeeds())}
          style={{
            padding: '10px 20px',
            background: 'rgba(76, 76, 255, 0.2)',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p className='text text_type_main-medium'>Лента заказов пуста</p>
      </div>
    );
  }

  return (
    <FeedUI 
      orders={orders} 
      handleGetFeeds={() => dispatch(fetchFeeds())}
      total={total}
      totalToday={totalToday}
    />
  );
};