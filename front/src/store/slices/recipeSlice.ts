// recipeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient } from '../../api/client';
import * as queries from '../../api/graphql.queries';
import { Recipe, CreateRecipeInput, UpdateRecipeInput, FilterOptions } from '../../typings';

// Recipe state interface
interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  publicRecipes: Recipe[];
  userRecipes: Recipe[];
  savedRecipes: Recipe[];
  filteredRecipes: Recipe[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: RecipeState = {
  recipes: [],
  currentRecipe: null,
  publicRecipes: [],
  userRecipes: [],
  savedRecipes: [],
  filteredRecipes: [],
  loading: false,
  error: null,
};

// Async thunks
export const createRecipe = createAsyncThunk(
  'recipes/create',
  async (input: CreateRecipeInput, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ createRecipe: Recipe }>(
        queries.CREATE_RECIPE_MUTATION,
        { input }
      );
      return response.createRecipe;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create recipe'
      );
    }
  }
);

export const getRecipeById = createAsyncThunk(
  'recipes/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ getRecipeById: Recipe }>(
        queries.GET_RECIPE_BY_ID,
        { recipe_id: id }
      );
      return response.getRecipeById;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch recipe'
      );
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/update',
  async (
    { id, input }: { id: string; input: UpdateRecipeInput },
    { rejectWithValue }
  ) => {
    try {
      const response = await GraphQLClient.request<{ updateRecipe: Recipe }>(
        queries.UPDATE_RECIPE_MUTATION,
        { recipe_id: id, input }
      );
      return response.updateRecipe;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update recipe'
      );
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ deleteRecipe: boolean }>(
        queries.DELETE_RECIPE_MUTATION,
        { recipe_id: id }
      );
      if (response.deleteRecipe) return id;
      return rejectWithValue('Delete recipe failed');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete recipe'
      );
    }
  }
);

export const getAllPublicRecipes = createAsyncThunk(
  'recipes/getAllPublic',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{
        getAllPublicRecipes: Recipe[];
      }>(queries.GET_ALL_PUBLIC_RECIPES);
      return response.getAllPublicRecipes;
    } catch (error) {
        console.error('getAllPublicRecipes error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch recipes'
      );
    }
  }
);

export const searchRecipesByTitle = createAsyncThunk(
  'recipes/search',
  async (title: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{
        searchRecipesByTitle: Recipe[];
      }>(queries.SEARCH_RECIPES_BY_TITLE, { title });
      return response.searchRecipesByTitle;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to search recipes'
      );
    }
  }
);

export const filterRecipes = createAsyncThunk(
  'recipes/filter',
  async (filters: FilterOptions, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ filterRecipes: Recipe[] }>(
        queries.FILTER_RECIPES,
        { input: filters }
      );
      return response.filterRecipes;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to filter recipes'
      );
    }
  }
);

export const getUserRecipes = createAsyncThunk(
  'recipes/getUserRecipes',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{
        getUserRecipes: Recipe[];
      }>(queries.GET_USER_RECIPES, { user_id: userId });
      return response.getUserRecipes;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch user recipes'
      );
    }
  }
);

export const getRecipesByIngredients = createAsyncThunk(
  'recipes/getByIngredients',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const fixedIds = ingredientIds.map(String);

      const response = await GraphQLClient.request<{
        getRecipesByIngredients: Recipe[];
      }>(queries.GET_RECIPES_BY_INGREDIENTS, { ingredientIds: fixedIds });

      return response.getRecipesByIngredients;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch recipes'
      );
    }
  }
);


export const getSavedRecipes = createAsyncThunk(
  'recipes/getSaved',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{
        getSavedRecipes: Recipe[];
      }>(queries.GET_SAVED_RECIPES, { user_id: userId });
      return response.getSavedRecipes;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch saved recipes'
      );
    }
  }
);

export const saveRecipe = createAsyncThunk(
  'recipes/save',
  async (
    { recipeId, userId }: { recipeId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      await GraphQLClient.request<{ saveRecipe: { recipe_id: string; user_id: string } }>(
        queries.SAVE_RECIPE_MUTATION,
        { recipe_id: recipeId, user_id: userId }
      );
      return recipeId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to save recipe'
      );
    }
  }
);

export const unsaveRecipe = createAsyncThunk(
  'recipes/unsave',
  async (
    { recipeId, userId }: { recipeId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await GraphQLClient.request<{ unsaveRecipe: boolean }>(
        queries.UNSAVE_RECIPE_MUTATION,
        { recipe_id: recipeId, user_id: userId }
      );
      if (response.unsaveRecipe) return recipeId;
      return rejectWithValue('Failed to unsave recipe');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to unsave recipe'
      );
    }
  }
);

export const countSavesForRecipe = createAsyncThunk(
  'recipes/countSaves',
  async (recipeId: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{
        countSavesForRecipe: number;
      }>(queries.COUNT_SAVES_FOR_RECIPE, { recipe_id: recipeId });
      return { recipeId, count: response.countSavesForRecipe };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to count saves'
      );
    }
  }
);

export const isRecipeSavedByUser = createAsyncThunk(
  "recipe/isRecipeSavedByUser",
  async (
    { userId, recipeId }: { userId: string; recipeId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await GraphQLClient.request<{ isRecipeSavedByUser: boolean }>(
        queries.IS_RECIPE_SAVED,
        { user_id: userId, recipe_id: recipeId }
      );
      return response.isRecipeSavedByUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to check saved status"
      );
    }
  }
);

export const addIngredientToRecipe = createAsyncThunk(
  'recipes/addIngredient',
  async (
    {
      recipeId,
      ingredientId,
      quantity,
      unit,
    }: {
      recipeId: string;
      ingredientId: string;
      quantity: number;
      unit: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await GraphQLClient.request<{ addIngredientToRecipe: any }>(
        queries.ADD_INGREDIENT_TO_RECIPE,
        { recipe_id: recipeId, ingredient_id: ingredientId, quantity, unit }
      );
      return response.addIngredientToRecipe;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to add ingredient'
      );
    }
  }
);

export const updateIngredientInRecipe = createAsyncThunk(
  'recipes/updateIngredient',
  async (
    {
      recipeId,
      ingredientId,
      input,
    }: {
      recipeId: string;
      ingredientId: string;
      input: { quantity?: number; unit?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await GraphQLClient.request<{
        updateIngredientInRecipe: any;
      }>(queries.UPDATE_INGREDIENT_IN_RECIPE, { recipe_id: recipeId, ingredient_id: ingredientId, input });
      return response.updateIngredientInRecipe;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update ingredient'
      );
    }
  }
);

export const removeIngredientFromRecipe = createAsyncThunk(
  'recipes/removeIngredient',
  async (
    { recipeId, ingredientId }: { recipeId: string; ingredientId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await GraphQLClient.request<{ removeIngredientFromRecipe: boolean }>(
        queries.REMOVE_INGREDIENT_FROM_RECIPE,
        { recipe_id: recipeId, ingredient_id: ingredientId }
      );
      if (response.removeIngredientFromRecipe) return { recipeId, ingredientId };
      return rejectWithValue('Failed to remove ingredient');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to remove ingredient'
      );
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearError: (state: RecipeState) => {
      state.error = null;
    },
    clearCurrentRecipe: (state: RecipeState) => {
      state.currentRecipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Recipe
      .addCase(createRecipe.pending, (state: RecipeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.recipes.push(action.payload);
        state.userRecipes.push(action.payload);
      })
      .addCase(createRecipe.rejected, (state: RecipeState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Recipe by ID
      .addCase(getRecipeById.pending, (state: RecipeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecipeById.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(getRecipeById.rejected, (state: RecipeState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Recipe
      .addCase(updateRecipe.pending, (state: RecipeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecipe.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
        const index = state.recipes.findIndex(
          (r) => r.recipe_id === action.payload.recipe_id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      })
      .addCase(updateRecipe.rejected, (state: RecipeState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Recipe
      .addCase(deleteRecipe.pending, (state: RecipeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.recipes = state.recipes.filter(
          (r) => r.recipe_id !== action.payload
        );
        state.userRecipes = state.userRecipes.filter(
          (r) => r.recipe_id !== action.payload
        );
      })
      .addCase(deleteRecipe.rejected, (state: RecipeState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get All Public Recipes
      .addCase(getAllPublicRecipes.pending, (state: RecipeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPublicRecipes.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.publicRecipes = action.payload;
      })
      .addCase(getAllPublicRecipes.rejected, (state: RecipeState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Search Recipes
      .addCase(searchRecipesByTitle.pending, (state: RecipeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRecipesByTitle.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.filteredRecipes = action.payload;
      })
      .addCase(searchRecipesByTitle.rejected, (state: RecipeState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Filter Recipes
      .addCase(filterRecipes.pending, (state: RecipeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterRecipes.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.filteredRecipes = action.payload;
      })
      .addCase(filterRecipes.rejected, (state: RecipeState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get User Recipes
      .addCase(getUserRecipes.pending, (state: RecipeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserRecipes.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.userRecipes = action.payload;
      })
      .addCase(getUserRecipes.rejected, (state: RecipeState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Recipes by Ingredients
      .addCase(getRecipesByIngredients.pending, (state: RecipeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecipesByIngredients.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.filteredRecipes = action.payload;
      })
      .addCase(getRecipesByIngredients.rejected, (state: RecipeState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Saved Recipes
      .addCase(getSavedRecipes.pending, (state: RecipeState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSavedRecipes.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.savedRecipes = action.payload;
      })
      .addCase(getSavedRecipes.rejected, (state: RecipeState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Save Recipe
      .addCase(saveRecipe.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        const savedRecipe = state.recipes.find(r => r.recipe_id === action.payload);
        if (savedRecipe && !state.savedRecipes.find(r => r.recipe_id === savedRecipe.recipe_id)) {
          state.savedRecipes.push(savedRecipe);
        }
      })

      // Unsave Recipe
      .addCase(unsaveRecipe.fulfilled, (state: RecipeState, action) => {
        state.loading = false;
        state.savedRecipes = state.savedRecipes.filter(
          r => r.recipe_id !== action.payload
        );
      })

      // Is Recipe Saved
      .addCase(isRecipeSavedByUser.fulfilled, () => {

      });
  },
});

export const { clearError, clearCurrentRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
