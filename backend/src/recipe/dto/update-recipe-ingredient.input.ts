// update-recipe-ingredient.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for updating recipe ingredient details
@InputType()
export class UpdateRecipeIngredientInput {
  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  unit?: string;
}
