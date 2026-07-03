// FilterBar.tsx
import React from 'react';
import { FilterOptions } from '../../typings';

// Props for FilterBar component
interface FilterBarProps {
  filters: Partial<FilterOptions>;
  setFilters: React.Dispatch<React.SetStateAction<Partial<FilterOptions>>>;
}

// FilterBar component
export default function FilterBar({ filters, setFilters }: FilterBarProps): React.ReactElement {
  // Handle filter change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-bar">
      <h2>Filters:</h2>
      <select
        name="difficulty"
        className="form-select"
        value={filters.difficulty || ''}
        onChange={handleChange}
      >
        <option value="">All Levels</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <select
        name="cook_time"
        className="form-select"
        value={filters.cook_time || ''}
        onChange={handleChange}
      >
        <option value="">Any Time</option>
        <option value="10">Under 10 min</option>
        <option value="15">Under 15 min</option>
        <option value="30">Under 30 min</option>
        <option value="45">Under 45 min</option>
        <option value="60">Under 1 hour</option>
        <option value="90">Up to 1.5 hours</option>
        <option value="120">Up to 2 hours</option>
      </select>

      <select
        name="diet_pref"
        className="form-select"
        value={filters.diet_pref || ''}
        onChange={handleChange}
      >
        <option value="">All Categories of Cooks</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="gluten-free">Gluten-Free</option>
        <option value="low-carb">Low-Carb</option>
        <option value="none">None</option>
      </select>
    </div>
  );
}
