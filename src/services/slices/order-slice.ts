import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

interface OrderState {
  orderNumber: number | null;
  orderName: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderNumber: null,
  orderName: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      console.log('Creating order with ingredients:', ingredientIds);
      const response = await orderBurgerApi(ingredientIds);
      console.log('Order creation response:', response);

      if (response.success) {
        return {
          orderNumber: response.order.number,
          orderName: response.name || 'Ваш заказ'
        };
      }
      return rejectWithValue('Ошибка создания заказа');
    } catch (error) {
      console.error('Order creation error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка создания заказа';
      return rejectWithValue(errorMessage);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
      state.orderName = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload.orderNumber;
        state.orderName = action.payload.orderName;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
