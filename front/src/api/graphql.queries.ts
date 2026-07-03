// graphql.queries.ts
// GraphQL Queries and Mutations for Dishcovery App

// USER MUTATIONS
// Registration, Login, Update User
export const REGISTER_MUTATION = `
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      user_id
      username
      user_desc
      diet_pref
    }
  }
`;

export const LOGIN_MUTATION = `
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      user {
        user_id
        username
        user_desc
        diet_pref
      }
    }
  }
`;

export const UPDATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user_id
      username
      user_desc
      diet_pref
    }
  }
`;


// USER QUERIES
// Get User by ID, Profile, Followers, Following
export const GET_USER_BY_ID = `
  query GetUserById($user_id: String!) {
    getUserById(user_id: $user_id) {
      user_id
      username
      user_desc
      diet_pref
    }
  }
`;

export const GET_USER_PROFILE = `
  query GetUserProfile($user_id: String!) {
    getUserProfile(user_id: $user_id) {
      user {
        user_id
        username
        user_desc
        diet_pref
      }
      followersCount
      followingCount
      savedRecipes {
        recipe_id
        title
        description
        instructions
        cook_time
        difficulty
        is_public
        user_id
        calories
        protein
        carbs
        fat
        image
        ingredients {
          ingredient_id
          recipe_id
          quantity
          unit
        }
      }
      userRecipes {
        recipe_id
        title
        description
        instructions
        cook_time
        difficulty
        is_public
        user_id
        calories
        protein
        carbs
        fat
        image
        ingredients {
          ingredient_id
          recipe_id
          quantity
          unit
        }
      }
    }
  }
`;


// FOLLOW/UNFOLLOW MUTATIONS
// Follow User, Unfollow User, Is Following, Followers Count, Following Count
export const FOLLOW_USER_MUTATION = `
  mutation FollowUser($follower_id: String!, $following_id: String!) {
    followUser(follower_id: $follower_id, following_id: $following_id) {
      follower_id
      following_id
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = `
  mutation UnfollowUser($follower_id: String!, $following_id: String!) {
    unfollowUser(follower_id: $follower_id, following_id: $following_id)
  }
`;

export const IS_FOLLOWING = `
  query IsFollowing($follower_id: String!, $following_id: String!) {
    isFollowing(follower_id: $follower_id, following_id: $following_id)
  }
`;

export const GET_FOLLOWERS_COUNT = `
  query GetFollowersCount($user_id: String!) {
    getFollowersCount(user_id: $user_id)
  }
`;

export const GET_FOLLOWING_COUNT = `
  query GetFollowingCount($user_id: String!) {
    getFollowingCount(user_id: $user_id)
  }
`;


// SAVE/UNSAVE RECIPE MUTATIONS
// Save Recipe, Unsave Recipe, Get Saved Recipes, Is Recipe Saved
export const SAVE_RECIPE_MUTATION = `
  mutation SaveRecipe($user_id: String!, $recipe_id: String!) {
    saveRecipe(user_id: $user_id, recipe_id: $recipe_id) {
      user_id
      recipe_id
    }
  }
`;

export const UNSAVE_RECIPE_MUTATION = `
  mutation UnsaveRecipe($user_id: String!, $recipe_id: String!) {
    unsaveRecipe(user_id: $user_id, recipe_id: $recipe_id)
  }
`;

export const GET_SAVED_RECIPES = `
  query GetSavedRecipes($user_id: String!) {
    getSavedRecipes(user_id: $user_id) {
      recipe_id
      title
      description
      instructions
      cook_time
      difficulty
      is_public
      user_id
      calories
      protein
      carbs
      fat
      image
      ingredients {
        ingredient_id
        recipe_id
        quantity
        unit
        ingredient {
          ingredient_id
          name
          category
        }
      }
    }
  }
`;

export const IS_RECIPE_SAVED = `
  query IsRecipeSavedByUser($user_id: String!, $recipe_id: String!) {
    isRecipeSavedByUser(user_id: $user_id, recipe_id: $recipe_id)
  }
`;


// RECIPE MUTATIONS
// Create Recipe, Update Recipe, Delete Recipe
export const CREATE_RECIPE_MUTATION = `
  mutation CreateRecipe($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      recipe_id
      title
      description
      instructions
      cook_time
      difficulty
      is_public
      user_id
      calories
      protein
      carbs
      fat
      image
      ingredients {
        ingredient_id
        recipe_id
        quantity
        unit
        ingredient {
          ingredient_id
          name
          category
        }
      }
    }
  }
`;

export const UPDATE_RECIPE_MUTATION = `
  mutation UpdateRecipe($recipe_id: String!, $input: UpdateRecipeInput!) {
    updateRecipe(recipe_id: $recipe_id, input: $input) {
      recipe_id
      title
      description
      instructions
      cook_time
      difficulty
      is_public
      user_id
      calories
      protein
      carbs
      fat
      image
      ingredients {
        ingredient_id
        recipe_id
        quantity
        unit
        ingredient {
          ingredient_id
          name
          category
        }
      }
    }
  }
`;

export const DELETE_RECIPE_MUTATION = `
  mutation DeleteRecipe($recipe_id: String!) {
    deleteRecipe(recipe_id: $recipe_id)
  }
`;


// RECIPE QUERIES
// Get Recipe by ID, All Public Recipes, Search by Title, Filter Recipes, User's Recipes, Recipes by Ingredients, Count Saves
export const GET_RECIPE_BY_ID = `
  query GetRecipeById($recipe_id: String!) {
    getRecipeById(recipe_id: $recipe_id) {
      recipe_id
      title
      description
      instructions
      cook_time
      difficulty
      is_public
      user_id
      calories
      protein
      carbs
      fat
      image
      ingredients {
        ingredient_id
        recipe_id
        quantity
        unit
        ingredient {
          ingredient_id
          name
          category
        }
      }
    }
  }
`;


export const GET_ALL_PUBLIC_RECIPES = `
  query GetAllPublicRecipes {
    getAllPublicRecipes {
      recipe_id
      title
      description
      instructions
      cook_time
      difficulty
      is_public
      user_id
      calories
      protein
      carbs
      fat
      image
      ingredients {
        ingredient_id
        recipe_id
        quantity
        unit
      }
    }
  }
`;

export const SEARCH_RECIPES_BY_TITLE = `
  query SearchRecipesByTitle($title: String!) {
    searchRecipesByTitle(title: $title) {
      recipe_id
      title
      description
      instructions
      cook_time
      difficulty
      is_public
      user_id
      calories
      protein
      carbs
      fat
      image
      ingredients {
        ingredient_id
        recipe_id
        quantity
        unit
        ingredient {
          ingredient_id
          name
          category
        }
      }
    }
  }
`;

export const FILTER_RECIPES = `
  query FilterRecipes($input: FilterRecipesInput!) {
    filterRecipes(input: $input) {
      recipe_id
      title
      description
      instructions
      cook_time
      difficulty
      is_public
      user_id
      calories
      protein
      carbs
      fat
      image
      ingredients {
        ingredient_id
        recipe_id
        quantity
        unit
        ingredient {
          ingredient_id
          name
          category
        }
      }
    }
  }
`;

export const GET_USER_RECIPES = `
  query GetUserRecipes($user_id: String!) {
    getUserRecipes(user_id: $user_id) {
      recipe_id
      title
      description
      instructions
      cook_time
      difficulty
      is_public
      user_id
      calories
      protein
      carbs
      fat
      image
      ingredients {
        ingredient_id
        recipe_id
        quantity
        unit
        ingredient {
          ingredient_id
          name
          category
        }
      }
    }
  }
`;

export const GET_RECIPES_BY_INGREDIENTS = `
  query GetRecipesByIngredients($ingredientIds: [String!]!) {
    getRecipesByIngredients(ingredientIds: $ingredientIds) {
      recipe_id
      title
      description
      instructions
      cook_time
      difficulty
      is_public
      user_id
      calories
      protein
      carbs
      fat
      image
      ingredients {
        ingredient_id
        recipe_id
        quantity
        unit
        ingredient {
          ingredient_id
          name
          category
        }
      }
    }
  }
`;

export const COUNT_SAVES_FOR_RECIPE = `
  query CountSavesForRecipe($recipe_id: String!) {
    countSavesForRecipe(recipe_id: $recipe_id)
  }
`;


// RECIPE INGREDIENT MUTATIONS
// Add Ingredient to Recipe, Update Ingredient in Recipe, Remove Ingredient from Recipe, Get Ingredients by Recipe
export const ADD_INGREDIENT_TO_RECIPE = `
  mutation AddIngredientToRecipe($recipe_id: String!, $ingredient_id: String!, $quantity: Float!, $unit: String!) {
    addIngredientToRecipe(recipe_id: $recipe_id, ingredient_id: $ingredient_id, quantity: $quantity, unit: $unit) {
      ingredient_id
      recipe_id
      quantity
      unit
      ingredient {
        ingredient_id
        name
        category
      }
    }
  }
`;

export const UPDATE_INGREDIENT_IN_RECIPE = `
  mutation UpdateIngredientInRecipe($recipe_id: String!, $ingredient_id: String!, $input: UpdateRecipeIngredientInput!) {
    updateIngredientInRecipe(recipe_id: $recipe_id, ingredient_id: $ingredient_id, input: $input) {
      ingredient_id
      recipe_id
      quantity
      unit
      ingredient {
        ingredient_id
        name
        category
      }
    }
  }
`;

export const REMOVE_INGREDIENT_FROM_RECIPE = `
  mutation RemoveIngredientFromRecipe($recipe_id: String!, $ingredient_id: String!) {
    removeIngredientFromRecipe(recipe_id: $recipe_id, ingredient_id: $ingredient_id)
  }
`;

export const GET_INGREDIENTS_BY_RECIPE = `
  query GetIngredientsByRecipe($recipe_id: String!) {
    getIngredientsByRecipe(recipe_id: $recipe_id) {
      ingredient_id
      recipe_id
      quantity
      unit
      ingredient {
        ingredient_id
        name
        category
      }
    }
  }
`;


// INGREDIENT MUTATIONS
// Create Ingredient, Update Ingredient, Delete Ingredient
export const CREATE_INGREDIENT_MUTATION = `
  mutation CreateIngredient($input: CreateIngredientInput!) {
    createIngredient(input: $input) {
      ingredient_id
      name
      category
    }
  }
`;

export const UPDATE_INGREDIENT_MUTATION = `
  mutation UpdateIngredient($ingredient_id: String!, $input: UpdateIngredientInput!) {
    updateIngredient(ingredient_id: $ingredient_id, input: $input) {
      ingredient_id
      name
      category
    }
  }
`;

export const DELETE_INGREDIENT_MUTATION = `
  mutation DeleteIngredient($ingredient_id: String!) {
    deleteIngredient(ingredient_id: $ingredient_id)
  }
`;


// INGREDIENT QUERIES
// Get Ingredient by ID, All Ingredients, Get Ingredient by Name, Get Ingredients by Category
export const GET_INGREDIENT_BY_ID = `
  query GetIngredientById($ingredient_id: String!) {
    getIngredientById(ingredient_id: $ingredient_id) {
      ingredient_id
      name
      category
    }
  }
`;

export const GET_ALL_INGREDIENTS = `
  query GetAllIngredients {
    getAllIngredients {
      ingredient_id
      name
      category
    }
  }
`;

export const GET_INGREDIENT_BY_NAME = `
  query GetIngredientByName($name: String!) {
    getIngredientByName(name: $name) {
      ingredient_id
      name
      category
    }
  }
`;

export const GET_INGREDIENTS_BY_CATEGORY = `
  query GetIngredientsByCategory($category: String!) {
    getIngredientsByCategory(category: $category) {
      ingredient_id
      name
      category
    }
  }
`;