// jwt.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

// JWT Guard to protect GraphQL routes
@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);  // Convert to GraphQL context
    const { req } = gqlContext.getContext();                 // Extract request from context
    const token = req.headers.authorization?.replace('Bearer ', '');  // Get token from Authorization header

    if (!token) throw new UnauthorizedException('No token provided'); // No token provided

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);  // Verify token
      gqlContext.getContext().user = decoded;  // Attach decoded user to context
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
