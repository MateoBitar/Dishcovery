// create-recipe.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for recipe ingredients within a recipe
@InputType()
export class RecipeIngredientInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  ingredient_id!: string;

  @Field()
  @Type(() => Number)
  @IsNumber()
  quantity!: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  unit!: string;
}

@InputType()
export class CreateRecipeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  instructions!: string;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cook_time?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image?: string;

  @Field(() => [RecipeIngredientInput], { nullable: true })
  @IsOptional()
  ingredients?: RecipeIngredientInput[];
}
