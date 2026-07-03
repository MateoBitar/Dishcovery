# 🍳 Dishcovery - Recipe Discovery & Management Platform

**Dishcovery** is a full-stack web application that helps users discover recipes based on available ingredients, share culinary creations, and manage personal recipe collections. Built with modern technologies including React, Redux, TypeScript, NestJS, GraphQL, and PostgreSQL.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=flat&logo=redux&logoColor=white)](https://redux.js.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)](https://graphql.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Running the Application](#-running-the-application)
- [Development Guide](#-development-guide)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

### Core Functionality
- 🔍 **Ingredient-Based Discovery** - Find recipes using ingredients you already have
- 📝 **Recipe Management** - Create, edit, delete, and share recipes
- 💾 **Save & Bookmark** - Save favorite recipes for quick access
- 👥 **Social Features** - Follow chefs and see their latest creations
- 🔒 **Privacy Control** - Keep recipes private or share with the community
- 🍽️ **Diet Filtering** - Filter recipes by dietary preferences (vegan, vegetarian, gluten-free, etc.)
- 📊 **Nutrition Information** - Automatic calculation of calories, protein, carbs, and fats using Spoonacular API
- 🌍 **Cultural Flexibility** - Add ingredients from any cuisine or culture

### User Experience
- ⚡ **Quick Add Ingredients** - Rapidly add common ingredients without typing
- 🎨 **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- 🔄 **Real-time Updates** - Redux-powered state management for instant UI updates
- 🖼️ **Image Upload** - Upload recipe images via ImgBB API
- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing

### Technical Features
- 🎯 **Type Safety** - Full TypeScript implementation on frontend and backend
- 📡 **GraphQL API** - Single endpoint with flexible queries and mutations
- 🗄️ **PostgreSQL Database** - Robust relational database with TypeORM
- 🔄 **Redux Toolkit** - Modern Redux with async thunks for state management
- 🎭 **Code Splitting** - Optimized bundle sizes with lazy loading

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React 19 + TypeScript + Redux Toolkit         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Pages    │  │ Components │  │   Hooks    │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │  ┌─────────────────────────────────────────────┐     │  │
│  │  │         Redux Store (State Management)       │     │  │
│  │  └─────────────────────────────────────────────┘     │  │
│  │  ┌─────────────────────────────────────────────┐     │  │
│  │  │      GraphQL Client (Axios)                  │     │  │
│  │  └─────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/GraphQL
┌─────────────────────────────────────────────────────────────┐
│                  SERVER (Node.js + NestJS)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            GraphQL API (Apollo Server)                │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ Resolvers  │  │  Services  │  │   Guards   │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │  ┌─────────────────────────────────────────────┐     │  │
│  │  │        TypeORM (Database ORM)                │     │  │
│  │  └─────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  users | recipes | ingredients | recipe_ingredients  │  │
│  │     user_follows | user_savedrecipes                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → React Component dispatches Redux action
2. **Redux Action** → Async thunk calls GraphQL API via Axios
3. **GraphQL Request** → NestJS resolver receives query/mutation
4. **Business Logic** → Service layer processes request
5. **Database** → TypeORM executes SQL queries on PostgreSQL
6. **Response** → Data flows back through layers to Redux store
7. **UI Update** → React components automatically re-render

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.x | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Redux Toolkit** | 2.x | State management |
| **React Router** | 7.x | Navigation |
| **Axios** | 1.x | HTTP client |
| **Vite** | 7.x | Build tool |
| **Lucide React** | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | 10.x | Backend framework |
| **GraphQL** | 16.x | API layer |
| **Apollo Server** | 4.x | GraphQL server |
| **TypeORM** | 0.3.x | ORM |
| **PostgreSQL** | 14+ | Database |
| **JWT** | 9.x | Authentication |
| **bcrypt** | 5.x | Password hashing |

### External APIs
| Service | Purpose |
|---------|---------|
| **Spoonacular API** | Nutrition data calculation |
| **ImgBB API** | Image hosting and storage |

---

## 📁 Project Structure

```
dishcovery/
├── frontend/                    # React + TypeScript + Redux
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts       # GraphQL Axios client
│   │   │   └── graphql.queries.ts  # All GraphQL operations
│   │   ├── components/         # Reusable UI components
│   │   │   ├── forms/
│   │   │   ├── ingredients/
│   │   │   ├── layout/
│   │   │   ├── recipes/
│   │   │   ├── ui/
│   │   │   └── users/
│   │   ├── hooks/              # Custom Redux hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useRecipe.ts
│   │   │   ├── useIngredient.ts
│   │   │   └── useUser.ts
│   │   ├── pages/              # Route pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── BrowseRecipePage.tsx
│   │   │   ├── CreateRecipePage.tsx
│   │   │   ├── RecipePage.tsx
│   │   │   └── UserProfilePage.tsx
│   │   ├── store/              # Redux store
│   │   │   ├── store.ts
│   │   │   └── slices/
│   │   │       ├── authSlice.ts
│   │   │       ├── recipeSlice.ts
│   │   │       ├── ingredientSlice.ts
│   │   │       └── userSlice.ts
│   │   ├── styles/             # CSS files
│   │   ├── typings/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/              # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env                    # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                     # NestJS + GraphQL + PostgreSQL
│   ├── src/
│   │   ├── auth/               # Authentication
│   │   │   ├── jwt.guard.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── user/               # User module
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── user.service.ts
│   │   │   ├── user.resolver.ts
│   │   │   └── user.module.ts
│   │   ├── recipe/             # Recipe module
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── recipe.service.ts
│   │   │   ├── recipe.resolver.ts
│   │   │   └── recipe.module.ts
│   │   ├── ingredient/         # Ingredient module
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── ingredient.service.ts
│   │   │   ├── ingredient.resolver.ts
│   │   │   └── ingredient.module.ts
│   │   ├── helpers/            # Utility functions
│   │   │   ├── nutrition.helper.ts
│   │   │   └── upload-image.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env                    # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── schema.gql              # Auto-generated GraphQL schema
│
│
└── README.md                   # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| **Node.js** | 18.x or higher | JavaScript runtime |
| **npm** | 9.x or higher | Package manager |
| **PostgreSQL** | 14.x or higher | Database |
| **Git** | 2.x or higher | Version control |

Optional but recommended:
- **pgAdmin 4** - PostgreSQL GUI tool
- **Postman** or **Insomnia** - API testing
- **Redux DevTools** - Browser extension for debugging Redux

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MateoBitar/dishcovery.git
cd dishcovery
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration (see Environment Variables section)
```

### 3. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dishcovery;

# Exit psql
\q
```

The database tables will be automatically created by TypeORM when you start the backend (with `synchronize: true` in development).

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with backend GraphQL URL
```

---

## 🔐 Environment Variables

### Backend `.env` Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=9898
NODE_ENV=development

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=dishcovery

# Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# External APIs
SPOONACULAR_API_KEY=your_spoonacular_api_key_from_rapidapi
IMGBB_API_KEY=your_imgbb_api_key

# CORS
FRONTEND_URL=http://localhost:5173
```

#### Required API Keys:

**Spoonacular API** (Nutrition Data):
1. Sign up at [RapidAPI Spoonacular](https://rapidapi.com/spoonacular/api/recipe-food-nutrition)
2. Subscribe to a plan (free tier available)
3. Copy your API key

**ImgBB API** (Image Hosting):
1. Sign up at [ImgBB](https://imgbb.com/)
2. Go to [API page](https://api.imgbb.com/)
3. Copy your API key

**JWT_SECRET**:
- Generate a secure random string (minimum 32 characters)
- You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Frontend `.env` Configuration

Create a `.env` file in the `frontend/` directory:

```env
# GraphQL API Endpoint
VITE_GRAPHQL_URL=http://localhost:9898/graphql
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│    users    │────────▶│ user_savedrecipes │◀────────│   recipes   │
│             │         └──────────────────┘         │             │
│ • user_id   │                                       │ • recipe_id │
│ • username  │         ┌──────────────────┐         │ • user_id   │
│ • password  │────────▶│   user_follows   │         │ • title     │
│ • diet_pref │         └──────────────────┘         │ • nutrition │
│ • user_desc │                                       └─────────────┘
└─────────────┘                                              │
                                                             │
                                                             ▼
                                               ┌──────────────────────┐
                                               │ recipe_ingredients   │
                                               │                      │
                                               │ • recipe_id          │
                                               │ • ingredient_id      │
                                               │ • quantity           │
                                               │ • unit               │
                                               └──────────────────────┘
                                                             │
                                                             ▼
                                                      ┌─────────────┐
                                                      │ ingredients │
                                                      │             │
                                                      │ • id        │
                                                      │ • name      │
                                                      │ • category  │
                                                      └─────────────┘
```

### Tables

**users**
```sql
- user_id (UUID, PRIMARY KEY)
- username (VARCHAR, UNIQUE, NOT NULL)
- password_hash (VARCHAR, NOT NULL)
- diet_pref (VARCHAR, NULLABLE)
- user_desc (TEXT, NULLABLE)
```

**recipes**
```sql
- recipe_id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY → users.user_id)
- title (VARCHAR, NOT NULL)
- description (TEXT, NOT NULL)
- instructions (TEXT, NOT NULL)
- cook_time (INTEGER, NULLABLE)
- difficulty (VARCHAR, NULLABLE)
- is_public (BOOLEAN, DEFAULT TRUE)
- calories (DECIMAL, DEFAULT 0)
- protein (DECIMAL, DEFAULT 0)
- carbs (DECIMAL, DEFAULT 0)
- fat (DECIMAL, DEFAULT 0)
- image (TEXT, NULLABLE)
```

**ingredients**
```sql
- ingredient_id (UUID, PRIMARY KEY)
- name (VARCHAR, UNIQUE, NOT NULL)
- category (VARCHAR, NOT NULL)
```

**recipe_ingredients** (Join Table)
```sql
- id (UUID, PRIMARY KEY)
- recipe_id (UUID, FOREIGN KEY → recipes.recipe_id)
- ingredient_id (UUID, FOREIGN KEY → ingredients.ingredient_id)
- quantity (DECIMAL, NOT NULL)
- unit (VARCHAR, NOT NULL)
```

**user_follows** (Join Table)
```sql
- id (UUID, PRIMARY KEY)
- follower_id (UUID, FOREIGN KEY → users.user_id)
- following_id (UUID, FOREIGN KEY → users.user_id)
- followed_at (TIMESTAMP, DEFAULT NOW())
- UNIQUE(follower_id, following_id)
```

**user_savedrecipes** (Join Table)
```sql
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY → users.user_id)
- recipe_id (UUID, FOREIGN KEY → recipes.recipe_id)
- saved_at (TIMESTAMP, DEFAULT NOW())
- UNIQUE(user_id, recipe_id)
```

---

## 📡 API Documentation

### GraphQL Endpoint

```
POST http://localhost:9898/graphql
```

### Authentication

Protected operations require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Obtain a token by using the `loginUser` mutation.

### Key Operations (50+ total)

#### User Operations (16)
- `registerUser` - Create new account
- `loginUser` - Authenticate and get JWT token
- `getUserById` - Fetch user details
- `getUserProfile` - Get complete user profile with stats
- `updateUser` - Update user information (requires auth)
- `deleteUser` - Delete account (requires auth)
- `followUser` - Follow another user
- `unfollowUser` - Unfollow a user
- `isFollowing` - Check follow status
- `getFollowersCount` - Get follower count
- `getFollowingCount` - Get following count
- `saveRecipe` - Save recipe to collection
- `unsaveRecipe` - Remove saved recipe
- `getSavedRecipes` - Get user's saved recipes
- `isRecipeSavedByUser` - Check if recipe is saved
- `getDietPreference` - Get user's diet preference

#### Recipe Operations (16)
- `createRecipe` - Create new recipe (requires auth)
- `getRecipeById` - Fetch recipe details
- `getAllPublicRecipes` - Get all public recipes
- `getUserRecipes` - Get recipes by user
- `searchRecipesByTitle` - Search recipes
- `filterRecipes` - Filter by difficulty/time/diet
- `getRecipesByIngredients` - Find recipes with ingredients
- `updateRecipe` - Update recipe (requires auth + ownership)
- `deleteRecipe` - Delete recipe (requires auth + ownership)
- `countSavesForRecipe` - Get save count
- `addIngredientToRecipe` - Add ingredient (requires auth)
- `updateIngredientInRecipe` - Update ingredient (requires auth)
- `removeIngredientFromRecipe` - Remove ingredient (requires auth)
- `getIngredientsByRecipe` - Get recipe ingredients

#### Ingredient Operations (8)
- `createIngredient` - Add new ingredient
- `getIngredientById` - Fetch ingredient details
- `getAllIngredients` - Get all ingredients
- `getIngredientByName` - Search by name
- `getIngredientsByCategory` - Filter by category
- `updateIngredient` - Update ingredient
- `deleteIngredient` - Delete ingredient

### Example Queries

**Register User:**
```graphql
mutation {
  registerUser(input: {
    username: "john_chef"
    password: "SecurePass123!"
    diet_pref: "vegetarian"
    user_desc: "Home cook passionate about healthy meals"
  }) {
    user_id
    username
    diet_pref
  }
}
```

**Login:**
```graphql
mutation {
  loginUser(input: {
    username: "john_chef"
    password: "SecurePass123!"
  }) {
    token
    user {
      user_id
      username
    }
  }
}
```

**Create Recipe:**
```graphql
mutation {
  createRecipe(input: {
    title: "Creamy Tomato Pasta"
    description: "Quick and delicious pasta with tomato cream sauce"
    instructions: "Boil pasta. Sauté garlic. Add tomatoes and cream. Mix."
    cook_time: 20
    difficulty: "Easy"
    is_public: true
    ingredients: [
      { ingredient_id: "uuid-1", quantity: 2, unit: "cups" }
      { ingredient_id: "uuid-2", quantity: 1, unit: "can" }
    ]
  }) {
    recipe_id
    title
    calories
    protein
    carbs
    fat
  }
}
```

**Find Recipes by Ingredients:**
```graphql
query {
  getRecipesByIngredients(ingredientIds: ["uuid-1", "uuid-2"]) {
    recipe_id
    title
    cook_time
    difficulty
    calories
  }
}
```

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Backend runs on: `http://localhost:9898`
GraphQL Playground: `http://localhost:9898/graphql`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Preview production build locally
```

---

## 👨‍💻 Development Guide

### Frontend Development

**Adding a New Component:**
```bash
frontend/src/components/[category]/ComponentName.tsx
```

**Creating a Redux Slice:**
```typescript
// frontend/src/store/slices/newSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDataAsync = createAsyncThunk(
  'new/fetchData',
  async () => {
    // GraphQL API call
  }
);

const newSlice = createSlice({
  name: 'new',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle async actions
  }
});

export default newSlice.reducer;
```

**Adding GraphQL Operations:**
```typescript
// frontend/src/api/graphql.queries.ts
export const NEW_QUERY = `
  query {
    data {
      field
    }
  }
`;
```

### Backend Development

**Creating a New Module:**
```bash
cd backend
nest g module feature
nest g service feature
nest g resolver feature
```

**Adding a GraphQL Resolver:**
```typescript
// backend/src/feature/feature.resolver.ts
@Resolver()
export class FeatureResolver {
  @Query(() => [Feature])
  async getFeatures() {
    return this.featureService.findAll();
  }
  
  @Mutation(() => Feature)
  @UseGuards(JwtGuard)
  async createFeature(@Args('input') input: CreateFeatureInput) {
    return this.featureService.create(input);
  }
}
```

### Code Style

**TypeScript Configuration:**
- Strict mode enabled
- ESLint + Prettier configured
- Import order: React → External → Internal → Relative

**Naming Conventions:**
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (`useRecipe.ts`)
- Redux slices: camelCase with `Slice` suffix (`recipeSlice.ts`)
- GraphQL operations: UPPER_SNAKE_CASE (`CREATE_RECIPE_MUTATION`)

---

## 🧪 Testing

### Unit Tests (Coming Soon)

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
```

### E2E Tests (Coming Soon)

```bash
cd frontend
npm run test:e2e
```

### Manual Testing

Use GraphQL Playground at `http://localhost:9898/graphql` to test API operations.

---

## 🚢 Deployment

### Backend Deployment

**Recommended Platforms:**
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

**Pre-deployment Checklist:**
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set `synchronize: false` in TypeORM config
- [ ] Run database migrations
- [ ] Set all environment variables
- [ ] Enable CORS for production frontend URL
- [ ] Configure logging (Winston/Pino)
- [ ] Set up monitoring (Sentry/DataDog)

### Frontend Deployment

**Recommended Platforms:**
- Vercel
- Netlify
- Cloudflare Pages

**Pre-deployment Checklist:**
- [ ] Update `VITE_GRAPHQL_URL` to production API
- [ ] Run `npm run build`
- [ ] Test production build locally with `npm run preview`
- [ ] Configure redirects for SPA routing
- [ ] Set up CDN for assets

### Database Deployment

**Recommended Services:**
- Heroku Postgres
- Railway PostgreSQL
- AWS RDS
- DigitalOcean Managed Database

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Code Review Process:**
- Ensure all tests pass
- Follow TypeScript/ESLint guidelines
- Update documentation if needed
- Add tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Mateo Bitar**

- 🎓 Computer Science Student
- 📧 Email: [bitarmateo21@gmail.com](mailto:bitarmateo21@gmail.com)
- 🌐 GitHub: [@MateoBitar](https://github.com/MateoBitar)
- 💼 LinkedIn: [Mateo Bitar](https://www.linkedin.com/in/mateo-bitar)

---

## 🙏 Acknowledgments

- **Spoonacular API** - Nutrition data
- **ImgBB** - Image hosting
- **NestJS Team** - Excellent framework
- **Redux Toolkit Team** - State management solution
- **PostgreSQL Community** - Robust database

---

## 📞 Support

If you encounter any issues or have questions:

1. Create a new issue with detailed information
2. Contact: bitarmateo21@gmail.com

---

## 🗺️ Roadmap

### Phase 1 (Current) - Core Features ✅
- [x] User authentication
- [x] Recipe CRUD operations
- [x] Ingredient management
- [x] Recipe search and filtering
- [x] Save/follow functionality
- [x] Nutrition calculation
- [x] Image upload

### Phase 2 (Q1 2025) - Enhanced Features 🚧
- [ ] Recipe ratings and reviews
- [ ] Advanced search filters
- [ ] Recipe collections/meal plans
- [ ] Shopping list generation
- [ ] Recipe sharing via social media

### Phase 3 (Q2 2025) - Community Features 📅
- [ ] User comments on recipes
- [ ] Recipe variations/forks
- [ ] Cooking challenges
- [ ] Chef badges and achievements
- [ ] Recipe recommendations AI

### Phase 4 (Q3 2025) - Mobile & Analytics 📱
- [ ] React Native mobile app
- [ ] Cooking analytics dashboard
- [ ] Nutrition tracking over time
- [ ] Personalized recipe suggestions
- [ ] Voice-guided cooking mode

---

## 📊 Project Statistics

- **Total Lines of Code:** ~15,000+
- **Frontend Components:** 40+
- **GraphQL Operations:** 50+
- **Redux Slices:** 4
- **Database Tables:** 6
- **API Integrations:** 2 (Spoonacular, ImgBB)
- **Development Time:** 6 months

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Status:** Production Ready 🚀

---

Made with ❤️ and lots of ☕ by Mateo Bitar