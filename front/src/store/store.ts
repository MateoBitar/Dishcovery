// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import recipeReducer from './slices/recipeSlice';
import ingredientReducer from './slices/ingredientSlice';
import userReducer from './slices/userSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
    ingredients: ingredientReducer,
    user: userReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
