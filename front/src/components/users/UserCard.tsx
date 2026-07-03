// UserCard.tsx
import React, { useState } from 'react';
import { Heart, Edit3, ChefHat } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EditProfileForm from './EditProfileForm';
import { UserProfile, User } from '../../typings';
import '../../styles/users.css';

// Props for UserCard component
interface UserCardProps {
  profile: UserProfile;
  readonly?: boolean;
  isFollowing?: boolean;
  showFollowButton?: boolean;
  onFollowToggle?: () => Promise<void>;
  onUpdateUser?: (user: User) => void;
}

// UserCard component
export default function UserCard({
  profile,
  readonly = false,
  isFollowing,
  showFollowButton = false,
  onFollowToggle,
  onUpdateUser,
}: UserCardProps): React.ReactElement {
  // Destructure profile data
  const {
    user: { username, user_desc, diet_pref },
    followersCount,
    followingCount,
    savedRecipes = [],
    userRecipes = [],
  } = profile;

  const [isEditing, setIsEditing] = useState<boolean>(false); // State for edit mode

  return (
    <div className="user-card">
      <div className="user-header">
        <div className="avatar">
          <span className="avatar-icon">{username[0]}</span>
        </div>

        <div className="user-info">
          <h3>{username}</h3>
          <p className="user-desc">{user_desc}</p>
          {diet_pref && <Badge variant="outline">{diet_pref}</Badge>}
        </div>

        <div className="user-actions">
          {showFollowButton && (
            <Button onClick={onFollowToggle}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}

          {!readonly && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit3 className="icon-xs" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="user-stats">
        <span>
          <strong>{followersCount}</strong> Followers
        </span>
        <span>
          <strong>{followingCount}</strong> Following
        </span>
        <span>
          <Heart className="icon-xs" /> {savedRecipes.length} Saved
        </span>
        <span>
          <ChefHat className="icon-xs" /> {userRecipes.length} Recipes
        </span>
      </div>

      {isEditing && (
        <EditProfileForm
          user={profile.user}
          onClose={() => setIsEditing(false)}
          onSave={(updatedUser: User) => {
            if (onUpdateUser) onUpdateUser(updatedUser);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}
