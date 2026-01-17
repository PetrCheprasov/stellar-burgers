import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface OrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('fetchUserOrders: calling API...');
      const response = await getOrdersApi();
      console.log('fetchUserOrders response:', response);

      if (response && response.success && response.orders) {
        console.log('Orders received:', response.orders.length);
        const sortedOrders = [...response.orders].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return sortedOrders;
      }
      return [];
    } catch (error) {
      console.error('fetchUserOrders error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка загрузки заказов';
      return rejectWithValue(errorMessage);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrderLocally: (state, action) => {
      state.orders.unshift(action.payload);
    },
    clearOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        console.log('Orders in store now:', state.orders.length);
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addOrderLocally, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
