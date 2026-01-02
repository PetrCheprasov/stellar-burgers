import { FC, memo, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const ingredients = useSelector((state) => state.ingredients.items);
  
  const handleCardClick = () => {
    if (location.pathname.startsWith('/feed')) {
      navigate(`/feed/${order.number}`, { 
        state: { background: location } 
      });
    } else if (location.pathname.startsWith('/profile/orders')) {
      navigate(`/profile/orders/${order.number}`, { 
        state: { background: location } 
      });
    }
  };
  
  const orderInfo = useMemo(() => {
    if (!ingredients || ingredients.length === 0) {
      return null;
    }
    
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        return ingredient ? [...acc, ingredient] : acc;
      },
      []
    );

    if (ingredientsInfo.length === 0) {
      return null;
    }

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains = ingredientsInfo.length > maxIngredients 
      ? ingredientsInfo.length - maxIngredients 
      : 0;
    const date = new Date(order.createdAt);
    
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    return (
      <div 
        onClick={handleCardClick}
        style={{ 
          border: '1px solid #4C4CFF', 
          padding: '15px', 
          margin: '10px',
          borderRadius: '10px',
          backgroundColor: '#1C1C21',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#F2F2F3', fontWeight: 'bold' }}>
            #{order.number}
          </span>
          <span style={{ color: '#8585AD' }}>
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 style={{ color: '#F2F2F3', margin: '8px 0' }}>{order.name}</h3>
        <p style={{ color: order.status === 'done' ? '#00CCCC' : '#F2F2F3' }}>
          Статус: {order.status === 'done' ? 'Выполнен' : 'Готовится'}
        </p>
        <p style={{ color: '#8585AD', fontSize: '14px' }}>
          Ингредиенты: {order.ingredients?.length || 0} (не загружены)
        </p>
      </div>
    );
  }

  return (
    <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <OrderCardUI
        orderInfo={orderInfo}
        maxIngredients={maxIngredients}
        locationState={{ background: location }}
      />
    </div>
  );
});