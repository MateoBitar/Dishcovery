// UserProfileWrapper.tsx
import { useEffect, useState, ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import UserProfile from "../components/users/UserProfile";
import Navbar from "../components/layout/NavBar";
import Button from "../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { UserProfile as UserProfileType, Recipe } from "../typings";

// UserProfileWrapper component
export default function UserProfileWrapper(): ReactElement {
  // Get user ID from URL params
  const { id } = useParams<{ id: string }>();

  // Hooks
  const navigate = useNavigate();
  const { getUserProfile } = useUser();

  // State
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await getUserProfile(id);
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load profile:", err);
          setError("User not found");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, getUserProfile]);

  // Handlers
  const handleBack = (): void => {
    setSelectedRecipe(null);
    setEditingRecipe(null);
  };

  return (
    <>
      <Navbar />

      <main
        style={{
          padding: "1rem",
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Back button always visible */}
        <div
          style={{
            position: "relative",
            width: "100%",
            margin: "2rem 0 0 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ position: "absolute", left: "0" }}>
            <Button
              variant="ghost"
              onClick={() => {
                if (selectedRecipe || editingRecipe) {
                  handleBack();
                } else {
                  navigate(-1);
                }
              }}
              className="back-button"
            >
              <ArrowLeft className="icon-xs" />
              Go Back
            </Button>
          </div>

          {/* Only show title when not editing/viewing */}
          {!selectedRecipe && !editingRecipe && (
            <h1 style={{ margin: 0, textAlign: "center" }}>User Profile</h1>
          )}
        </div>

        {loading && <p>Loading user profile...</p>}
        {error && <p className="status-message error">{error}</p>}

        {!loading && !error && profile && (
          <div style={{ width: "100%", marginTop: "0" }}>
            <UserProfile
              profile={profile}
              readonly
              onSelectRecipe={(recipe: Recipe) => setSelectedRecipe(recipe)}
              onEditRecipe={(recipe: Recipe) => setEditingRecipe(recipe)}
              selectedRecipe={selectedRecipe}
              editingRecipe={editingRecipe}
              onBack={handleBack}
            />
          </div>
        )}
      </main>
    </>
  );
}