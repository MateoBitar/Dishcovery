// filter-recipes.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

// DTO for filtering recipes based on criteria
@InputType()
export class FilterRecipesInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @Field({ nullable: true })
  @IsOptional()
  cook_time?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  diet_pref?: string;
}
