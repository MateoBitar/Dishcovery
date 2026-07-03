// recipe.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { RecipeService } from './recipe.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';
import { FilterRecipesInput } from './dto/filter-recipes.input';
import { UpdateRecipeIngredientInput } from './dto/update-recipe-ingredient.input';

// Resolver for Recipe-related queries and mutations
@Resolver(() => Recipe)
export class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  // Queries
  @Query(() => Recipe)
  async getRecipeById(@Args('recipe_id') recipe_id: string) {
    return this.recipeService.getRecipeById(recipe_id);
  }

  @Query(() => [Recipe])
  async getAllPublicRecipes() {
    return this.recipeService.getAllPublicRecipes();
  }

  @Query(() => [Recipe])
  async getUserRecipes(@Args('user_id') user_id: string) {
    return this.recipeService.getUserRecipes(user_id);
  }

  @Query(() => [Recipe])
  async searchRecipesByTitle(@Args('title') title: string) {
    return this.recipeService.searchRecipesByTitle(title);
  }

  @Query(() => [Recipe])
  async filterRecipes(@Args('input') input: FilterRecipesInput) {
    return this.recipeService.filterRecipes(
      input.difficulty,
      input.cook_time,
      input.diet_pref,
    );
  }

  @Query(() => Number)
  async countSavesForRecipe(@Args('recipe_id') recipe_id: string) {
    return this.recipeService.countSavesForRecipe(recipe_id);
  }

  @Query(() => [RecipeIngredient])
  async getIngredientsByRecipe(@Args('recipe_id') recipe_id: string) {
    return this.recipeService.getIngredientsByRecipe(recipe_id);
  }

  @Query(() => [Recipe])
  async getRecipesByIngredients(
    @Args('ingredientIds', { type: () => [String!] }) ingredientIds: string[],
  ) {
    return this.recipeService.getRecipesByIngredients(ingredientIds);
  }

  // Mutations
  @Mutation(() => Recipe)
  @UseGuards(JwtGuard)
  async createRecipe(
    @CurrentUser() user: User,
    @Args('input') input: CreateRecipeInput,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    return this.recipeService.createRecipe(token, input);
  }

  @Mutation(() => Recipe)
  @UseGuards(JwtGuard)
  async updateRecipe(
    @CurrentUser() user: User,
    @Args('recipe_id') recipe_id: string,
    @Args('input') input: UpdateRecipeInput,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    return this.recipeService.updateRecipe(recipe_id, input, token);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
  async deleteRecipe(
    @CurrentUser() user: User,
    @Args('recipe_id') recipe_id: string,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    const result = await this.recipeService.deleteRecipe(recipe_id, token);
    return result.success;
  }

  @Mutation(() => RecipeIngredient)
  @UseGuards(JwtGuard)
  async addIngredientToRecipe(
    @CurrentUser() user: User,
    @Args('recipe_id') recipe_id: string,
    @Args('ingredient_id') ingredient_id: string,
    @Args('quantity', { type: () => Number }) quantity: number,
    @Args('unit') unit: string,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    return this.recipeService.addIngredientToRecipe(
      recipe_id,
      ingredient_id,
      quantity,
      unit,
      token,
    );
  }

  @Mutation(() => RecipeIngredient)
  @UseGuards(JwtGuard)
  async updateIngredientInRecipe(
    @CurrentUser() user: User,
    @Args('recipe_id') recipe_id: string,
    @Args('ingredient_id') ingredient_id: string,
    @Args('input') input: UpdateRecipeIngredientInput,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    return this.recipeService.updateIngredientInRecipe(
      recipe_id,
      ingredient_id,
      input,
      token,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
  async removeIngredientFromRecipe(
    @CurrentUser() user: User,
    @Args('recipe_id') recipe_id: string,
    @Args('ingredient_id') ingredient_id: string,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    const result = await this.recipeService.removeIngredientFromRecipe(
      recipe_id,
      ingredient_id,
      token,
    );
    return result.success;
  }

  // Resolve Fields
  @ResolveField('ingredients', () => [RecipeIngredient], { nullable: true })
  async resolveIngredients(@Parent() recipe: Recipe) {
    if (recipe.ingredients) {
      return recipe.ingredients;
    }
    return this.recipeService.getIngredientsByRecipe(recipe.recipe_id);
  }
}

// Resolver for RecipeIngredient-related fields
@Resolver(() => RecipeIngredient)
export class RecipeIngredientResolver {
  constructor(private readonly recipeService: RecipeService, private readonly ingredientService: IngredientService) {}

  @ResolveField(() => Ingredient)
  async ingredient(@Parent() recipeIngredient: RecipeIngredient): Promise<Ingredient> {
    if (recipeIngredient.ingredient) {
      return recipeIngredient.ingredient;
    }
    // Fallback: fetch by ID if not loaded
    return this.ingredientService.getIngredientById(recipeIngredient.ingredient_id);
  }
}