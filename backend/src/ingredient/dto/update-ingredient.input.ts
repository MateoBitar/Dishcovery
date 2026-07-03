// update-ingredient.input.ts
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateIngredientInput } from './create-ingredient.input';

// DTO for updating an existing ingredient
@InputType()
export class UpdateIngredientInput extends PartialType(
  CreateIngredientInput,
) {
  @Field()
  ingredient_id!: string;
}
