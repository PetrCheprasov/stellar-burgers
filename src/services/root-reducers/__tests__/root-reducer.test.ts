import { rootReducer } from '../index';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при вызове с undefined состоянием', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('auth');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('feed');

    expect(initialState.ingredients).toEqual({
      items: [],
      loading: false,
      error: null
    });

    expect(initialState.auth).toMatchObject({
      user: null,
      isAuth: false,
      isAuthChecked: false,
      isLoading: false,
      error: null
    });

    expect(initialState.order).toEqual({
      orderNumber: null,
      orderName: null,
      isLoading: false,
      error: null
    });

    expect(initialState.orders).toHaveProperty('orders');
    expect(initialState.orders).toHaveProperty('isLoading');
    expect(initialState.orders).toHaveProperty('error');

    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(initialState.feed).toHaveProperty('orders');
    expect(initialState.feed).toHaveProperty('total');
    expect(initialState.feed).toHaveProperty('totalToday');
    expect(initialState.feed).toHaveProperty('isLoading');
    expect(initialState.feed).toHaveProperty('error');
  });

  it('должен возвращать то же состояние при обработке неизвестного экшена', () => {
    const state = {
      ingredients: {
        items: [],
        loading: false,
        error: null
      },
      auth: {
        user: null,
        isAuth: false,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      order: {
        orderNumber: null,
        orderName: null,
        isLoading: false,
        error: null
      },
      orders: {
        orders: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      }
    };

    const newState = rootReducer(state, { type: 'UNKNOWN_ACTION' });

    expect(newState).toEqual(state);
  });
});
