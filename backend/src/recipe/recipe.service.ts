// recipe.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { UserSavedRecipe } from '../user/entities/user-saved-recipe.entity';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';
import { UpdateRecipeIngredientInput } from './dto/update-recipe-ingredient.input';
import { analyzeNutrition, uploadImage } from '../utils';

// Service handling business logic for Recipes
@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(UserSavedRecipe)
    private userSavedRecipeRepository: Repository<UserSavedRecipe>,
  ) {}

  // Verify recipe ownership
  private async verifyOwnership(recipe_id: string, token: string): Promise<Recipe> {
    if (!token) throw new UnauthorizedException('Unauthorized');

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const recipe = await this.recipeRepository.findOne({ where: { recipe_id } });
    if (!recipe) throw new BadRequestException('Recipe not found');
    if (recipe.user_id !== decoded.user_id) {
      throw new BadRequestException('You can only modify your own recipes');
    }

    return recipe;
  }

  // Create recipe
  async createRecipe(token: string, input: CreateRecipeInput): Promise<Recipe> {
    if (!token) throw new UnauthorizedException('Unauthorized');

    if (!input.title?.trim()) throw new BadRequestException('Recipe title is required');
    if (!input.description?.trim())
      throw new BadRequestException('Recipe description is required');
    if (!input.instructions?.trim())
      throw new BadRequestException('Recipe instructions are required');

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Handle image upload if provided
    let imageUrl = input.image;
    if (imageUrl) {
      try {
        const match = imageUrl.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
        if (!match) {
          throw new BadRequestException('Invalid image format');
        }
        const rawBase64 = match[2];
        imageUrl = await uploadImage(rawBase64);
      } catch (err) {
        console.error('Image upload failed:', err instanceof Error ? err.message : String(err));
        throw new BadRequestException('Failed to upload image');
      }
    }

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    // Calculate nutrition if ingredients are provided
    try {
      if (input.ingredients && input.ingredients.length > 0) {
        const ingredientsWithNames = [];

        for (const i of input.ingredients) {
          const ingredient = await this.ingredientRepository.findOne({
            where: { ingredient_id: i.ingredient_id },
          });
          if (!ingredient || !ingredient.name?.trim()) {
            console.warn(`Skipping ingredient: missing name or not found (ID ${i.ingredient_id})`);
            continue;
          }

          ingredientsWithNames.push({
            name: ingredient.name.trim(),
            quantity: i.quantity,
            unit: i.unit,
          });
        }

        if (ingredientsWithNames.length > 0) {
          const nutrition = await analyzeNutrition(ingredientsWithNames);
          if (nutrition) {
            calories = nutrition.calories || 0;
            protein = nutrition.protein || 0;
            carbs = nutrition.carbs || 0;
            fat = nutrition.fat || 0;
          }
        }
      }
    } catch (err) {
      console.warn('Nutrition API failed:', err instanceof Error ? err.message : String(err));
    }

    const recipe = this.recipeRepository.create({
      user_id: decoded.user_id,
      title: input.title.trim(),
      description: input.description.trim(),
      instructions: input.instructions.trim(),
      cook_time: input.cook_time || 0,
      difficulty: input.difficulty,
      is_public: input.is_public ?? true,
      calories,
      protein,
      carbs,
      fat,
      image: imageUrl,
    });

    const created = await this.recipeRepository.save(recipe);

    // Add ingredients
    if (input.ingredients && input.ingredients.length > 0) {
      for (const ing of input.ingredients) {
        const ingredient = await this.ingredientRepository.findOne({
          where: { ingredient_id: ing.ingredient_id },
        });
        if (!ingredient) {
          // Rollback if invalid ingredient
          await this.recipeRepository.remove(created);
          throw new BadRequestException(`Ingredient ${ing.ingredient_id} not found`);
        }

        const recipeIngredient = this.recipeIngredientRepository.create({
          recipe_id: created.recipe_id,
          ingredient_id: ing.ingredient_id,
          quantity: ing.quantity,
          unit: ing.unit,
        });
        await this.recipeIngredientRepository.save(recipeIngredient);
      }
    }

    return created;
  }

  // Get recipe by ID (with ingredients)
  async getRecipeById(recipe_id: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { recipe_id },
      relations: ['ingredients', 'ingredients.ingredient', 'user'],
    });
    if (!recipe) throw new BadRequestException('Recipe not found');
    return recipe;
  }

  // Get all public recipes
  async getAllPublicRecipes(): Promise<Recipe[]> {
    return await this.recipeRepository.find({
      where: { is_public: true },
      relations: ['user', 'ingredients', 'ingredients.ingredient'],
    });
  }

  // Update recipe
  async updateRecipe(
    recipe_id: string,
    input: UpdateRecipeInput,
    token: string,
  ): Promise<Recipe> {
    const recipe = await this.verifyOwnership(recipe_id, token);

    const updateData: any = {};
    if (input.title) updateData.title = input.title;
    if (input.description) updateData.description = input.description;
    if (input.instructions) updateData.instructions = input.instructions;
    if (input.cook_time !== undefined) updateData.cook_time = input.cook_time;
    if (input.difficulty) updateData.difficulty = input.difficulty;
    if (input.is_public !== undefined) updateData.is_public = input.is_public;
    
    // Handle image upload if provided
    if (input.image) {
      try {
        const match = input.image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
        if (!match) {
          throw new BadRequestException('Invalid image format');
        }
        const rawBase64 = match[2];
        updateData.image = await uploadImage(rawBase64);
      } catch (err) {
        console.error('Image upload failed:', err instanceof Error ? err.message : String(err));
        throw new BadRequestException('Failed to upload image');
      }
    }

    // Recalculate nutrition if ingredients changed
    try {
      if (input.ingredients && input.ingredients.length > 0) {
        const ingredientsWithNames = [];

        for (const i of input.ingredients) {
          const ingredient = await this.ingredientRepository.findOne({
            where: { ingredient_id: i.ingredient_id },
          });
          if (!ingredient || !ingredient.name?.trim()) {
            console.warn(`Skipping ingredient: missing name or not found (ID ${i.ingredient_id})`);
            continue;
          }

          ingredientsWithNames.push({
            name: ingredient.name.trim(),
            quantity: i.quantity,
            unit: i.unit,
          });
        }

        if (ingredientsWithNames.length > 0) {
          const nutrition = await analyzeNutrition(ingredientsWithNames);
          if (nutrition) {
            updateData.calories = nutrition.calories || 0;
            updateData.protein = nutrition.protein || 0;
            updateData.carbs = nutrition.carbs || 0;
            updateData.fat = nutrition.fat || 0;
          }
        }

        // Remove old ingredients
        const currentIngredients = await this.recipeIngredientRepository.find({
          where: { recipe_id },
        });

        for (const ci of currentIngredients) {
          await this.recipeIngredientRepository.remove(ci);
        }

        // Add new ingredients
        for (const ing of input.ingredients) {
          const ingredient = await this.ingredientRepository.findOne({
            where: { ingredient_id: ing.ingredient_id },
          });
          if (!ingredient) {
            throw new BadRequestException(`Ingredient ${ing.ingredient_id} not found`);
          }

          const recipeIngredient = this.recipeIngredientRepository.create({
            recipe_id,
            ingredient_id: ing.ingredient_id,
            quantity: ing.quantity,
            unit: ing.unit,
          });
          await this.recipeIngredientRepository.save(recipeIngredient);
        }
      }
    } catch (err) {
      console.warn('Nutrition API failed:', err instanceof Error ? err.message : String(err));
    }

    // Merge missing fields from existing recipe
    const fullData = {
      title: updateData.title ?? recipe.title,
      description: updateData.description ?? recipe.description,
      instructions: updateData.instructions ?? recipe.instructions,
      cook_time: updateData.cook_time ?? recipe.cook_time,
      difficulty: updateData.difficulty ?? recipe.difficulty,
      is_public: updateData.is_public ?? recipe.is_public,
      calories: updateData.calories ?? recipe.calories,
      protein: updateData.protein ?? recipe.protein,
      carbs: updateData.carbs ?? recipe.carbs,
      fat: updateData.fat ?? recipe.fat,
      image: updateData.image ?? recipe.image,
    };

    await this.recipeRepository.update(recipe_id, fullData);
    return await this.getRecipeById(recipe_id);
  }

  // Delete recipe
  async deleteRecipe(recipe_id: string, token: string): Promise<{ success: boolean; message: string }> {
    const recipe = await this.verifyOwnership(recipe_id, token);

    const ingredients = await this.recipeIngredientRepository.find({
      where: { recipe_id },
    });
    for (const ing of ingredients) {
      await this.recipeIngredientRepository.remove(ing);
    }

    await this.recipeRepository.remove(recipe);
    return { success: true, message: `Recipe '${recipe.title}' deleted successfully.` };
  }

  // Get user recipes
  async getUserRecipes(user_id: string): Promise<Recipe[]> {
    return await this.recipeRepository.find({
      where: { user_id },
      relations: ['ingredients', 'ingredients.ingredient', 'user'],
    });
  }

  // Search recipes by title
  async searchRecipesByTitle(title: string): Promise<Recipe[]> {
    if (!title || !title.trim()) throw new BadRequestException('Search title cannot be empty');

    return await this.recipeRepository
      .createQueryBuilder('recipe')
      .where('recipe.title ILIKE :title AND recipe.is_public = true', {
        title: `%${title}%`,
      })
      .leftJoinAndSelect('recipe.user', 'user')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('ingredients.ingredient', 'ingredient')
      .getMany();
  }

  // Filter recipes
  async filterRecipes(
    difficulty?: string,
    cook_time?: number,
    diet_pref?: string,
  ): Promise<Recipe[]> {
    if (!difficulty && !cook_time && !diet_pref) {
      throw new BadRequestException('At least one filter parameter must be provided');
    }

    let query = this.recipeRepository
      .createQueryBuilder('recipe')
      .where('recipe.is_public = true')
      .leftJoinAndSelect('recipe.user', 'user')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('ingredients.ingredient', 'ingredient');


    if (difficulty) {
      query = query.andWhere('recipe.difficulty = :difficulty', { difficulty });
    }
    if (cook_time) {
      query = query.andWhere('recipe.cook_time <= :cook_time', { cook_time });
    }
    if (diet_pref) {
      query = query.andWhere('user.diet_pref = :diet_pref', { diet_pref });
    }

    return await query.getMany();
  }

  // Count saves for recipe
  async countSavesForRecipe(recipe_id: string): Promise<number> {
    return await this.userSavedRecipeRepository.count({ where: { recipe_id } });
  }

  // Add ingredient to recipe
  async addIngredientToRecipe(
    recipe_id: string,
    ingredient_id: string,
    quantity: number,
    unit: string,
    token: string,
  ): Promise<RecipeIngredient> {
    await this.verifyOwnership(recipe_id, token);

    if (!ingredient_id) {
      throw new BadRequestException('Invalid or missing ingredient ID');
    }
    if (!quantity) {
      throw new BadRequestException('Missing ingredient quantity');
    }
    if (!unit?.trim()) {
      throw new BadRequestException('Missing ingredient unit');
    }

    const ingredient = await this.ingredientRepository.findOne({
      where: { ingredient_id },
    });
    if (!ingredient) throw new BadRequestException('Ingredient not found');

    const recipeIngredient = this.recipeIngredientRepository.create({
      recipe_id,
      ingredient_id,
      quantity,
      unit,
    });
    return await this.recipeIngredientRepository.save(recipeIngredient);
  }

  // Update ingredient in recipe
  async updateIngredientInRecipe(
    recipe_id: string,
    ingredient_id: string,
    input: UpdateRecipeIngredientInput,
    token: string,
  ): Promise<RecipeIngredient> {
    if (!ingredient_id) {
      throw new BadRequestException('Invalid or missing ingredient ID');
    }

    await this.verifyOwnership(recipe_id, token);

    if (!input || typeof input !== 'object') {
      throw new BadRequestException('Invalid update data');
    }

    const cleanData = Object.fromEntries(
      Object.entries(input).filter(([_, v]) => v != null && v !== ''),
    );

    if (Object.keys(cleanData).length === 0) {
      throw new BadRequestException('No valid fields to update');
    }

    const existing = await this.recipeIngredientRepository.findOne({
      where: { recipe_id, ingredient_id },
    });
    if (!existing) throw new BadRequestException('Ingredient not found in recipe');

    // Merge new + old data
    const fullData = {
      quantity: cleanData.quantity ?? existing.quantity,
      unit: cleanData.unit ?? existing.unit,
    };

    existing.quantity = fullData.quantity;
    existing.unit = fullData.unit;

    return await this.recipeIngredientRepository.save(existing);
  }

  // Remove ingredient from recipe
  async removeIngredientFromRecipe(
    recipe_id: string,
    ingredient_id: string,
    token: string,
  ): Promise<{ success: boolean }> {
    if (!ingredient_id) {
      throw new BadRequestException('Invalid or missing ingredient ID');
    }

    await this.verifyOwnership(recipe_id, token);

    const recipeIngredient = await this.recipeIngredientRepository.findOne({
      where: { recipe_id, ingredient_id },
    });
    if (!recipeIngredient) throw new BadRequestException('Ingredient not found in recipe');

    await this.recipeIngredientRepository.remove(recipeIngredient);
    return { success: true };
  }

  // Get all ingredients for a recipe
  async getIngredientsByRecipe(recipe_id: string): Promise<RecipeIngredient[]> {
    return await this.recipeIngredientRepository.find({
      where: { recipe_id },
      relations: ['ingredient'],
    });
  }

  // Get recipes by ingredient IDs
  async getRecipesByIngredients(ingredientIds: string[]): Promise<Recipe[]> {
    if (!ingredientIds || ingredientIds.length === 0) {
      throw new BadRequestException('At least one ingredient ID must be provided');
    }

    const recipes = await this.recipeRepository
      .createQueryBuilder('recipe')
      .innerJoinAndSelect(
        'recipe.ingredients',
        'ingredients',
        'ingredients.ingredient_id IN (:...ingredientIds)',
        { ingredientIds }
      )
      .where('recipe.is_public = true')
      .leftJoinAndSelect('ingredients.ingredient', 'ingredient')
      .getMany();

    return recipes;
  }
}
