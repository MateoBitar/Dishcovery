// useAuth.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  register,
  login,
  logout,
  getUserById,
  updateUser,
} from '../store/slices/authSlice';
import { UpdateUserInput } from '../typings/index';

// useAuth hook
export function useAuth() {
  const dispatch = useAppDispatch();  // Get the Redux dispatch function
  const { user, token, loading, error } = useAppSelector((state) => state.auth);  // Select auth state

  // Register function
  const handleRegister = useCallback(
    async (userData: { username: string; password: string }) => {
      try {
        await dispatch(register(userData)).unwrap();
        return true;
      } catch (err) {
        return false;
      }
    },
    [dispatch]
  );

  // Login function
  const handleLogin = useCallback(
    async (credentials: { username: string; password: string }) => {
      try {
        await dispatch(login(credentials)).unwrap();
        return true;
      } catch (err) {
        return false;
      }
    },
    [dispatch]
  );

  // Logout function
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      return false;
    }
  }, [dispatch]);

  // Get user by ID function
  const handleGetUserById = useCallback(
    async (id: string) => {
      try {
        return await dispatch(getUserById(id)).unwrap();
      } catch (err) {
        console.error('Get user error:', err);
        return null;
      }
    },
    [dispatch]
  );

  // Update user function
  const handleUpdateUser = useCallback(
    async (input: UpdateUserInput) => {
      try {
        return await dispatch(updateUser(input)).unwrap();
      } catch (err) {
        console.error('Update user error:', err);
        return null;
      }
    },
    [dispatch]
  );

  return {
    user,
    token,
    loading,
    error,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    getUserById: handleGetUserById,
    updateUser: handleUpdateUser,
  };
}
