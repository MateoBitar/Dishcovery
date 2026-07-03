// update-user.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

// DTO for updating user information
@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  diet_pref?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  user_desc?: string;
}
