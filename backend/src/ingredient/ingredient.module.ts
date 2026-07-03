// ingredient.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { RecipeIngredient } from '../recipe/entities/recipe-ingredient.entity';
import { Recipe } from '../recipe/entities/recipe.entity';
import { IngredientService } from './ingredient.service';
import { IngredientResolver } from './ingredient.resolver';

// Ingredient module encapsulating service and resolver
@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, RecipeIngredient, Recipe])],
  providers: [IngredientResolver, IngredientService],
  exports: [IngredientService],
})
export class IngredientModule {}
