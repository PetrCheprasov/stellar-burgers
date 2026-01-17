import {
  ingredientsReducer,
  fetchIngredients,
  IngredientsState
} from '../ingredients-slice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  }
];

describe('ingredients reducer', () => {
  const initialState: IngredientsState = {
    items: [],
    loading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients.pending', () => {
    it('должен установить loading в true при начале запроса', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.items).toEqual([]);
    });

    it('должен очистить ошибку при начале нового запроса', () => {
      const stateWithError: IngredientsState = {
        items: [],
        loading: false,
        error: 'Предыдущая ошибка'
      };

      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен установить loading в false и сохранить ингредиенты при успешном запросе', () => {
      const stateWithLoading: IngredientsState = {
        items: [],
        loading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(3);
    });

    it('должен заменить существующие ингредиенты новыми', () => {
      const stateWithItems: IngredientsState = {
        items: [mockIngredients[0]],
        loading: true,
        error: null
      };

      const newIngredients = [mockIngredients[1], mockIngredients[2]];
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: newIngredients
      };
      const state = ingredientsReducer(stateWithItems, action);

      expect(state.items).toEqual(newIngredients);
      expect(state.items).toHaveLength(2);
      expect(state.items[0]._id).toBe(mockIngredients[1]._id);
    });

    it('должен обработать пустой массив ингредиентов', () => {
      const stateWithLoading: IngredientsState = {
        items: mockIngredients,
        loading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: []
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual([]);
      expect(state.items).toHaveLength(0);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен установить loading в false и сохранить ошибку при неудачном запросе', () => {
      const stateWithLoading: IngredientsState = {
        items: [],
        loading: true,
        error: null
      };

      const errorMessage = 'Ошибка сети';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });

    it('должен установить дефолтное сообщение об ошибке, если сообщение отсутствует', () => {
      const stateWithLoading: IngredientsState = {
        items: [],
        loading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки');
    });

    it('не должен изменять существующие ингредиенты при ошибке', () => {
      const stateWithItems: IngredientsState = {
        items: mockIngredients,
        loading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка загрузки' }
      };
      const state = ingredientsReducer(stateWithItems, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки');
      expect(state.items).toEqual(mockIngredients);
    });
  });
});
