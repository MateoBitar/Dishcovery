// register-user.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// DTO for user registration
@InputType()
export class RegisterUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  diet_pref?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  user_desc?: string;
}
