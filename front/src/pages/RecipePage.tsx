// RecipePage.tsx
import { useEffect, useState, ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRecipe } from "../hooks/useRecipe";
import RecipeDetails from "../components/recipes/RecipeDetails";
import NavBar from "../components/layout/NavBar";
import { Recipe } from "../typings";

// RecipePage component
export default function RecipePage(): ReactElement {
  // Get recipe ID from URL params
  const { id } = useParams<{ id: string }>();

  // Hooks
  const { getRecipeById } = useRecipe();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipe by ID on mount or when ID changes
  useEffect(() => {
    async function fetchRecipe(): Promise<void> {
      try {
        if (id) {
          const data = await getRecipeById(id);
          setRecipe(data);
        }
      } catch {
        setError("Recipe not found.");
      }
    }
    fetchRecipe();
  }, [id, getRecipeById]);

  // Handle clicking on the chef/author
  const handleChefClick = (userId: string): void => {
    if (userId === user?.user_id) {
      navigate("/profile");
    } else {
      navigate(`/user/${userId}`);
    }
  };

  return (
    <div className="recipe-page">
      <NavBar />
      <main className="main-content">
        {error && <p className="status-message error">{error}</p>}
        {recipe && (
          <RecipeDetails
            {...recipe}
            onChefClick={handleChefClick}
          />
        )}
      </main>
    </div>
  );
}