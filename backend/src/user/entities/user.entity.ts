// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Recipe } from '../../recipe/entities/recipe.entity';
import { UserFollow } from './user-follow.entity';
import { UserSavedRecipe } from './user-saved-recipe.entity';

// User entity representing a user in the database
@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  user_id!: string;

  @Column({ unique: true })
  @Field()
  username!: string;

  @Column()
  password_hash!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  diet_pref?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  user_desc?: string;

  // Relations
  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes?: Recipe[];

  @OneToMany(() => UserFollow, (follow) => follow.follower)
  following?: UserFollow[];

  @OneToMany(() => UserFollow, (follow) => follow.followingUser)
  followers?: UserFollow[];

  @OneToMany(() => UserSavedRecipe, (saved) => saved.user)
  savedRecipes?: UserSavedRecipe[];
}
