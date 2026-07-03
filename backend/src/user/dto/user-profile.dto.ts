// user-profile.dto.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';

// DTO for user profile information
@ObjectType()
export class UserProfile {
  @Field(() => User)
  user!: User;

  @Field(() => Int)
  followersCount!: number;

  @Field(() => Int)
  followingCount!: number;

  @Field(() => [Recipe], { nullable: 'itemsAndList' })
  savedRecipes!: Recipe[];

  @Field(() => [Recipe], { nullable: 'itemsAndList' })
  userRecipes!: Recipe[];
}
