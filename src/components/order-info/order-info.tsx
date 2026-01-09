import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchFeeds } from '../../services/slices/feed-slice';
import { fetchUserOrders } from '../../services/slices/orders-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const feedOrders = useSelector((state) => state.feed.orders);
  const userOrders = useSelector((state) => state.orders.orders);
  const ingredients = useSelector((state) => state.ingredients.items);
  const isLoadingFeed = useSelector((state) => state.feed.isLoading);
  const isLoadingOrders = useSelector((state) => state.orders.isLoading);
  const isLoadingIngredients = useSelector(
    (state) => state.ingredients.loading
  );

  useEffect(() => {
    const isFeedRoute = location.pathname.startsWith('/feed');
    if (isFeedRoute && feedOrders.length === 0 && !isLoadingFeed) {
      dispatch(fetchFeeds());
    } else if (!isFeedRoute && userOrders.length === 0 && !isLoadingOrders) {
      dispatch(fetchUserOrders());
    }
  }, [
    dispatch,
    location.pathname,
    feedOrders.length,
    userOrders.length,
    isLoadingFeed,
    isLoadingOrders
  ]);

  const orderData = useMemo(() => {
    if (!number) return null;

    const orderNumber = parseInt(number);
    if (isNaN(orderNumber)) return null;

    let order = feedOrders.find((o) => o.number === orderNumber);

    if (!order) {
      order = userOrders.find((o) => o.number === orderNumber);
    }

    return order;
  }, [number, feedOrders, userOrders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
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

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoadingFeed || isLoadingOrders || isLoadingIngredients || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
