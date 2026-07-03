// SearchBar.tsx
import React, { useEffect, useState } from 'react';
import { useRecipe } from '../../hooks/useRecipe';
import { Recipe } from '../../typings';

// Props for SearchBar component
interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

// SearchBar component
export default function SearchBar({ query, setQuery }: SearchBarProps): React.ReactElement {
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);  // State for search suggestions
  const [isTyping, setIsTyping] = useState(false);  // State to track if user is typing
  const { searchRecipesByTitle } = useRecipe();     // Recipe hook

  // Fetch suggestions when query changes
  useEffect(() => {
    if (!isTyping || query.trim().length <= 1) return;  // Only search when typing and query length > 1

    // Fetch suggestions based on query
    const fetchSuggestions = async (): Promise<void> => {
      const results = await searchRecipesByTitle(query);
      setSuggestions(results || []);
    };

    const debounce = setTimeout(fetchSuggestions, 300);  // Debounce for 300ms
    return () => clearTimeout(debounce);
  }, [query, isTyping, searchRecipesByTitle]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
    setIsTyping(true);
  };

  // Handle selecting a suggestion
  const handleSelect = (title: string): void => {
    setQuery(title);
    setSuggestions([]);
    setIsTyping(false);
  };

  return (
    <div className="search-bar" style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Search recipes..."
        value={query}
        onChange={handleChange}
      />
      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((r) => (
            <li key={r.recipe_id} onClick={() => handleSelect(r.title)}>
              {r.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
