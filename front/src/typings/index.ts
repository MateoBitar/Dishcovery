// index.ts
// Types and Interfaces for Dishcovery App - Coherent with Backend

// User interface
export interface User {
  user_id: string;
  username: string;
  user_desc?: string;
  diet_pref?: string;
}

// Input for updating user details
export interface UpdateUserInput {
  username?: string;
  user_desc?: string;
  diet_pref?: string;
  password?: string;
}

// Authentication response
export interface AuthResponse {
  user: User;
  token: string;
}

// Recipe interface
export interface Recipe {
  recipe_id: string;  
  user_id: string;
  title: string;
  description: string;
  instructions: string;
  cook_time?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  is_public: boolean;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  image?: string;
  ingredients?: RecipeIngredient[];
  user?: User;
}

// Recipe ingredient interface
export interface RecipeIngredient {
  ingredient_id: string;
  recipe_id?: string;
  quantity: number;
  unit: string;
  ingredient?: Ingredient;
}

// Ingredient interface
export interface Ingredient {
  ingredient_id: string;
  name: string;
  category: string;
}

// Nutrition information interface
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// User profile interface
export interface UserProfile {
  user: User;
  followersCount: number;
  followingCount: number;
  savedRecipes?: Recipe[];
  userRecipes?: Recipe[];
}

// Filter options for recipes
export interface FilterOptions {
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cook_time?: number;
  diet_pref?: string;
}

// Input types for creating and updating recipes
export interface CreateRecipeInput {
  title: string;
  description: string;
  instructions: string;
  cook_time?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  is_public: boolean;
  image?: string;
  ingredients?: Array<{
    ingredient_id: string;
    quantity: number;
    unit: string;
  }>;
}

export interface UpdateRecipeInput {
  title?: string;
  description?: string;
  instructions?: string;
  cook_time?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  is_public?: boolean;
  image?: string;
  ingredients?: Array<{
    ingredient_id: string;
    quantity: number;
    unit: string;
  }>;
}

// Input types for creating and updating ingredients
export interface CreateIngredientInput {
  name: string;
  category: string;
}

export interface UpdateIngredientInput {
  name?: string;
  category?: string;
}