// recipe-ingredient.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Recipe } from './recipe.entity';
import { Ingredient } from '../../ingredient/entities/ingredient.entity';

// Entity representing the association between Recipes and Ingredients
@Entity('recipe_ingredients')
@ObjectType()
export class RecipeIngredient {
  @PrimaryColumn('uuid')
  @Field({ nullable: true })
  recipe_id!: string;

  @PrimaryColumn('uuid')
  @Field({ nullable: true })
  ingredient_id!: string;

  @Column()
  @Field()
  quantity!: number;

  @Column()
  @Field()
  unit!: string;

  // Relations
  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
  @JoinColumn({ name: 'recipe_id' })
  recipe!: Recipe;

  @ManyToOne(() => Ingredient)
  @JoinColumn({ name: 'ingredient_id' })
  @Field(() => Ingredient, { nullable: true })
  ingredient?: Ingredient;
}
