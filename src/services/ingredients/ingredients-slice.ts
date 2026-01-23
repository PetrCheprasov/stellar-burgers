import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

export interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

export const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    console.log('1. fetchIngredients thunk called!');

    try {
      console.log('2. Calling getIngredientsApi()...');
      const data = await getIngredientsApi();
      console.log('3. API response received:', data);
      console.log('4. Response type:', typeof data);
      console.log('5. Is array?', Array.isArray(data));
      console.log('6. Length:', data?.length || 0);

      return data;
    } catch (error) {
      console.error('7. API error:', error);
      throw error;
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        console.log('Redux: fetchIngredients.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        console.log('Redux: fetchIngredients.fulfilled');
        console.log('Payload:', action.payload);
        console.log('Payload length:', action.payload?.length || 0);

        state.loading = false;
        state.items = action.payload;

        console.log('State after update:', state.items.length);
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        console.log('Redux: fetchIngredients.rejected');
        console.log('Error:', action.error);

        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;

export const selectIngredients = (state: { ingredients: IngredientsState }) =>
  state.ingredients.items;

export const selectIngredientsLoading = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.loading;

export const selectIngredientsError = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.error;

export const selectBuns = createSelector(
  [(state: { ingredients: IngredientsState }) => state.ingredients.items],
  (items) => items.filter((item) => item.type === 'bun')
);

export const selectMains = createSelector(
  [(state: { ingredients: IngredientsState }) => state.ingredients.items],
  (items) => items.filter((item) => item.type === 'main')
);

export const selectSauces = createSelector(
  [(state: { ingredients: IngredientsState }) => state.ingredients.items],
  (items) => items.filter((item) => item.type === 'sauce')
);
