// RecipeList.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";
import { Recipe } from "../../typings";
import "../../styles/recipes.css";

// Props for RecipeList component
interface RecipeListProps {
  recipes?: Recipe[];
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
  onSelectRecipe?: (recipe: Recipe) => void;
  selectedRecipe?: Recipe | null;        // <-- added
  context?: "own-profile" | "readonly-profile" | "saved" | "homepage";
  savedRecipes?: Recipe[];
}

// RecipeList component
export default function RecipeList({
  recipes = [],
  onSelectRecipe,
  selectedRecipe,
  onEdit,
  onDelete,
  context,
}: RecipeListProps): React.ReactElement {
  // Hooks
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentProfile, getUserProfile } = useUser();

  // Load profile
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!currentProfile && user?.user_id) {
        try {
          await getUserProfile(user.user_id);
        } catch (err) {
          if (!cancelled) console.error("Failed to load profile:", err);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.user_id]);

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => {
        const recipeId = recipe.recipe_id;

        const showEditDelete = context === "own-profile" && recipe.user_id === user?.user_id;

        const isSelected = selectedRecipe?.recipe_id === recipeId;

        return (
          <RecipeCard
            key={recipeId}
            id={recipeId}
            title={recipe.title}
            description={recipe.description}
            image={recipe.image}
            cook_time={recipe.cook_time || 0}
            difficulty={recipe.difficulty}
            user_id={recipe.user_id}
            onClick={(id) => {
              if (onSelectRecipe) {
                onSelectRecipe(recipe);
              } else {
                navigate(`/recipe/${id}`);
              }
            }}
            onEdit={showEditDelete ? () => onEdit?.(recipe) : undefined}
            onDelete={showEditDelete ? () => onDelete?.(recipeId) : undefined}
            context={context}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
}
