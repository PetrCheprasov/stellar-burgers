import burgerConstructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from '../burger-constructor-slice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockIngredient: TIngredient = {
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
};

const mockSauce: TIngredient = {
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
};

describe('burgerConstructor reducer', () => {
  it('должен вернуть начальное состояние', () => {
    expect(burgerConstructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addBun', () => {
    it('должен добавить булку в конструктор', () => {
      const action = addBun(mockBun);
      const state = burgerConstructorReducer(initialState, action);

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('должен заменить существующую булку новой', () => {
      const newBun: TIngredient = {
        ...mockBun,
        _id: '643d69a5c3f7b9001cfa0945',
        name: 'Флюоресцентная булка R2-D3'
      };

      const stateWithBun = burgerConstructorReducer(
        initialState,
        addBun(mockBun)
      );
      const state = burgerConstructorReducer(stateWithBun, addBun(newBun));

      expect(state.bun).toEqual(newBun);
      expect(state.bun?._id).toBe(newBun._id);
    });
  });

  describe('addIngredient', () => {
    it('должен добавить ингредиент в конструктор', () => {
      const action = addIngredient(mockIngredient);
      const state = burgerConstructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockIngredient,
        id: expect.stringContaining(mockIngredient._id)
      });
    });

    it('должен добавить несколько ингредиентов в конструктор', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]).toMatchObject({
        ...mockIngredient,
        id: expect.stringContaining(mockIngredient._id)
      });
      expect(state.ingredients[1]).toMatchObject({
        ...mockSauce,
        id: expect.stringContaining(mockSauce._id)
      });
    });

    it('должен создать уникальный id для каждого ингредиента', () => {
      // Мокаем Date.now() чтобы гарантировать разные значения
      const originalDateNow = Date.now;
      let callCount = 0;
      const timestamps = [1000, 2000];
      
      Date.now = jest.fn(() => timestamps[callCount++]);
      
      try {
        let state = burgerConstructorReducer(
          initialState,
          addIngredient(mockIngredient)
        );
        state = burgerConstructorReducer(state, addIngredient(mockIngredient));

        expect(state.ingredients).toHaveLength(2);
        expect(state.ingredients[0].id).toBe(`${mockIngredient._id}-1000`);
        expect(state.ingredients[1].id).toBe(`${mockIngredient._id}-2000`);
        expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
      } finally {
        Date.now = originalDateNow;
      }
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент из конструктора по id', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      const ingredientId = state.ingredients[0].id;
      state = burgerConstructorReducer(state, removeIngredient(ingredientId));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockSauce._id);
    });

    it('должен удалить правильный ингредиент при наличии нескольких', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(mockSauce));
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));

      const secondIngredientId = state.ingredients[1].id;
      state = burgerConstructorReducer(state, removeIngredient(secondIngredientId));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe(mockIngredient._id);
      expect(state.ingredients[1]._id).toBe(mockIngredient._id);
    });

    it('не должен изменить состояние, если ингредиент с таким id не найден', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );

      const previousState = { ...state };
      state = burgerConstructorReducer(
        state,
        removeIngredient('non-existent-id')
      );

      expect(state).toEqual(previousState);
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент с одного места на другое', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(mockSauce));
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));

      // Перемещаем первый ингредиент на последнюю позицию
      state = burgerConstructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]._id).toBe(mockSauce._id);
      expect(state.ingredients[2]._id).toBe(mockIngredient._id);
    });

    it('должен переместить ингредиент в начало списка', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      // Перемещаем последний ингредиент в начало
      state = burgerConstructorReducer(
        state,
        moveIngredient({ fromIndex: 1, toIndex: 0 })
      );

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe(mockSauce._id);
      expect(state.ingredients[1]._id).toBe(mockIngredient._id);
    });

    it('не должен изменить порядок при одинаковых индексах', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      const previousOrder = state.ingredients.map((ing) => ing._id);
      state = burgerConstructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 0 })
      );

      expect(state.ingredients.map((ing) => ing._id)).toEqual(previousOrder);
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор от всех ингредиентов и булки', () => {
      let state = burgerConstructorReducer(initialState, addBun(mockBun));
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));
      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      state = burgerConstructorReducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });
  });
});
