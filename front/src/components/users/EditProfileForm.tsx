// EditProfileForm.tsx
import { useState } from "react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { Save, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { User, UpdateUserInput} from "../../typings";
import "../../styles/users.css";

// FormErrors interface
interface FormErrors {
  [key: string]: string;
}

// Props for EditProfileForm component
interface EditProfileFormProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

// FormData interface
interface FormData {
  username: string;
  bio?: string;
  dietary_preference?: string;
  password?: string;
}

// EditProfileForm component
export default function EditProfileForm({ user, onClose, onSave }: EditProfileFormProps) {
  // State
  const [formData, setFormData] = useState<FormData>({
    username: user.username,
    bio: user.user_desc || "",
    dietary_preference: user.diet_pref || "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const { updateUser } = useAuth(); // Hook to update user

  // Validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.username || formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validate() || loading) return;
    setLoading(true);

    // Prepare payload
    const payload: UpdateUserInput = {
      username: formData.username.trim(),
      user_desc: formData.bio?.trim() || "",
      diet_pref: formData.dietary_preference || "",
      ...(formData.password?.trim() && { password: formData.password.trim() }),
    };

    try {
      const updatedUser = await updateUser(payload);
      if (updatedUser) onSave(updatedUser);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-form">
      <h3 className="edit-title">Edit Profile</h3>

      <Input
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        error={errors.username}
      />

      <Textarea
        value={formData.bio ?? ""}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
      />

      <label>
        Diet Preference
        <select
          value={formData.dietary_preference}
          onChange={(e) =>
            setFormData({ ...formData, dietary_preference: e.target.value })
          }
          className="form-select"
        >
          <option value="">Select a diet preference</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten-Free</option>
          <option value="low-carb">Low-Carb</option>
          <option value="none">None</option>
        </select>
      </label>

      <Input
        type="password"
        value={formData.password || ""}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Leave blank to keep current password"
        error={errors.password}
      />

      <div className="edit-actions">
        <Button className="edit-btn" onClick={handleSubmit} disabled={loading}>
          <Save className="icon-xs" /> <span>{loading ? "Saving..." : "Save"}</span>
        </Button>
        <Button className="edit-btn variant-ghost" variant="ghost" onClick={onClose}>
          <X className="icon-xs" /> <span>Cancel</span>
        </Button>
      </div>
    </div>
  );
}
