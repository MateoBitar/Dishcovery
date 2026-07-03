//authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient } from '../../api/client';
import * as queries from '../../api/graphql.queries';
import { User, UpdateUserInput } from '../../typings';
import { storage } from '../../utils/storage';

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: storage.getUser(),
  token: storage.getToken(),
  loading: false,
  error: null,
};

// Helper to check token expiry
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false; // no exp claim
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // if decoding fails, treat as expired
  }
}

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await GraphQLClient.request<{ registerUser: User }>(
        queries.REGISTER_MUTATION,
        { input: userData }
      );
      return response.registerUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Registration failed'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await GraphQLClient.request<{
        loginUser: { token: string; user: User };
      }>(queries.LOGIN_MUTATION, { input: credentials });

      const { token, user } = response.loginUser;

      // Check expiry before saving
      if (isTokenExpired(token)) {
        return rejectWithValue('Token is expired. Please log in again.');
      }

      storage.setToken(token);
      storage.setUser(user);

      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Login failed'
      );
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  storage.clearAll();
});

export const getUserById = createAsyncThunk(
  'auth/getUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ getUserById: User }>(
        queries.GET_USER_BY_ID,
        { id }
      );
      return response.getUserById;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch user'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (input: UpdateUserInput, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ updateUser: User }>(
        queries.UPDATE_USER_MUTATION,
        { input }
      );
      const updatedUser = response.updateUser;
      storage.setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Update failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state: AuthState) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state: AuthState) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(login.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state: AuthState, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.fulfilled, (state: AuthState) => {
        state.user = null;
        state.token = null;
        state.error = null;
      })

      // Get User by ID
      .addCase(getUserById.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state: AuthState, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update User
      .addCase(updateUser.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state: AuthState, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
