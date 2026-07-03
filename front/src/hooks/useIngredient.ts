// useIngredient.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  createIngredient,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
  getAllIngredients,
  getIngredientByName,
  getIngredientsByCategory,
} from '../store/slices/ingredientSlice';
import { CreateIngredientInput, UpdateIngredientInput } from '../typings';

// useIngredient hook
export function useIngredient() {
  const dispatch = useAppDispatch();  // Get the Redux dispatch function
  const { ingredients, currentIngredient, filteredIngredients, loading, error } =
    useAppSelector((state) => state.ingredients);  // Select ingredient state

  // Create ingredient function
  const handleCreateIngredient = useCallback(
    async (input: CreateIngredientInput) => {
      try {
        return await dispatch(createIngredient(input)).unwrap();
      } catch (err) {
        console.error('Create ingredient error:', err);
        return null;
      }
    },
    []
  );

  // Get ingredient by ID function
  const handleGetIngredientById = useCallback(
    async (id: string) => {
      try {
        return await dispatch(getIngredientById(id)).unwrap();
      } catch (err) {
        console.error('Get ingredient error:', err);
        return null;
      }
    },
    []
  );

  // Update ingredient function
  const handleUpdateIngredient = useCallback(
    async (id: string, input: UpdateIngredientInput) => {
      try {
        return await dispatch(updateIngredient({ id, input })).unwrap();
      } catch (err) {
        console.error('Update ingredient error:', err);
        return null;
      }
    },
    []
  );

  // Delete ingredient function
  const handleDeleteIngredient = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteIngredient(id)).unwrap();
        return true;
      } catch (err) {
        console.error('Delete ingredient error:', err);
        return false;
      }
    },
    []
  );

  // Get all ingredients function
  const handleGetAllIngredients = useCallback(
    async () => {
      try {
        return await dispatch(getAllIngredients()).unwrap();
      } catch (err) {
        console.error('Get all ingredients error:', err);
        return [];
      }
    }, 
    []
  );

  // Get ingredient by name function
  const handleGetIngredientByName = useCallback(
    async (name: string) => {
      try {
        return await dispatch(getIngredientByName(name)).unwrap();
      } catch (err) {
        console.error('Get ingredient by name error:', err);
        return null;
      }
    },
    []
  );

  // Get ingredients by category function
  const handleGetIngredientsByCategory = useCallback(
    async (category: string) => {
      try {
        return await dispatch(getIngredientsByCategory(category)).unwrap();
      } catch (err) {
        console.error('Get ingredients by category error:', err);
        return [];
      }
    },
    []
  );

  return {
    ingredients,
    currentIngredient,
    filteredIngredients,
    loading,
    error,
    createIngredient: handleCreateIngredient,
    getIngredientById: handleGetIngredientById,
    updateIngredient: handleUpdateIngredient,
    deleteIngredient: handleDeleteIngredient,
    getAllIngredients: handleGetAllIngredients,
    getIngredientByName: handleGetIngredientByName,
    getIngredientsByCategory: handleGetIngredientsByCategory,
  };
}
