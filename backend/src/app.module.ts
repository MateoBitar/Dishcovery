// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { RecipeModule } from './recipe/recipe.module';
import { IngredientModule } from './ingredient/ingredient.module';

// Main application module
@Module({
  imports: [
    ConfigModule.forRoot({  // Load environment variables
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({  // GraphQL configuration
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }: { req: any }) => ({ req }),
    }),
    TypeOrmModule.forRoot({  // Database configuration
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB || 'dishcovery',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
    }),
    UserModule,
    RecipeModule,
    IngredientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}  // Exporting the main application module
