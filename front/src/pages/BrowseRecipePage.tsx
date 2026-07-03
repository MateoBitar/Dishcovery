// BrowseRecipePage.tsx
import { useEffect, useState, ReactElement } from 'react';
import Navbar from '../components/layout/NavBar.tsx';
import SearchBar from '../components/forms/SearchBar.tsx';
import FilterBar from '../components/forms/FilterBar.tsx';
import RecipeList from '../components/recipes/RecipeList.tsx';
import { useRecipe } from '../hooks/useRecipe';
import { Recipe, FilterOptions } from '../typings';
import '../styles/recipes.css';

// BrowseRecipePage component
export default function BrowseRecipePage(): ReactElement {
  // Hooks
  const {
    getAllPublicRecipes,
    filterRecipes,
    searchRecipesByTitle,
  } = useRecipe();

  // State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    difficulty: undefined,
    cook_time: undefined,
    diet_pref: undefined,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load recipes when filters or search query change
  useEffect(() => {
    const loadRecipes = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        let data: Recipe[] = [];

        const cleanFilters: FilterOptions = {};
        if (filters.difficulty) {
          cleanFilters.difficulty = filters.difficulty;
        }
        if (filters.cook_time) {
          cleanFilters.cook_time = Number(filters.cook_time);
        }
        if (filters.diet_pref) {
          cleanFilters.diet_pref = filters.diet_pref;
        }

        const hasFilters = Object.keys(cleanFilters).length > 0;
        const hasSearch = searchQuery.trim() !== '';

        if (hasFilters && hasSearch) {
          const filteredData = (await filterRecipes(cleanFilters)) || [];
          data = filteredData.filter((recipe) =>
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else if (hasFilters) {
          // Only filters
          data = (await filterRecipes(cleanFilters)) || [];
        } else if (hasSearch) {
          // Only search
          data = (await searchRecipesByTitle(searchQuery)) || [];
        } else {
          // No filters or search - show all
          data = (await getAllPublicRecipes()) || [];
        }
        
        setRecipes(data);
      } catch (err) {
        console.error('Error loading recipes:', err);
        setError('Failed to load recipes. Please try again.');
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [filters, searchQuery, getAllPublicRecipes, filterRecipes, searchRecipesByTitle]);

  return (
    <div className="browse-page">
      <Navbar />

      <div className="browse-container">
        <div className="browse-header">
          <h1>Browse Recipes</h1>
        </div>

        <div className="browse-controls">
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>

        {loading && <p className="status-message">Loading recipes...</p>}
        {error && <p className="status-message error">{error}</p>}
        {!loading && !error && recipes.length === 0 && (
          <p className="status-message">No recipes found matching your criteria.</p>
        )}
        {!loading && !error && recipes.length > 0 && (
          <RecipeList recipes={recipes} context="homepage" />
        )}
      </div>
    </div>
  );
}