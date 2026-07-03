// ingredient.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';
import { RecipeIngredient } from '../recipe/entities/recipe-ingredient.entity';
import { Recipe } from '../recipe/entities/recipe.entity';

// Service handling business logic for Ingredients
@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  // Create ingredient
  async createIngredient(input: CreateIngredientInput): Promise<Ingredient> {
    if (!input.name || !input.name.trim())
      throw new BadRequestException('Ingredient name is required');
    if (!input.category || !input.category.trim())
      throw new BadRequestException('Ingredient category is required');

    // Check for existing ingredient with the same name
    const existing = await this.ingredientRepository.findOne({
      where: { name: input.name.trim() },
    });
    if (existing) throw new BadRequestException(`Ingredient '${input.name}' already exists`);

    const ingredient = this.ingredientRepository.create({
      name: input.name.trim(),
      category: input.category.trim(),
    });
    return await this.ingredientRepository.save(ingredient);
  }

  // Get ingredient by ID
  async getIngredientById(ingredient_id: string): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({
      where: { ingredient_id },
    });
    if (!ingredient) throw new BadRequestException('Ingredient not found');
    return ingredient;
  }

  // Get all ingredients
  async getAllIngredients(): Promise<Ingredient[]> {
    return await this.ingredientRepository.find();
  }

  // Get ingredient by name
  async getIngredientByName(name: string): Promise<Ingredient[]> {
    if (!name || !name.trim()) throw new BadRequestException('Ingredient name is required');

    const ingredient = await this.ingredientRepository.findOne({
      where: { name: name.trim() },
    });
    return ingredient ? [ingredient] : [];
  }

  // Get ingredients by category
  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    if (!category || !category.trim())
      throw new BadRequestException('Ingredient category is required');

    return await this.ingredientRepository.find({
      where: { category: category.trim() },
    });
  }

  // Update ingredient
  async updateIngredient(
    ingredient_id: string,
    input: UpdateIngredientInput,
  ): Promise<Ingredient> {
    // Fetch the current ingredient first
    const existingIngredient = await this.getIngredientById(ingredient_id);

    // Validate and sanitize incoming fields
    if (input.name !== undefined) {
      if (!input.name.trim()) throw new BadRequestException('Ingredient name cannot be empty');
      const duplicate = await this.ingredientRepository.findOne({
        where: { name: input.name.trim() },
      });
      if (duplicate && duplicate.ingredient_id !== ingredient_id) {
        throw new BadRequestException(`Ingredient name '${input.name}' is already taken`);
      }
    }

    if (input.category !== undefined) {
      if (!input.category.trim()) throw new BadRequestException('Ingredient category cannot be empty');
    }

    // Clean out empty/null values
    const cleanData: any = {};
    if (input.name?.trim()) cleanData.name = input.name.trim();
    if (input.category?.trim()) cleanData.category = input.category.trim();

    // Merge missing fields from existing data
    const fullData = {
      name: cleanData.name ?? existingIngredient.name,
      category: cleanData.category ?? existingIngredient.category,
    };

    await this.ingredientRepository.update(ingredient_id, fullData);
    return await this.getIngredientById(ingredient_id);
  }

  // Delete ingredient
  async deleteIngredient(ingredient_id: string): Promise<{ success: boolean }> {
    const ingredient = await this.getIngredientById(ingredient_id);
    await this.ingredientRepository.remove(ingredient);
    return { success: true };
  }

  // Get recipes by ingredients
  async getRecipesByIngredients(ingredientIds: string[]): Promise<Recipe[]> {
    if (!Array.isArray(ingredientIds) || ingredientIds.length === 0) {
      throw new BadRequestException('Invalid ingredient ID list');
    }

    const recipeIngredients = await this.recipeIngredientRepository.find({
      where: ingredientIds.map((id) => ({ ingredient_id: id })),
      relations: ['recipe'],
    });

    const uniqueRecipes = new Map<string, Recipe>();
    for (const ri of recipeIngredients) {
      if (ri.recipe && ri.recipe.is_public) {
        uniqueRecipes.set(ri.recipe.recipe_id, ri.recipe);
      }
    }

    return Array.from(uniqueRecipes.values());
  }
}
