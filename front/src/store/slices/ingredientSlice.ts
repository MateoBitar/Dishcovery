// ingredientSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient } from '../../api/client';
import * as queries from '../../api/graphql.queries';
import { Ingredient, CreateIngredientInput, UpdateIngredientInput } from '../../typings';

// Ingredient state interface
interface IngredientState {
  ingredients: Ingredient[];
  currentIngredient: Ingredient | null;
  filteredIngredients: Ingredient[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: IngredientState = {
  ingredients: [],
  currentIngredient: null,
  filteredIngredients: [],
  loading: false,
  error: null,
};

// Async thunks
export const createIngredient = createAsyncThunk(
  'ingredients/create',
  async (input: CreateIngredientInput, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ createIngredient: Ingredient }>(
        queries.CREATE_INGREDIENT_MUTATION,
        { input }
      );
      return response.createIngredient;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create ingredient'
      );
    }
  }
);

export const getIngredientById = createAsyncThunk(
  'ingredients/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ getIngredientById: Ingredient }>(
        queries.GET_INGREDIENT_BY_ID,
        { ingredient_id: id }
      );
      return response.getIngredientById;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch ingredient'
      );
    }
  }
);

export const updateIngredient = createAsyncThunk(
  'ingredients/update',
  async (
    { id, input }: { id: string; input: UpdateIngredientInput },
    { rejectWithValue }
  ) => {
    try {
      const response = await GraphQLClient.request<{ updateIngredient: Ingredient }>(
        queries.UPDATE_INGREDIENT_MUTATION,
        { ingredient_id: id, input }
      );
      return response.updateIngredient;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update ingredient'
      );
    }
  }
);

export const deleteIngredient = createAsyncThunk(
  'ingredients/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ deleteIngredient: boolean }>(
        queries.DELETE_INGREDIENT_MUTATION,
        { ingredient_id: id }
      );
      if (response.deleteIngredient) {
        return id;
      }
      return rejectWithValue('Delete ingredient failed');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete ingredient'
      );
    }
  }
);

export const getAllIngredients = createAsyncThunk(
  'ingredients/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ getAllIngredients: Ingredient[] }>(
        queries.GET_ALL_INGREDIENTS
      );
      return response.getAllIngredients;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch ingredients'
      );
    }
  }
);

export const getIngredientByName = createAsyncThunk(
  'ingredients/getByName',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ getIngredientByName: Ingredient[] }>(
        queries.GET_INGREDIENT_BY_NAME,
        { name }
      );
      return response.getIngredientByName;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch ingredient'
      );
    }
  }
);

export const getIngredientsByCategory = createAsyncThunk(
  'ingredients/getByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ getIngredientsByCategory: Ingredient[] }>(
        queries.GET_INGREDIENTS_BY_CATEGORY,
        { category }
      );
      return response.getIngredientsByCategory;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch ingredients'
      );
    }
  }
);

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearError: (state: IngredientState) => {
      state.error = null;
    },
    clearCurrentIngredient: (state: IngredientState) => {
      state.currentIngredient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Ingredient
      .addCase(createIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients.push(action.payload);
      })
      .addCase(createIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Ingredient by ID
      .addCase(getIngredientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIngredient = action.payload;
      })
      .addCase(getIngredientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Ingredient
      .addCase(updateIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIngredient = action.payload;
        const index = state.ingredients.findIndex(
          (i) => i.ingredient_id === action.payload.ingredient_id
        );
        if (index !== -1) {
          state.ingredients[index] = action.payload;
        }
      })
      .addCase(updateIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Ingredient
      .addCase(deleteIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = state.ingredients.filter(
          (i) => i.ingredient_id !== action.payload
        );
      })
      .addCase(deleteIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get All Ingredients
      .addCase(getAllIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(getAllIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Ingredient by Name
      .addCase(getIngredientByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientByName.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredIngredients = action.payload;
      })
      .addCase(getIngredientByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Ingredients by Category
      .addCase(getIngredientsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredIngredients = action.payload;
      })
      .addCase(getIngredientsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentIngredient } = ingredientSlice.actions;
export default ingredientSlice.reducer;