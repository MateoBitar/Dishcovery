// RecipeDetails.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Bookmark, ChefHat, ArrowLeft, Heart } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import "../../styles/recipes.css";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";
import { useRecipe } from "../../hooks/useRecipe";
import { RecipeIngredient } from "../../typings";

// Props for RecipeDetails component
interface RecipeDetailsProps {
  recipe_id: string;
  title: string;
  description: string;
  image?: string;
  cook_time?: number;
  difficulty: string;
  ingredients?: RecipeIngredient[];
  instructions?: string | string[];
  user_id: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  onChefClick?: (userId: string) => void;
}

// RecipeDetails component
export default function RecipeDetails({
  recipe_id,
  title,
  description,
  image,
  cook_time,
  difficulty,
  ingredients = [],
  instructions = [],
  user_id,
  calories,
  protein,
  carbs,
  fat,
  onChefClick,
}: RecipeDetailsProps): React.ReactElement {
  // Hooks
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserById } = useUser();
  const { countSavesForRecipe, saveRecipe, unsaveRecipe, isRecipeSavedByUser } = useRecipe();

  // State
  const [author, setAuthor] = useState<string | null>(null);
  const [saveCount, setSaveCount] = useState<number>(0);
  const [saved, setSaved] = useState<boolean>(false);

  // Fetch save count
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!recipe_id) return;
      try {
        const result = await countSavesForRecipe(recipe_id);
        if (!cancelled) setSaveCount(result?.count ?? 0);
      } catch (err) {
        if (!cancelled) console.error("Failed to fetch save count:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [recipe_id, countSavesForRecipe]);

  // Fetch author (lightweight)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user_id) return;
      try {
        const authorData = await getUserById(user_id);
        if (!cancelled) setAuthor(authorData?.username || "Unknown Chef");
      } catch {
        if (!cancelled) setAuthor("Unknown Chef");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user_id, getUserById]);

  // Check if recipe is saved by current user
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const uid = user?.user_id;
      if (!uid || !recipe_id) return;  // No user or recipe ID
      try {
        const result = await isRecipeSavedByUser(uid, recipe_id);
        if (!cancelled) setSaved(!!result);
      } catch (err) {
        if (!cancelled) console.error("Failed to fetch saved status:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.user_id, recipe_id, isRecipeSavedByUser]);

  // Handle save click
  const handleSaveToggle = async (): Promise<void> => {
    if (!user?.user_id) return;
    try {
      if (saved) {
        await unsaveRecipe(recipe_id, user.user_id);
      } else {
        await saveRecipe(recipe_id, user.user_id);
      }
      setSaved(!saved);

      const result = await countSavesForRecipe(recipe_id);
      setSaveCount(result?.count ?? 0);
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  // Parse instructions
  const parsedInstructions =
    typeof instructions === "string"
      ? instructions
          .split(/\r?\n|\d+\.\s|,/)
          .map((step) => step.trim())
          .filter((step) => step.length > 0)
      : instructions;

  const safeTitle = title || "Untitled Recipe";
  const safeDifficulty = difficulty ? difficulty.toLowerCase() : "unknown";

  return (
    <div className="recipe-details">
      <Button variant="ghost" onClick={() => navigate("/home")} className="back-button">
        <ArrowLeft className="icon-xs" />
        Back to recipes
      </Button>

      <div className="recipe-grid">
        <div className="recipe-left">
          <div className="recipe-banner">
            <img src={image || "/placeholder.jpg"} alt={safeTitle} />
            <Badge className={`difficulty-badge ${safeDifficulty}`}>
              {difficulty || "N/A"}
            </Badge>
          </div>

          <div className="recipe-meta">
            <span>
              <Clock className="icon-xs" /> {cook_time ?? "--"} min
            </span>
            <span>
              <Bookmark className="icon-xs" /> {saveCount} saved
            </span>
            {author && (
              <span className="chef-link" onClick={() => onChefClick?.(user_id)}>
                <ChefHat className="icon-xs" /> by {author}
              </span>
            )}
          </div>

          <div className="recipe-actions">
            {user?.user_id !== user_id && (
              <Button
                variant="outline"
                onClick={handleSaveToggle}
                className="save-button"
              >
                <Heart
                  className="icon-xs"
                  fill={saved ? "#22c55e" : "none"}
                  color="#22c55e"
                />
                {saved ? "Saved" : "Save Recipe"}
              </Button>
            )}
          </div>
        </div>

        <div className="recipe-right">
          <h1>{safeTitle}</h1>
          <p className="recipe-description">{description || "No description."}</p>

          <div className="nutrition-badges">
            <Badge variant="outline">🔥 {calories ?? "--"} kcal</Badge>
            <Badge variant="outline">🥩 {protein ?? "--"}g protein</Badge>
            <Badge variant="outline">🍞 {carbs ?? "--"}g carbs</Badge>
            <Badge variant="outline">🧈 {fat ?? "--"}g fat</Badge>
          </div>

          <h3>Ingredients</h3>
          <ul className="ingredient-list">
            {ingredients.length > 0 ? (
              ingredients.map((item) => (
                <li key={item.ingredient_id}>
                  {item.ingredient?.name || "Unknown Ingredient"} — {item.quantity}{" "}
                  {item.unit}
                </li>
              ))
            ) : (
              <li>No ingredients listed.</li>
            )}
          </ul>
        </div>
      </div>

      <hr className="divider" />

      <div className="instructions-section">
        <h3>Instructions</h3>
        <ol className="instruction-list">
          {parsedInstructions.length > 0 ? (
            parsedInstructions.map((step, i) => (
              <li key={i} className="instruction-step">
                <span className="step-bubble">{i + 1}</span>
                <p>{step}</p>
              </li>
            ))
          ) : (
            <li>No instructions available.</li>
          )}
        </ol>
      </div>
    </div>
  );
}