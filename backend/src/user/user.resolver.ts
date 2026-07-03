// user.resolver.ts
import { Resolver, Query, Mutation, Args, Context, ResolveField, Parent, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserFollow } from './entities/user-follow.entity';
import { UserSavedRecipe } from './entities/user-saved-recipe.entity';
import { UserService } from './user.service';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthPayload } from './dto/auth-payload';
import { UserProfile } from './dto/user-profile.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Recipe } from '../recipe/entities/recipe.entity';

// Resolver for User-related queries and mutations
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // Queries
  @Query(() => User)
  async getUserById(@Args('user_id') user_id: string) {
    return await this.userService.getUserById(user_id);
  }

  @Query(() => User)
  async getUserByUsername(@Args('username') username: string) {
    return await this.userService.getUserByUsername(username);
  }

  @Query(() => User)
  @UseGuards(JwtGuard)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => Int)
  async getFollowersCount(@Args('user_id') user_id: string) {
    return await this.userService.getFollowersCount(user_id);
  }

  @Query(() => Int)
  async getFollowingCount(@Args('user_id') user_id: string) {
    return await this.userService.getFollowingCount(user_id);
  }

  @Query(() => Boolean)
  async isFollowing(
    @Args('follower_id') follower_id: string,
    @Args('following_id') following_id: string,
  ) {
    return await this.userService.isFollowing(follower_id, following_id);
  }

  @Query(() => [Recipe])
  async getSavedRecipes(@Args('user_id') user_id: string) {
    return await this.userService.getSavedRecipes(user_id);
  }

  @Query(() => Boolean)
  async isRecipeSavedByUser(
    @Args('user_id') user_id: string,
    @Args('recipe_id') recipe_id: string,
  ) {
    return await this.userService.isRecipeSavedByUser(user_id, recipe_id);
  }

  @Query(() => String, { nullable: true })
  async getDietPreference(@Args('user_id') user_id: string) {
    return await this.userService.getDietPreference(user_id);
  }

  @Query(() => UserProfile)
  async getUserProfile(@Args('user_id') user_id: string) {
    return await this.userService.getUserProfile(user_id);
  }

  @Query(() => [Recipe])
  async getUserRecipes(@Args('user_id') user_id: string) {
    return this.userService.getUserRecipes(user_id);
  }

  // Mutations
  @Mutation(() => User)
  async registerUser(@Args('input') input: RegisterUserInput) {
    return await this.userService.registerUser(input);
  }

  @Mutation(() => AuthPayload)
  async loginUser(@Args('input') input: LoginUserInput) {
    return await this.userService.authenticateUser(input);
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserInput,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    return await this.userService.updateUser(token, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
  async deleteUser(@CurrentUser() user: User, @Context() context: any) {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    await this.userService.deleteUser(token);
    return true;
  }

  @Mutation(() => UserFollow)
  async followUser(
    @Args('follower_id') follower_id: string,
    @Args('following_id') following_id: string,
  ) {
    return await this.userService.followUser(follower_id, following_id);
  }

  @Mutation(() => Boolean)
  async unfollowUser(
    @Args('follower_id') follower_id: string,
    @Args('following_id') following_id: string,
  ) {
    const result = await this.userService.unfollowUser(follower_id, following_id);
    return result.success;
  }

  @Mutation(() => UserSavedRecipe)
  async saveRecipe(
    @Args('user_id') user_id: string,
    @Args('recipe_id') recipe_id: string,
  ) {
    return await this.userService.saveRecipe(user_id, recipe_id);
  }

  @Mutation(() => Boolean)
  async unsaveRecipe(
    @Args('user_id') user_id: string,
    @Args('recipe_id') recipe_id: string,
  ) {
    const result = await this.userService.unsaveRecipe(user_id, recipe_id);
    return result.success;
  }

  // Resolve Fields
  @ResolveField(() => Int)
  async followersCount(@Parent() user: User) {
    return this.userService.getFollowersCount(user.user_id);
  }

  @ResolveField(() => Int)
  async followingCount(@Parent() user: User) {
    return this.userService.getFollowingCount(user.user_id);
  }

  @ResolveField(() => [Recipe], { name: 'savedRecipes' })
  async savedRecipesResolved(@Parent() user: User) {
    return this.userService.getSavedRecipes(user.user_id);
  }

  @ResolveField(() => [Recipe], { name: 'userRecipes' })
  async userRecipesResolved(@Parent() user: User) {
    return this.userService.getUserRecipes(user.user_id);
  }

  @ResolveField(() => Boolean, { nullable: true, name: 'isFollowing' })
  async isFollowingUser(@Parent() user: User, @Context() context: any) {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    if (!token) return false;
    const currentUser = await this.userService.verifyUser(token);
    return this.userService.isFollowing(currentUser.user_id, user.user_id);
  }
}
