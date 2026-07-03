// recipe.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { UserSavedRecipe } from '../user/entities/user-saved-recipe.entity';
import { RecipeService } from './recipe.service';
import { RecipeResolver } from './recipe.resolver';
import { IngredientModule } from '../ingredient/ingredient.module';
import { RecipeIngredientResolver } from './recipe.resolver';

// Module encapsulating Recipe-related components
@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient, Ingredient, UserSavedRecipe]), IngredientModule],
  providers: [RecipeResolver, RecipeIngredientResolver, RecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}
