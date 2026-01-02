import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  getUserApi,
  logoutApi,
  registerUserApi,
  loginUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TLoginData = {
  email: string;
  password: string;
};

interface AuthState {
  user: TUser | null;
  isAuth: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getCookie('accessToken');

      if (!accessToken) {
        console.log('No access token found');
        return null;
      }

      console.log('Checking auth with token:', accessToken);
      const data = await getUserApi();
      console.log('Auth check successful:', data.user);
      return data.user;
    } catch (error: any) {
      console.error('Auth check failed:', error);
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');

      return rejectWithValue(error.message || 'Ошибка проверки авторизации');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      console.log('Register attempt:', data.email);
      const response = await registerUserApi(data);

      if (response.success) {
        const token = response.accessToken.split('Bearer ')[1];
        console.log('Registration successful, setting token:', token);
        setCookie('accessToken', token);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      }

      return rejectWithValue('Ошибка регистрации');
    } catch (error: any) {
      console.error('Registration error:', error);
      return rejectWithValue(error.message || 'Ошибка регистрации');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      console.log('Login attempt:', data.email);
      const response = await loginUserApi(data);

      console.log('Login response:', response);

      if (response.success) {
        const token = response.accessToken.split('Bearer ')[1];
        console.log('Raw token from response:', response.accessToken);
        console.log('Token after split:', token);
        console.log('Setting cookie with token...');

        setCookie('accessToken', token);
        localStorage.setItem('refreshToken', response.refreshToken);

        console.log('Cookie after set:', document.cookie);

        return response.user;
      }

      return rejectWithValue('Ошибка авторизации');
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.message || 'Ошибка авторизации');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Logout attempt');
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      console.log('Logout successful');
      return null;
    } catch (error: any) {
      console.error('Logout error:', error);
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.message || 'Ошибка выхода');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TUser>, { rejectWithValue }) => {
    try {
      console.log('Updating user with data:', data);
      const response = await updateUserApi(data);
      console.log('Update response:', response);
      return response.user;
    } catch (error: any) {
      console.error('Update error:', error);
      return rejectWithValue(error.message || 'Ошибка обновления данных');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi({ email });
      return response.success;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка восстановления пароля');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(data);
      return response.success;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка сброса пароля');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = !!action.payload;
    },
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = !!action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuth = false;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.isAuth = false;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { setUser, setAuthChecked, clearError } = authSlice.actions;
export default authSlice.reducer;
