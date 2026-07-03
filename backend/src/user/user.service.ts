// user.service.ts
import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';
import { UserFollow } from './entities/user-follow.entity';
import { UserSavedRecipe } from './entities/user-saved-recipe.entity';
import { Recipe } from '../recipe/entities/recipe.entity';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthPayload } from './dto/auth-payload';

// Service handling business logic for Users
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserFollow)
    private userFollowRepository: Repository<UserFollow>,
    @InjectRepository(UserSavedRecipe)
    private userSavedRecipeRepository: Repository<UserSavedRecipe>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  // Verify user from token
  public async verifyUser(token: string): Promise<User> {
    if (!token) throw new UnauthorizedException('Unauthorized');

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userRepository.findOne({
      where: { user_id: decoded.user_id },
    });
    if (!user) throw new BadRequestException('User not found');

    return user;
  }

  // Register user
  async registerUser(input: RegisterUserInput): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username: input.username },
    });
    if (existingUser) throw new BadRequestException('Username is already taken');

    if (!input.password || !input.password.trim()) {
      throw new BadRequestException('Password is required');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = this.userRepository.create({
      username: input.username,
      password_hash: passwordHash,
      diet_pref: input.diet_pref,
      user_desc: input.user_desc,
    });

    return await this.userRepository.save(user);
  }

  // Authenticate user
  async authenticateUser(input: LoginUserInput): Promise<AuthPayload> {
    const user = await this.userRepository.findOne({
      where: { username: input.username },
    });
    if (!user) throw new BadRequestException('User not found');

    const isPasswordValid = await bcrypt.compare(input.password, user.password_hash);
    if (!isPasswordValid) throw new BadRequestException('Invalid password');

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET as string, {
      expiresIn: '2h',
    });

    return { token, user };
  }

  // Get user by ID
  async getUserById(user_id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  // Update user
  async updateUser(token: string, input: UpdateUserInput): Promise<User> {
    const authUser = await this.verifyUser(token);
    const user_id = authUser.user_id;
    const user = await this.getUserById(user_id);

    // Prevent duplicate usernames
    if (input.username) {
      const existing = await this.userRepository.findOne({
        where: { username: input.username },
      });
      if (existing && existing.user_id !== user_id) {
        throw new BadRequestException('Username is already taken');
      }
    }

    // Clean up data (remove null/undefined/empty)
    const cleanData: any = {};
    if (input.username?.trim()) cleanData.username = input.username.trim();
    if (input.diet_pref?.trim()) cleanData.diet_pref = input.diet_pref.trim();
    if (input.user_desc?.trim()) cleanData.user_desc = input.user_desc.trim();
    if (input.password?.trim()) cleanData.password_hash = await bcrypt.hash(input.password.trim(), 10);

    // Merge missing fields from the current user record
    const fullData = {
      username: cleanData.username ?? user.username,
      password_hash: cleanData.password_hash ?? user.password_hash,
      diet_pref: cleanData.diet_pref ?? user.diet_pref,
      user_desc: cleanData.user_desc ?? user.user_desc,
    };

    await this.userRepository.update(user_id, fullData);
    return await this.getUserById(user_id);
  }

  // Delete user
  async deleteUser(token: string): Promise<{ success: boolean; message: string }> {
    const user = await this.verifyUser(token);
    await this.userRepository.remove(user);
    return { success: true, message: `User '${user.username}' deleted successfully.` };
  }

  // Get diet preference
  async getDietPreference(user_id: string): Promise<string | null> {
    const user = await this.getUserById(user_id);
    return user.diet_pref || null;
  }

  // Follow user
  async followUser(follower_id: string, following_id: string): Promise<UserFollow> {
    if (follower_id === following_id) {
      throw new BadRequestException("You can't follow yourself");
    }

    await this.getUserById(follower_id);
    await this.getUserById(following_id);

    const isFollowing = await this.userFollowRepository.findOne({
      where: { follower_id, following_id },
    });
    if (isFollowing) throw new BadRequestException('Already following this user');

    const follow = this.userFollowRepository.create({ follower_id, following_id });
    return await this.userFollowRepository.save(follow);
  }

  // Unfollow user
  async unfollowUser(follower_id: string, following_id: string): Promise<{ success: boolean }> {
    if (follower_id === following_id) {
      throw new BadRequestException("You can't unfollow yourself");
    }

    await this.getUserById(follower_id);
    await this.getUserById(following_id);

    const isFollowing = await this.userFollowRepository.findOne({
      where: { follower_id, following_id },
    });
    if (!isFollowing) throw new BadRequestException('Not following this user');

    await this.userFollowRepository.remove(isFollowing);
    return { success: true };
  }

  // Check follow status
  async isFollowing(follower_id: string, following_id: string): Promise<boolean> {
    if (follower_id === following_id) return false;

    await this.getUserById(follower_id);
    await this.getUserById(following_id);

    const isFollowing = await this.userFollowRepository.findOne({
      where: { follower_id, following_id },
    });
    return !!isFollowing;
  }

  // Get followers count
  async getFollowersCount(user_id: string): Promise<number> {
    await this.getUserById(user_id);
    return await this.userFollowRepository.count({ where: { following_id: user_id } });
  }

  // Get following count
  async getFollowingCount(user_id: string): Promise<number> {
    await this.getUserById(user_id);
    return await this.userFollowRepository.count({ where: { follower_id: user_id } });
  }

  // Save recipe
  async saveRecipe(user_id: string, recipe_id: string): Promise<UserSavedRecipe> {
    await this.getUserById(user_id);
    const recipe = await this.recipeRepository.findOne({ where: { recipe_id } });
    if (!recipe) throw new BadRequestException('Recipe not found');

    const isSaved = await this.userSavedRecipeRepository.findOne({
      where: { user_id, recipe_id },
    });
    if (isSaved) throw new BadRequestException('Recipe already saved');

    const saved = this.userSavedRecipeRepository.create({ user_id, recipe_id });
    return await this.userSavedRecipeRepository.save(saved);
  }

  // Unsave recipe
  async unsaveRecipe(user_id: string, recipe_id: string): Promise<{ success: boolean }> {
    await this.getUserById(user_id);
    const recipe = await this.recipeRepository.findOne({ where: { recipe_id } });
    if (!recipe) throw new BadRequestException('Recipe not found');

    const isSaved = await this.userSavedRecipeRepository.findOne({
      where: { user_id, recipe_id },
    });
    if (!isSaved) throw new BadRequestException('Recipe not saved');

    await this.userSavedRecipeRepository.remove(isSaved);
    return { success: true };
  }

  // Get saved recipes
  async getSavedRecipes(user_id: string): Promise<Recipe[]> {
    await this.getUserById(user_id);

    const savedRows = await this.userSavedRecipeRepository.find({ where: { user_id } });
    const recipeIds = savedRows.map(s => s.recipe_id);
    if (recipeIds.length === 0) return [];

    const recipes = await this.recipeRepository.find({ where: { recipe_id: In(recipeIds) }, relations: ['ingredients'] });
    return recipes;
  }

  // Check if recipe is saved by user
  async isRecipeSavedByUser(user_id: string, recipe_id: string): Promise<boolean> {
    await this.getUserById(user_id);
    const recipe = await this.recipeRepository.findOne({ where: { recipe_id } });
    if (!recipe) throw new BadRequestException('Recipe not found');

    const isSaved = await this.userSavedRecipeRepository.findOne({
      where: { user_id, recipe_id },
    });
    return !!isSaved;
  }

  // Get user recipes
  async getUserRecipes(user_id: string): Promise<Recipe[]> {
    await this.getUserById(user_id);
    return this.recipeRepository.find({ where: { user_id }, relations: ['ingredients'] });
  }

  // Get user profile
  async getUserProfile(user_id: string) {
    const user = await this.getUserById(user_id);
    const followersCount = await this.getFollowersCount(user_id);
    const followingCount = await this.getFollowingCount(user_id);
    const savedRecipes = await this.getSavedRecipes(user_id);
    const userRecipes = await this.getUserRecipes(user_id);

    return { user, followersCount, followingCount, savedRecipes, userRecipes };
  }
}
