// HomePage.tsx
import { useState, useEffect, ReactElement } from 'react';
import NavBar from '../components/layout/NavBar.tsx';
import Footer from '../components/layout/Footer.tsx';
import IngredientList from '../components/ingredients/IngredientList.tsx';
import RecipeList from '../components/recipes/RecipeList.tsx';
import { useRecipe } from '../hooks/useRecipe';
import { useUser } from "../hooks/useUser";
import { useAuth } from "../hooks/useAuth";
import { Recipe } from '../typings';
import '../styles/home.css';

// HomePage component
export default function HomePage(): ReactElement {
  // State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { getAllPublicRecipes, getRecipesByIngredients } = useRecipe();
  const { currentProfile, getUserProfile } = useUser();
  const { user } = useAuth();

  // Fetch user profile on mount if not already loaded
  useEffect(() => {
    if (!currentProfile && user?.user_id) {
      getUserProfile(user.user_id).catch(console.error);
    }
  }, [currentProfile, getUserProfile, user?.user_id]);

  // Load initial recipes on mount or when selectedIngredients is cleared
  useEffect(() => {
    async function loadInitialRecipes() {
      setLoading(true);
      setError(null);
      try {
        const initialRecipes = await getAllPublicRecipes();
        setRecipes(initialRecipes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipes');
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }

    if (selectedIngredients.length === 0) {
      loadInitialRecipes();
    }
  }, [selectedIngredients, getAllPublicRecipes]);

  // Handle finding recipes based on selected ingredients
  const handleFindRecipes = async (ingredientIds: string[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (ingredientIds.length > 0) {
        const result = await getRecipesByIngredients(ingredientIds);
        
        // If we got a result but it's empty, fall back to all recipes
        if (result && result.length === 0) {
          const allRecipes = await getAllPublicRecipes();
          setRecipes(allRecipes || []);
        } else if (result) {
          // We have matching recipes
          setRecipes(result);
        } else {
          // API returned null/undefined, fall back to all recipes
          const allRecipes = await getAllPublicRecipes();
          setRecipes(allRecipes || []);
        }
      } else {
        // No ingredients selected, show all recipes
        const allRecipes = await getAllPublicRecipes();
        setRecipes(allRecipes || []);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      <NavBar />

      <main className="main-content">
        <section className="hero-text">
          <h1>What should I cook today?</h1>
          <p>
            Discover recipes that match your ingredients, share your culinary creations,
            and join a community of food lovers. Turn what you have into something amazing.
          </p>
        </section>

        <section className="ingredient-section">
          <IngredientList
            selectedIngredients={selectedIngredients}
            onIngredientsChange={setSelectedIngredients}
            onFindRecipes={handleFindRecipes}
          />
        </section>

        <section className="recipe-section">
          <h3>Featured Recipes</h3>
          {loading && <p className="status-message">Loading recipes...</p>}
          {error && <p className="status-message error">{error}</p>}
          {!loading && !error && recipes.length === 0 && (
            <p className="status-message">No recipes match your ingredients.</p>
          )}
          {!loading && !error && recipes.length > 0 && currentProfile && (
            <RecipeList
              recipes={recipes}
              context="homepage"
              savedRecipes={currentProfile.savedRecipes}
            />
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}