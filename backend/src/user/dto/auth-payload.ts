// auth-payload.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

// Payload returned upon successful authentication
@ObjectType()
export class AuthPayload {
  @Field()
  token!: string;

  @Field(() => User)
  user!: User;
}
