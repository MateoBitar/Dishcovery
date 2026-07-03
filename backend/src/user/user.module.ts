// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserFollow } from './entities/user-follow.entity';
import { UserSavedRecipe } from './entities/user-saved-recipe.entity';
import { Recipe } from '../recipe/entities/recipe.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

// Module encapsulating user-related components
@Module({
  imports: [TypeOrmModule.forFeature([User, UserFollow, UserSavedRecipe, Recipe])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}