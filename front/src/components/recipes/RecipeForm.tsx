// RecipeForm.tsx
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import IngredientSelector from '../ingredients/IngredientSelector.tsx';
import { Plus, Trash2 } from 'lucide-react';
import { useImageConverter } from '../../utils/imageConverter.ts';
import { CreateRecipeInput, RecipeIngredient } from '../../typings';
import '../../styles/recipes.css';

// Props for RecipeForm component
interface RecipeFormProps {
  initialData?: Partial<CreateRecipeInput> & { recipe_id?: string; image?: string; ingredients?: RecipeIngredient[] };
  onSubmit: (payload: any) => Promise<void>;
  onCancel?: () => void;
}

// RecipeForm component
export default function RecipeForm({
  initialData = {},
  onSubmit,
  onCancel,
}: RecipeFormProps): React.ReactElement {
  // State
  const [title, setTitle] = useState<string>(initialData.title || '');
  const [description, setDescription] = useState<string>(initialData.description || '');
  const [cookTime, setCookTime] = useState<string>(String(initialData.cook_time || ''));
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(
    (initialData.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Easy'
  );
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    initialData.ingredients?.map((i) => ({ ...i })) || []
  );
  const [instructions, setInstructions] = useState<string[]>(
    typeof initialData.instructions === 'string'
      ? initialData.instructions.split('\n')
      : initialData.instructions || []
  );
  const [newInstruction, setNewInstruction] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(initialData.is_public || false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Image handling
  const { base64, error: imageError, handleFileChange } = useImageConverter();

  // Sync ingredients if initialData changes
  useEffect(() => {
    if (!initialData.ingredients) return;

    const newIngredients = initialData.ingredients.map((i) => ({ ...i }));

    const isEqual = JSON.stringify(newIngredients) === JSON.stringify(ingredients);
    if (!isEqual) {
      setIngredients(newIngredients);
    }
  }, [initialData.ingredients]);

  // Handlers
  const handleAddInstruction = (): void => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleRemoveInstruction = (idx: number): void => {
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (isLoading) return; // prevent double submission

    setIsLoading(true); // start loading

    try {
      const cleanInstructions = instructions
        .filter((inst) => inst.trim())
        .map((inst) => inst.trim());

      const cleanIngredients = ingredients.map(({ ingredient_id, quantity, unit }) => ({
        ingredient_id,
        quantity: typeof quantity === 'string' ? parseFloat(quantity) || 0 : quantity,
        unit: unit ? unit.trim() : '',
      }));

      // Construct payload
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        cook_time: cookTime !== '' ? parseInt(cookTime, 10) : 0,
        difficulty: difficulty.trim(),
        instructions: cleanInstructions.join('\n'),
        ingredients: cleanIngredients,
        is_public: Boolean(isPublic),
        image: base64 || null,
      };

      // Include recipe_id if editing
      if (isEditMode && initialData.recipe_id) {
        payload.recipe_id = initialData.recipe_id;
      }

      await onSubmit(payload);
    } finally {
      setIsLoading(false); // stop loading
    }
  };

  const isEditMode = !!initialData.recipe_id;  // Determine if we are in edit mode

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h2>{initialData.recipe_id ? 'Edit Recipe' : 'Share Your Recipe'}</h2>

      <label>Recipe Title</label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Description</label>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Briefly describe your recipe..."
        required
      />

      <label>Upload Image (optional)</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageError && <p className="input-error-text">{imageError}</p>}
      {base64 && <img src={base64} alt="Preview" className="image-preview" />}
      {!base64 && initialData.image && (
        <img src={initialData.image} alt="Preview" className="image-preview" />
      )}

      <div className="form-row">
        <div>
          <label>Cook Time (minutes)</label>
          <Input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            required
            min="0"
          />
        </div>

        <div>
          <label>Difficulty</label>
          <select
            className="form-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
            required
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>

      <IngredientSelector
        ingredients={ingredients}
        onChange={setIngredients}
        isEditMode={isEditMode}
      />

      <label>Instructions</label>
      <div className="form-list">
        <Textarea
          value={newInstruction}
          onChange={(e) => setNewInstruction(e.target.value)}
          placeholder={`Step ${instructions.length + 1}`}
        />
        <Button type="button" onClick={handleAddInstruction}>
          <Plus className="icon-xs" /> Add
        </Button>
      </div>

      <ol className="form-preview-list">
        {instructions.map((step, i) => (
          <li key={i}>
            {step}
            <Trash2
              className="icon-xs delete-icon"
              onClick={() => handleRemoveInstruction(i)}
            />
          </li>
        ))}
      </ol>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        Make this recipe public
      </label>

      <div className="form-actions">
        <Button type="submit">
          {initialData.recipe_id ? 'Update Recipe' : 'Submit Recipe'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
