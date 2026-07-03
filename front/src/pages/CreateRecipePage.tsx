// CreateRecipePage.tsx
import { ReactElement } from 'react';
import RecipeForm from '../components/recipes/RecipeForm.tsx';
import Navbar from '../components/layout/NavBar.tsx';
import { useRecipe } from '../hooks/useRecipe';
import { useNavigate } from 'react-router-dom';
import { CreateRecipeInput } from '../typings';

// CreateRecipePage component
export default function CreateRecipePage(): ReactElement {
  // Hooks
  const { createRecipe } = useRecipe();
  const navigate = useNavigate();

  // Handle recipe creation
  const handleCreate = async (recipeData: CreateRecipeInput): Promise<void> => {
    try {
      await createRecipe(recipeData);
      navigate('/home');
    } catch (err) {
      console.error('Failed to create recipe:', err);
    }
  };

  return (
    <>
      <Navbar />
      <RecipeForm
        onSubmit={handleCreate}
        onCancel={() => navigate(-1)}
      />
    </>
  );
}
