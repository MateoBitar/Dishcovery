// ingredient.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { RecipeIngredient } from '../../recipe/entities/recipe-ingredient.entity';

// Ingredient entity representing an ingredient in the database
@Entity('ingredients')
@ObjectType()
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  ingredient_id!: string;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  category!: string;

  @OneToMany(() => RecipeIngredient, (ri) => ri.ingredient)
  recipeIngredients?: RecipeIngredient[];
}
