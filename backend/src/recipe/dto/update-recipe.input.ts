// update-recipe.input.ts
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateRecipeInput } from './create-recipe.input';

// DTO for updating an existing recipe
@InputType()
export class UpdateRecipeInput extends PartialType(CreateRecipeInput) {
  @Field()
  recipe_id!: string;
}
