// current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// Custom decorator to get the current authenticated user from the GraphQL context
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context);  // Convert to GraphQL context
    const { user } = gqlContext.getContext();                // Extract user from context
    return user;
  },
);
