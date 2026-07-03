// ingredient.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientService } from './ingredient.service';
import { Recipe } from '../recipe/entities/recipe.entity';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';

// Resolver for Ingredient-related GraphQL operations
@Resolver(() => Ingredient)
export class IngredientResolver {
  constructor(private readonly ingredientService: IngredientService) {}

  // Queries
  @Query(() => Ingredient)
  async getIngredientById(@Args('ingredient_id') ingredient_id: string) {
    return await this.ingredientService.getIngredientById(ingredient_id);
  }

  @Query(() => [Ingredient])
  async getAllIngredients() {
    return await this.ingredientService.getAllIngredients();
  }

  @Query(() => [Ingredient])
  async getIngredientByName(@Args('name') name: string) {
    return await this.ingredientService.getIngredientByName(name);
  }

  @Query(() => [Ingredient])
  async getIngredientsByCategory(@Args('category') category: string) {
    return await this.ingredientService.getIngredientsByCategory(category);
  }

  @Query(() => [Recipe])
  async getRecipesByIngredients(
    @Args('ingredientIds', { type: () => [String] }) ingredientIds: string[],
  ) {
    return await this.ingredientService.getRecipesByIngredients(ingredientIds);
  }

  // Mutations
  @Mutation(() => Ingredient)
  async createIngredient(@Args('input') input: CreateIngredientInput) {
    return await this.ingredientService.createIngredient(input);
  }

  @Mutation(() => Ingredient)
  async updateIngredient(
    @Args('ingredient_id') ingredient_id: string,
    @Args('input') input: UpdateIngredientInput,
  ) {
    return await this.ingredientService.updateIngredient(ingredient_id, input);
  }

  @Mutation(() => Boolean)
  async deleteIngredient(@Args('ingredient_id') ingredient_id: string) {
    const result = await this.ingredientService.deleteIngredient(ingredient_id);
    return result.success;
  }
}
