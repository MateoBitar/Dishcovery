// user-saved-recipe.entity.ts
import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';

// Entity representing a saved recipe by a user
@Entity('user_savedrecipes')
@ObjectType()
export class UserSavedRecipe {
  @PrimaryColumn('uuid')
  @Field()
  user_id!: string;

  @PrimaryColumn('uuid')
  @Field()
  recipe_id!: string;

  @CreateDateColumn()
  @Field()
  saved_at!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.savedRecipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.savedBy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe!: Recipe;
}