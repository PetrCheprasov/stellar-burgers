import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const feedOrders = useSelector((state) => state.feed.orders);
  const userOrders = useSelector((state) => state.orders.orders);

  const ingredients = useSelector((state) => state.ingredients.items);

  console.log('OrderInfo debug:', {
    orderNumber: number,
    feedOrdersCount: feedOrders.length,
    userOrdersCount: userOrders.length,
    totalIngredients: ingredients.length
  });

  const orderData = useMemo(() => {
    if (!number) return null;

    const orderNumber = parseInt(number);
    if (isNaN(orderNumber)) return null;

    let order = feedOrders.find(o => o.number === orderNumber);

    if (!order) {
      order = userOrders.find(o => o.number === orderNumber);
    }

    console.log('Found order:', order);
    return order;
  }, [number, feedOrders, userOrders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      console.log('Cannot prepare orderInfo:', {
        hasOrderData: !!orderData,
        hasIngredients: ingredients.length > 0
      });
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
            console.log(`Found ingredient: ${ingredient.name} for ID: ${item}`);
          } else {
            console.log(`Ingredient not found: ${item}`);
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    console.log('OrderInfo prepared:', {
      orderNumber: orderData.number,
      ingredientsCount: Object.keys(ingredientsInfo).length,
      total
    });

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    console.log('Showing preloader - orderInfo not ready');
    return <Preloader />;
  }

  console.log('Rendering OrderInfoUI with order #', orderInfo.number);
  return <OrderInfoUI orderInfo={orderInfo} />;
}