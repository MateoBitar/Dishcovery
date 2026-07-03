// login-user.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

// DTO for user login
@InputType()
export class LoginUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password!: string;
}
