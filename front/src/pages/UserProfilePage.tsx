// UserProfilePage.tsx
import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import UserProfile from '../components/users/UserProfile.tsx';
import Navbar from '../components/layout/NavBar.tsx';
import Button from '../components/ui/Button.tsx';
import { ArrowLeft } from 'lucide-react';
import { UserProfile as UserProfileType, Recipe } from '../typings';

// UserProfilePage component
export default function UserProfilePage(): ReactElement {
  // Hooks
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserProfile } = useUser();

  // State
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    if (!user?.user_id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await getUserProfile(user.user_id);
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load profile:', err);
          setError('User not found');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user?.user_id]);

  // Handlers
  const handleCancel = (): void => {
    setSelectedRecipe(null);
    setEditingRecipe(null);
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  return (
    <>
      <Navbar />

      <main
        style={{
          padding: '1rem',
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {!selectedRecipe && !editingRecipe && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              margin: '2rem 0 0.5rem 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'absolute', left: '0' }}>
              <Button variant="ghost" onClick={handleBack} className="back-button">
                <ArrowLeft className="icon-xs" />
                Go Back
              </Button>
            </div>

            <h1 style={{ margin: 0, textAlign: 'center' }}>My Profile</h1>
          </div>
        )}

        {loading && <p>Loading user profile...</p>}
        {error && <p className="status-message error">{error}</p>}

        {!loading && !error && profile && (
          <div style={{ width: '100%', marginTop: 0 }}>
            <UserProfile
              profile={profile}
              readonly={false}
              onSelectRecipe={(recipe: Recipe) => setSelectedRecipe(recipe)}
              onEditRecipe={(recipe: Recipe) => setEditingRecipe(recipe)}
              selectedRecipe={selectedRecipe}
              editingRecipe={editingRecipe}
              onBack={handleCancel}
            />
          </div>
        )}
      </main>
    </>
  );
}
