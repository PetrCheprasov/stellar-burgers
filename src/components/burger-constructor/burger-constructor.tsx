import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearOrder } from '../../services/slices/order-slice';
import { clearConstructor } from '../../services/slices/burger-constructor-slice';
import {
  addOrderLocally,
  fetchUserOrders
} from '../../services/slices/orders-slice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const constructorItems = useSelector((store) => store.burgerConstructor);
  const {
    orderNumber,
    orderName,
    isLoading: orderRequest
  } = useSelector((store) => store.order);
  const user = useSelector((store) => store.auth?.user);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ing: TConstructorIngredient) => ing._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then((response) => {
        console.log('Order created successfully:', response);

        dispatch(clearConstructor());
        const newOrder = {
          _id: `temp-${Date.now()}`,
          ingredients: ingredientIds,
          status: 'done',
          name: orderName || 'Ваш заказ готовится',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          number: orderNumber || response.orderNumber
        };

        dispatch(addOrderLocally(newOrder));

        setTimeout(() => {
          dispatch(fetchUserOrders());
        }, 1000);
      })
      .catch((error: any) => {
        console.error('Ошибка при создании заказа:', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const orderModalData = orderNumber ? { number: orderNumber } : null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
