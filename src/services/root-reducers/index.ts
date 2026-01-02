import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from '../ingredients/ingredients-slice';
import authReducer from '../slices/auth-slice';
import orderReducer from '../slices/order-slice';
import ordersReducer from '../slices/orders-slice';
import burgerConstructorReducer from '../slices/burger-constructor-slice';
import feedReducer from '../slices/feed-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  order: orderReducer,
  orders: ordersReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer
});
