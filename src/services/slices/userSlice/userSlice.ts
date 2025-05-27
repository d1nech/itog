import {
  TRegisterData,
  loginUserApi,
  TLoginData,
  getUserApi,
  getOrdersApi,
  logoutApi,
  updateUserApi,
  registerUserApi
} from '../../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../../../utils/cookie';
import { TOrder, TUser } from '@utils-types';

interface UserState {
  request: boolean;
  error: string | null;
  response: TUser | null;
  registerData: TRegisterData | null;
  userData: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserRequest: boolean;
  userOrders: TOrder[];
}

export const initialState: UserState = {
  request: false,
  error: null,
  response: null,
  registerData: null,
  userData: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false,
  userOrders: []
};

const handleAuthSuccess = (data: any) => {
  if (data.accessToken) {
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data;
};

const handleLogout = async () => {
  await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    return handleAuthSuccess(response);
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: TLoginData) => {
    const response = await loginUserApi(credentials);
    return handleAuthSuccess(response);
  }
);

export const getUser = createAsyncThunk('user/get', getUserApi);

export const getOrdersAll = createAsyncThunk('user/orders', getOrdersApi);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const logoutUser = createAsyncThunk('user/logout', handleLogout);

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    clearUserData: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    getUserState: (state) => state,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.request = true;
        state.error = null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message as string;
        state.isAuthChecked = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.request = false;
        state.error = null;
        state.response = action.payload.user;
        state.userData = action.payload.user;
        state.isAuthChecked = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.isAuthChecked = false;
        state.error = action.error.message as string;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = null;
        state.loginUserRequest = false;
        state.isAuthChecked = false;
        state.isAuthenticated = true;
        state.userData = action.payload.user;
      })
      .addCase(getUser.pending, (state) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.loginUserRequest = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.loginUserRequest = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loginUserRequest = false;
        state.userData = action.payload.user;
        state.isAuthChecked = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.request = false;
        state.error = null;
        state.response = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
        state.request = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthenticated = true;
        state.isAuthChecked = false;
        state.error = action.error.message as string;
        state.request = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.error = null;
        state.request = false;
        state.userData = null;
      })
      .addCase(getOrdersAll.pending, (state) => {
        state.error = null;
        state.request = true;
      })
      .addCase(getOrdersAll.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.request = false;
      })
      .addCase(getOrdersAll.fulfilled, (state, action) => {
        state.error = null;
        state.request = false;
        state.userOrders = action.payload;
      });
  }
});

export const { clearUserData, clearError } = userSlice.actions;
export const { getUserState, getError } = userSlice.selectors;
export default userSlice.reducer;
