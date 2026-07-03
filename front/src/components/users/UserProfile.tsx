// UserProfile.tsx
import React, { useState, useEffect, useMemo } from "react";
import UserCard from "./UserCard";
import RecipeForm from "../recipes/RecipeForm";
import RecipeList from "../recipes/RecipeList";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";
import { useRecipe } from "../../hooks/useRecipe";
import { UserProfile as UserProfileType, Recipe, User } from "../../typings";
import "../../styles/users.css";

// Props for UserProfile component
interface UserProfileProps {
  profile: UserProfileType;
  readonly?: boolean;
  onEditRecipe?: (recipe: Recipe) => void;
  editingRecipe?: Recipe | null;
  selectedRecipe?: Recipe | null;
  onSelectRecipe?: (recipe: Recipe) => void;
  onBack?: () => void;
}

// UserProfile component
export default function UserProfile({
  profile: initialProfile,
  readonly = false,
  onEditRecipe,
  editingRecipe,
  selectedRecipe,
  onBack,
}: UserProfileProps): React.ReactElement {
  // State and hooks
  const [profile, setProfile] = useState<UserProfileType>(initialProfile);
  const { user } = useAuth();
  const { currentProfile, getUserProfile, checkIsFollowing, followUser, unfollowUser, loading, error } = useUser();
  const { deleteRecipe, updateRecipe, getRecipeById } = useRecipe();
  const [activeTab, setActiveTab] = useState<"public" | "private" | "saved">("public");
  const [isFollowingState, setIsFollowingState] = useState<boolean | null>(null);

  // Filter recipes by type
  const publicRecipes = useMemo(
    () => (profile.userRecipes || []).filter((r) => r.is_public),
    [profile.userRecipes]
  );
  const privateRecipes = useMemo(
    () => (profile.userRecipes || []).filter((r) => !r.is_public),
    [profile.userRecipes]
  );
  const savedRecipes = useMemo(
    () => (readonly ? currentProfile?.savedRecipes || [] : profile.savedRecipes || []),
    [readonly, profile.savedRecipes, currentProfile?.savedRecipes]
  );

  // Determine which recipes to show
  const recipesToShow = readonly
    ? publicRecipes
    : activeTab === "public"
    ? publicRecipes
    : activeTab === "private"
    ? privateRecipes
    : savedRecipes;

  // Determine context for RecipeList
  const getRecipeContext = (): "readonly-profile" | "saved" | "own-profile" => {
    if (readonly) return "readonly-profile";
    if (activeTab === "saved") return "saved";
    return "own-profile";
  };

  // Load current profile for readonly
  useEffect(() => {
    if (readonly && user?.user_id && !currentProfile) {
      getUserProfile(user.user_id).catch(console.error);
    }
  }, [readonly, user?.user_id, currentProfile, getUserProfile]);

  // Check follow status
  useEffect(() => {
    if (readonly && user?.user_id && profile?.user?.user_id) {
      checkIsFollowing(user.user_id, profile.user.user_id)
        .then((result) => setIsFollowingState(Boolean(result)))
        .catch(console.error);
    }
  }, [readonly, user?.user_id, profile.user.user_id, checkIsFollowing]);

  // Fetch full recipe if needed
  useEffect(() => {
    if (editingRecipe && !editingRecipe.ingredients && !(editingRecipe as any).loadingFull) {
      getRecipeById(editingRecipe.recipe_id)
        .then((fullRecipe) => onEditRecipe?.({ ...fullRecipe, loadingFull: true } as any))
        .catch(console.error);
    }
  }, [editingRecipe, getRecipeById, onEditRecipe]);

  // Handlers
  const handleDelete = async (id: string) => {
    try {
      await deleteRecipe(id);
      setProfile((prev) => ({
        ...prev,
        userRecipes: (prev.userRecipes || []).filter((r) => r.recipe_id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  const handleUpdate = async (updatedData: any) => {
    if (!editingRecipe) return;
    try {
      await updateRecipe(editingRecipe.recipe_id, updatedData);
      onBack?.();
    } catch (err) {
      console.error("Failed to update recipe:", err);
    }
  };

  const handleFollowToggle = async () => {
    if (!user?.user_id) return;
    try {
      if (isFollowingState) {
        await unfollowUser(user.user_id, profile.user.user_id);
        setIsFollowingState(false);
      } else {
        await followUser(user.user_id, profile.user.user_id);
        setIsFollowingState(true);
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };

  // Show RecipeForm if editing
  if (editingRecipe) {
    return <RecipeForm initialData={editingRecipe} onSubmit={handleUpdate} onCancel={onBack} />;
  }

  return (
    <div className="user-profile">
      <UserCard
        profile={profile}
        readonly={readonly}
        isFollowing={isFollowingState ?? false}
        showFollowButton={readonly && user?.user_id !== profile.user.user_id}
        onFollowToggle={handleFollowToggle}
        onUpdateUser={(updatedUser: User) => setProfile((prev) => ({ ...prev, user: updatedUser }))}
      />

      {!readonly && (
        <div className="profile-tabs">
          <button className={activeTab === "public" ? "active" : ""} onClick={() => setActiveTab("public")}>
            Public ({publicRecipes.length})
          </button>
          <button className={activeTab === "private" ? "active" : ""} onClick={() => setActiveTab("private")}>
            Private ({privateRecipes.length})
          </button>
          <button className={activeTab === "saved" ? "active" : ""} onClick={() => setActiveTab("saved")}>
            Saved ({savedRecipes.length})
          </button>
        </div>
      )}

      {readonly && <h2 className="profile-title">Public Recipes</h2>}

      {loading && <p className="status-message">Loading recipes...</p>}
      {error && <p className="status-message error">{error}</p>}
      {!loading && !error && recipesToShow.length === 0 && <p className="status-message">No recipes to display.</p>}
      {!loading && !error && recipesToShow.length > 0 && (
        <RecipeList
          recipes={recipesToShow}
          selectedRecipe={selectedRecipe}
          onSelectRecipe={undefined}
          onEdit={!readonly && activeTab !== "saved" ? onEditRecipe : undefined}
          onDelete={!readonly && activeTab !== "saved" ? handleDelete : undefined}
          context={getRecipeContext()}
          savedRecipes={savedRecipes}
        />
      )}
    </div>
  );
}
