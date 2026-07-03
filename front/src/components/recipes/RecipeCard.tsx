// RecipeCard.tsx
import React, { useState, useEffect } from "react";
import { Clock, Heart, ChefHat, Pencil, Trash2 } from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { useRecipe } from "../../hooks/useRecipe";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/recipes.css";

// Props for RecipeCard component
interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  cook_time: number;
  difficulty: string;
  user_id: string;
  onClick?: (id: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  context?: "homepage" | "readonly-profile" | "own-profile" | "saved";
  isSelected?: boolean;
}

// RecipeCard component
export default function RecipeCard({
  id,
  title,
  description,
  image,
  cook_time,
  difficulty,
  user_id,
  onClick,
  onEdit,
  onDelete,
  context = "homepage",
  isSelected = false,
}: RecipeCardProps): React.ReactElement {
  const [author, setAuthor] = useState<string>("Unknown Chef");  // State for author name
  const [saved, setSaved] = useState<boolean | null>(null); // null = loading

  // Hooks
  const { user } = useAuth();
  const { userProfiles, getUserById } = useUser();
  const { saveRecipe, unsaveRecipe, isRecipeSavedByUser } = useRecipe();

  // Fetch actual saved status from backend on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.user_id) return;  // No user logged in

      try {
        const result = await isRecipeSavedByUser(user.user_id, id);
        if (!cancelled) setSaved(!!result);
      } catch (err) {
        console.error("Failed to fetch saved status:", err);
        if (!cancelled) setSaved(false); // fallback
      }
    })();
    return () => { cancelled = true; };
  }, [user?.user_id, id, isRecipeSavedByUser]);

  // Fetch author only if not cached
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user_id) return;

      const cached = userProfiles[user_id];
      if (cached) {
        if (!cancelled) setAuthor(cached.user.username || "Unknown Chef");
        return;
      }

      try {
        const authorData = await getUserById(user_id);
        if (!cancelled) setAuthor(authorData?.username || "Unknown Chef");
      } catch {
        if (!cancelled) setAuthor("Unknown Chef");
      }
    })();
    return () => { cancelled = true; };
  }, [user_id, userProfiles, getUserById]);

  // Handle save/unsave toggle
  const handleToggleSave = async (): Promise<void> => {
    if (!user?.user_id || saved === null) return;

    try {
      if (saved) {
        await unsaveRecipe(id, user.user_id);
        setSaved(false);
      } else {
        await saveRecipe(id, user.user_id);
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Determine which buttons to show based on context
  const showEditDelete = context === "own-profile" && user?.user_id === user_id;
  const showSave =
    (context === "homepage" && user?.user_id !== user_id) ||
    context === "readonly-profile" ||
    context === "saved";

  return (
    <div
      className={`recipe-card ${isSelected ? "selected-recipe" : ""}`}
      onClick={() => onClick?.(id)}
    >
      <div className="recipe-image">
        <img src={image || "../../assets/main.png"} alt={title} />

        {showSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleSave();
            }}
            className="save-btn"
            aria-label={saved ? "Unsave" : "Save"}
            style={{ border: "2px solid white", backgroundColor: "white" }}
            disabled={saved === null} // disable until status loads
          >
            <Heart
              className="heart-icon"
              fill={saved ? "#22c55e" : "white"}
              color="#22c55e"
            />
          </button>
        )}

        <span className={`difficulty-badge difficulty-${difficulty?.toLowerCase()}`}>
          {difficulty}
        </span>
      </div>

      <div className="recipe-content">
        <div className="recipe-content-header">
          <h3>{title}</h3>
          {showEditDelete && (
            <div className="edit-delete-icons">
              {onEdit && (
                <Pencil
                  className="icon-action edit"
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                />
              )}
              {onDelete && (
                <Trash2
                  className="icon-action delete"
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                />
              )}
            </div>
          )}
        </div>
        <p>{description?.length > 100 ? description.slice(0, 100) + "..." : description}</p>
      </div>

      <div className="recipe-footer">
        <div className="recipe-footer-left">
          <div className="recipe-meta">
            <Clock className="icon-sm" /> <span>{cook_time || 0} m</span>
          </div>
        </div>
        <div className="recipe-footer-right">
          <div className="recipe-author">
            <ChefHat className="icon-sm" /> <span>{author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
