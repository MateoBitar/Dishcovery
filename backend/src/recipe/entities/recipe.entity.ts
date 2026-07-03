// recipe.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { UserSavedRecipe } from '../../user/entities/user-saved-recipe.entity';

// Entity representing a Recipe
@Entity('recipes')
@ObjectType()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  recipe_id!: string;

  @Column('uuid', { nullable: true })
  @Field({ nullable: true })
  user_id!: string;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  title!: string;

  @Column('text')
  @Field()
  description!: string;

  @Column('text')
  @Field()
  instructions!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  cook_time!: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  difficulty!: string;

  @Column({ default: true })
  @Field()
  is_public!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field()
  calories!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field()
  protein!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field()
  carbs!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field()
  fat!: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  image!: string;

  // Relations
  @ManyToOne(() => User, (user) => user.recipes)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe)
  @Field(() => [RecipeIngredient], { nullable: true })
  ingredients?: RecipeIngredient[];

  @OneToMany(() => UserSavedRecipe, (saved) => saved.recipe)
  savedBy?: UserSavedRecipe[];
}
