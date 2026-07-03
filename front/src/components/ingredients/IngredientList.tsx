// IngredientList.tsx
import React, { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import { ChefHat, Plus, X } from "lucide-react";
import "../../styles/ingredients.css";
import { useIngredient } from "../../hooks/useIngredient";
import { Ingredient } from "../../typings";

// Props for IngredientList component
interface IngredientListProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onFindRecipes: (ingredientIds: string[]) => void;
}

// IngredientList component
export default function IngredientList({
  selectedIngredients,
  onIngredientsChange,
  onFindRecipes,
}: IngredientListProps): React.ReactElement {
  // State variables
  const [currentIngredient, setCurrentIngredient] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [visibleQuickAdd, setVisibleQuickAdd] = useState<string[]>([]);

  const { createIngredient, getAllIngredients, ingredients } = useIngredient();  // Ingredient hook

  // Load Ingredients
  useEffect(() => {
    getAllIngredients();
  }, [getAllIngredients]);

  // Add Ingredient to search recipes
  const handleAddToFilter = (): void => {
    const trimmed = currentIngredient.trim();
    const matchedIngredient = ingredients.find(
        ing => ing.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (
      matchedIngredient &&
      !selectedIngredients.some((ing) => ing.toLowerCase() === matchedIngredient.name.toLowerCase())  // Prevent duplicates
    ) {
      onIngredientsChange([...selectedIngredients, matchedIngredient.name]);
      setCurrentIngredient("");
    }
  };

  // Capitalize ingredient before saving in DB
  const capitalizeWords = (str: string): string =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Create Ingredient
  const handleCreateAndAdd = async (): Promise<void> => {
    try {
      const capitalizedName = capitalizeWords(currentIngredient.trim());
      const newIngredient: Ingredient | null = await createIngredient({
        name: capitalizedName,
        category: selectedCategory,
    });
      if (newIngredient) {
        onIngredientsChange([...selectedIngredients, newIngredient.name]);
      }
      setCurrentIngredient("");
      setSelectedCategory("");
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create ingredient:", err);
    }
  };

  // Remove Ingredient from filter
  const removeIngredient = (ingredient: string): void => {
    onIngredientsChange(
      selectedIngredients.filter((item) => item.toLowerCase() !== ingredient.toLowerCase())
    );
  };

  // Filter recipes by ingredients
  const handleFindRecipes = (): void => {
    const matchedIds = selectedIngredients
        .map(name => ingredients.find(i => i.name.toLowerCase() === name.toLowerCase())?.ingredient_id)
        .filter(Boolean) as string[];

    onFindRecipes(matchedIds);
  };

  // Quick Add
  const commonIngredients: string[] = [
    "Chicken", "Beef", "Pasta", "Rice", "Eggs", "Onions", "Garlic", "Tomatoes",
    "Cheese", "Milk", "Potatoes", "Peppers", "Olive Oil", "Salt", "Lemon",
    "Carrots", "Flour", "Sugar", "Butter",
  ];

  // Update visible Quick Add ingredients
  useEffect(() => {
    const initial = commonIngredients
      .filter((item) => !selectedIngredients.some((ing) => ing.toLowerCase() === item.toLowerCase()))
      .slice(0, 8);
    setVisibleQuickAdd(initial);
  }, [selectedIngredients]);

  // Click on Quick Add
  const handleQuickAdd = (ingredient: string): void => {
    const matchedIngredient = ingredients.find(
      (ing: Ingredient) => ing.name.toLowerCase() === ingredient.toLowerCase()
    );

    if (matchedIngredient) {
      onIngredientsChange([...selectedIngredients, matchedIngredient.name]);
    }

    // Update visible Quick Add list
    const nextHidden = commonIngredients.filter(
      (item) =>
        !visibleQuickAdd.includes(item) &&
        !selectedIngredients.some((ing) => ing.toLowerCase() === item.toLowerCase()) &&
        item.toLowerCase() !== ingredient.toLowerCase()
    );

    const updated = visibleQuickAdd.filter((item) => item !== ingredient);
    if (nextHidden.length > 0) updated.push(nextHidden[0]);
    setVisibleQuickAdd(updated);
  };

  return (
    <div className="ingredient-list">
      <div className="ingredient-card">
        {/* Header */}
        <div className="ingredient-header">
          <ChefHat className="icon" />
          <h3>What's in your kitchen?</h3>
        </div>

        {/* Input Row */}
        <div className="ingredient-input-row">
          <Input
            placeholder="Search ingredients..."
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
          />
          <Button
            onClick={handleAddToFilter}
            disabled={
              !currentIngredient.trim() ||
              !ingredients.some(
                (s: Ingredient) => s.name.toLowerCase() === currentIngredient.trim().toLowerCase()
              )
            }
          >
            <Plus className="icon-sm" />
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            disabled={
              !currentIngredient.trim() ||
              ingredients.some(
                (s: Ingredient) => s.name.toLowerCase() === currentIngredient.trim().toLowerCase()
              )
            }
          >
            Create
          </Button>
        </div>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <div className="ingredient-section">
            <h4>Your ingredients:</h4>
            <div className="ingredient-badges">
              {selectedIngredients.map((ingredient) => (
                <Badge key={ingredient} variant="outline" className="badge-pill">
                  {ingredient}
                  <Button
                    variant="ghost"
                    className="badge-close"
                    onClick={() => removeIngredient(ingredient)}
                  >
                    <X className="icon-xs" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Add */}
        <div className="ingredient-section">
          <h4>Quick add:</h4>
          <div className="ingredient-badges">
            {visibleQuickAdd.map((ingredient) => (
              <Badge
                key={ingredient}
                variant="outline"
                className="badge-clickable"
                onClick={() => handleQuickAdd(ingredient)}
              >
                + {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        {/* Find Recipes Button */}
        <Button
          onClick={handleFindRecipes}
          className="w-full"
          disabled={selectedIngredients.length === 0}
        >
          Find Recipes ({selectedIngredients.length} ingredients)
        </Button>

        {/* Create Modal */}
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <h3>Create New Ingredient</h3>
            <Input value={currentIngredient} disabled onChange={() => {}} />
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Protein">Protein</option>
              <option value="Grain">Grain</option>
              <option value="Dairy">Dairy</option>
              <option value="Spice">Spice</option>
              <option value="Fruit">Fruit</option>
              <option value="Seafood">Seafood</option>
              <option value="Condiment">Condiment</option>
              <option value="Herb">Herb</option>
              <option value="Sweetener">Sweetener</option>
              <option value="Beverage">Beverage</option>
              <option value="Baking">Baking</option>
            </select>
            <Button onClick={handleCreateAndAdd} disabled={!selectedCategory}>
              Confirm
            </Button>
          </Modal>
        )}
      </div>
    </div>
  );
}
