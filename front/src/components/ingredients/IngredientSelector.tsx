// IngredientSelector.tsx
import React, { useState, useEffect, useRef } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import "../../styles/recipes.css";
import { Plus, X } from "lucide-react";
import { useIngredient } from "../../hooks/useIngredient";
import { Ingredient, RecipeIngredient } from "../../typings";

// Common units for selection
const COMMON_UNITS: string[] = [
  "cups", "kg", "g", "tablespoon", "teaspoon", "ml", "l", "oz", "lb", "pinch",
];

// Props for IngredientSelector component
interface IngredientSelectorProps {
  ingredients: RecipeIngredient[];
  onChange: (ingredients: RecipeIngredient[]) => void;
  isEditMode?: boolean;
}

// IngredientSelector component
export default function IngredientSelector({
  ingredients,
  onChange,
  isEditMode = false,
}: IngredientSelectorProps): React.ReactElement {
  // State variables
  const [currentIngredient, setCurrentIngredient] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [unit, setUnit] = useState<string>(COMMON_UNITS[0]);
  const [error, setError] = useState<string>("");

  const { getAllIngredients, ingredients: allIngredients } = useIngredient();  // Ingredient hook
  const quantityRef = useRef<HTMLInputElement | null>(null);  // Ref for quantity input

  // Load all ingredients
  useEffect(() => {
    getAllIngredients();
  }, [getAllIngredients]);

  // Map ingredient_id to proper ingredient object for editing
  useEffect(() => {
    if (!isEditMode || !ingredients?.length) return;

    const mapped = ingredients.map((ing) => {
      const match = allIngredients.find(
        (ai: Ingredient) => ai.ingredient_id === ing.ingredient_id
      );
      return {
        ...ing,
        ingredient: {
          ingredient_id: ing.ingredient_id,
          name: match?.name || ing.ingredient?.name || "",
          category: match?.category || ing.ingredient?.category || "",
        },
        quantity: Number(ing.quantity),
      };
    });

    // Only update if there's a change
    if (JSON.stringify(mapped) !== JSON.stringify(ingredients)) {
      onChange(mapped);
    }
  }, [ingredients, allIngredients, onChange, isEditMode]);

  // Add ingredient to the list
  const addIngredient = (): void => {
    const name = currentIngredient.trim();
    const qtyStr = quantity.trim();

    if (!name || !qtyStr || !unit) {
      setError("Please fill all fields before adding.");
      return;
    }

    const qty = Number(qtyStr);
    if (isNaN(qty) || qty <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    const duplicate = ingredients.some(
      (i) => i.ingredient?.name?.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      setError(`Ingredient "${name}" is already added.`);
      return;
    }

    const match = allIngredients.find(
      (i: Ingredient) => i.name.toLowerCase() === name.toLowerCase()
    );
    if (!match) {
      setError("Ingredient not found. Please create it first.");
      return;
    }

    // Create new RecipeIngredient object
    const newIngredient: RecipeIngredient = {
      ingredient_id: match.ingredient_id,
      quantity: qty,
      unit,
      ingredient: { ...match },
    };

    onChange([...ingredients, newIngredient]);
    setCurrentIngredient("");
    setQuantity("");
    setUnit(COMMON_UNITS[0]);
    setError("");
    quantityRef.current?.focus();
  };

  // Remove ingredient from the list
  const removeIngredient = (id: string): void => {
    onChange(ingredients.filter((i) => i.ingredient_id !== id));
  };

  return (
    <div className="ingredient-selector">
      <label>Ingredients</label>
      <div className="ingredient-input-row">
        <Input
          placeholder="Ingredient name..."
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          className={error && !currentIngredient ? "input-error" : ""}
        />
        <Input
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          ref={quantityRef}
          className={`qty-input ${error && !quantity ? "input-error" : ""}`}
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className={`unit-input ${error && !unit ? "input-error" : ""}`}
        >
          {COMMON_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <Button
          onClick={addIngredient}
          disabled={!currentIngredient || !quantity || !unit}
        >
          <Plus className="icon-sm" style={{ color: "white" }} />
        </Button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {ingredients.length > 0 && (
        <div className="ingredient-section">
          <h4>Selected Ingredients</h4>
          <div className="ingredient-badges">
            {ingredients.map((ingredient) => (
              <Badge
                key={ingredient.ingredient_id}
                variant="default"
                className="badge-pill"
              >
                {ingredient.ingredient?.name} — {ingredient.quantity} {ingredient.unit}
                <Button
                  variant="ghost"
                  className="badge-close"
                  onClick={() => removeIngredient(ingredient.ingredient_id)}
                >
                  <X className="icon-xs" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
