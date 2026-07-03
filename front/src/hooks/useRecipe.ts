// useRecipe.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { useUser } from "./useUser";
import {
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getAllPublicRecipes,
  searchRecipesByTitle,
  filterRecipes,
  getUserRecipes,
  getRecipesByIngredients,
  getSavedRecipes,
  saveRecipe,
  unsaveRecipe,
  countSavesForRecipe,
  isRecipeSavedByUser,
  addIngredientToRecipe,
  updateIngredientInRecipe,
  removeIngredientFromRecipe,
} from "../store/slices/recipeSlice";
import { CreateRecipeInput, UpdateRecipeInput, FilterOptions } from "../typings";

// useRecipe hook
export function useRecipe() {
  const dispatch = useAppDispatch();  // Get the Redux dispatch function
  const {
    recipes,
    currentRecipe,
    publicRecipes,
    userRecipes,
    savedRecipes,
    filteredRecipes,
    loading,
    error,
  } = useAppSelector((state) => state.recipes);  // Select recipe state

  const { getUserProfile } = useUser();  // Get user profile function

  // Helper function to convert quantity to number
  const toNumber = (value: string | number) => Number(value);

  // Create recipe function
  const handleCreateRecipe = useCallback(async (input: CreateRecipeInput) => {
    try {
      const formattedInput: CreateRecipeInput = {
        ...input,
        ingredients: input.ingredients?.map((ing) => ({
          ...ing,
          quantity: toNumber(ing.quantity),
        })),
      };
      return await dispatch(createRecipe(formattedInput)).unwrap();
    } catch (err) {
      console.error("Create recipe error:", err);
      return null;
    }
  }, []);

  // Update recipe function
  const handleUpdateRecipe = useCallback(async (id: string, input: UpdateRecipeInput) => {
    try {
      const formattedInput: UpdateRecipeInput = {
        ...input,
        ingredients: input.ingredients?.map((ing) => ({
          ...ing,
          quantity: toNumber(ing.quantity),
        })),
      };
      return await dispatch(updateRecipe({ id, input: formattedInput })).unwrap();
    } catch (err) {
      console.error("Update recipe error:", err);
      return null;
    }
  }, []);

  // Add ingredient to recipe function
  const handleAddIngredientToRecipe = useCallback(
    async (recipeId: string, ingredientId: string, quantity: string | number, unit: string) => {
      try {
        return await dispatch(
          addIngredientToRecipe({ recipeId, ingredientId, quantity: toNumber(quantity), unit })
        ).unwrap();
      } catch (err) {
        console.error("Add ingredient error:", err);
        return null;
      }
    },
    []
  );

  // Update ingredient in recipe function
  const handleUpdateIngredientInRecipe = useCallback(
    async (recipeId: string, ingredientId: string, input: { quantity?: string | number; unit?: string }) => {
      try {
        const formattedInput = {
          ...input,
          quantity: input.quantity !== undefined ? toNumber(input.quantity) : undefined,
        };
        return await dispatch(updateIngredientInRecipe({ recipeId, ingredientId, input: formattedInput })).unwrap();
      } catch (err) {
        console.error("Update ingredient error:", err);
        return null;
      }
    },
    []
  );

  // Get recipe by ID function
  const handleGetRecipeById = useCallback(
    async (id: string) => {
      try { return await dispatch(getRecipeById(id)).unwrap(); } catch (err) { console.error(err); return null; }
    },
    []
  );

  // Delete recipe function
  const handleDeleteRecipe = useCallback(
    async (id: string) => {
      try { await dispatch(deleteRecipe(id)).unwrap(); return true; } catch (err) { console.error(err); return false; }
    }, 
    []
  );

  // Get all public recipes function
  const handleGetAllPublicRecipes = useCallback(
    async () => {
      try { return await dispatch(getAllPublicRecipes()).unwrap(); } catch (err) { console.error(err); return []; }
    }, 
    []
  );

  // Search recipes by title function
  const handleSearchRecipesByTitle = useCallback(
    async (title: string) => {
      try { return await dispatch(searchRecipesByTitle(title)).unwrap(); } catch (err) { console.error(err); return []; }
    }, 
    []
  );

  // Filter recipes function
  const handleFilterRecipes = useCallback(
    async (filters: FilterOptions) => {
      try { return await dispatch(filterRecipes(filters)).unwrap(); } catch (err) { console.error(err); return []; }
    }, 
    []
  );

  // Get user recipes function
  const handleGetUserRecipes = useCallback(
    async (userId: string) => {
      try { return await dispatch(getUserRecipes(userId)).unwrap(); } catch (err) { console.error(err); return []; }
    }, 
    []
  );

  // Get recipes by ingredients function
  const handleGetRecipesByIngredients = useCallback(
    async (ingredientIds: string[]) => {
      try { return await dispatch(getRecipesByIngredients(ingredientIds)).unwrap(); } catch (err) { console.error(err); return []; }
    }, 
    []
  );

  // Get saved recipes function
  const handleGetSavedRecipes = useCallback(
    async (userId: string) => {
      try { return await dispatch(getSavedRecipes(userId)).unwrap(); } catch (err) { console.error(err); return []; }
    }, 
    []
  );

  // Save recipe function
  const handleSaveRecipe = useCallback(
    async (recipeId: string, userId: string) => {
      try { await dispatch(saveRecipe({ recipeId, userId })).unwrap(); await getUserProfile(userId); return true; } catch (err) { console.error(err); return false; }
    }, 
    []
  );

  // Unsave recipe function
  const handleUnsaveRecipe = useCallback(
    async (recipeId: string, userId: string) => {
      try { await dispatch(unsaveRecipe({ recipeId, userId })).unwrap(); await getUserProfile(userId); return true; } catch (err) { console.error(err); return false; }
    }, 
    []
  );

  // Count saves for recipe function
  const handleCountSavesForRecipe = useCallback(
    async (recipeId: string) => {
      try { return await dispatch(countSavesForRecipe(recipeId)).unwrap(); } catch (err) { console.error(err); return null; }
    }, 
    []
  );

  // Check if recipe is saved by user function
  const handleIsRecipeSavedByUser = useCallback(
    async (userId: string, recipeId: string) => {
      try { return await dispatch(isRecipeSavedByUser({ userId, recipeId })).unwrap(); } catch (err) { console.error(err); return false; }
    }, 
    []
  );

  // Remove ingredient from recipe function
  const handleRemoveIngredientFromRecipe = useCallback(
    async (recipeId: string, ingredientId: string) => {
      try { await dispatch(removeIngredientFromRecipe({ recipeId, ingredientId })).unwrap(); return true; } catch (err) { console.error(err); return false; }
    }, 
    []
  );

  return {
    recipes,
    currentRecipe,
    publicRecipes,
    userRecipes,
    savedRecipes,
    filteredRecipes,
    loading,
    error,
    createRecipe: handleCreateRecipe,
    getRecipeById: handleGetRecipeById,
    updateRecipe: handleUpdateRecipe,
    deleteRecipe: handleDeleteRecipe,
    getAllPublicRecipes: handleGetAllPublicRecipes,
    searchRecipesByTitle: handleSearchRecipesByTitle,
    filterRecipes: handleFilterRecipes,
    getUserRecipes: handleGetUserRecipes,
    getRecipesByIngredients: handleGetRecipesByIngredients,
    getSavedRecipes: handleGetSavedRecipes,
    saveRecipe: handleSaveRecipe,
    unsaveRecipe: handleUnsaveRecipe,
    countSavesForRecipe: handleCountSavesForRecipe,
    isRecipeSavedByUser: handleIsRecipeSavedByUser,
    addIngredientToRecipe: handleAddIngredientToRecipe,
    updateIngredientInRecipe: handleUpdateIngredientInRecipe,
    removeIngredientFromRecipe: handleRemoveIngredientFromRecipe,
  };
}
