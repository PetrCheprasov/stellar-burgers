import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      console.log('fetchFeeds: calling API...');
      const response = await getFeedsApi();
      console.log('fetchFeeds response:', response);

      if (response && response.success) {
        return {
          orders: response.orders || [],
          total: response.total || 0,
          totalToday: response.totalToday || 0
        };
      }
      return rejectWithValue('Неверный формат ответа');
    } catch (error) {
      console.error('fetchFeeds error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки ленты заказов';
      return rejectWithValue(errorMessage);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        console.log(
          'Feed state updated:',
          action.payload.orders.length,
          'orders'
        );
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default feedSlice.reducer;
