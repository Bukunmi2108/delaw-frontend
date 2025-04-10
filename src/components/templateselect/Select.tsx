import { useEffect, useState } from 'react';
import './Select.css'; 
import apiService from '../../api/api';

interface Category {
  id: string;
  name: string;
}

interface SelectProps {
  label?: string;
  onChange?: (value: string) => void;
}

function Select({ label = 'Choose a Legal Template:', onChange }: SelectProps) {
  const [selectedValue, setSelectedValue] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getAllCategories();
        if (Array.isArray(response)) {
          setCategories(response);
        } else if (response) {
          console.warn("API response for categories is not an array, attempting to use it as is.", response);
          setCategories([response] as Category[]);
        } else {
          setError("Failed to fetch categories: Empty response");
        }
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(`Failed to fetch categories: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="my-select-container">
      <label htmlFor="categorySelect" className="my-select-label">
        {label}
      </label>
      <div className="select-wrapper"> {/* Added wrapper for custom styling */}
        <select
          id="categorySelect"
          value={selectedValue}
          onChange={handleChange}
          className="my-select"
          disabled={loading || categories.length === 0}
        >
          <option value="" className="my-select-option" disabled>
            Choose Document Template
          </option>
          {loading && <option disabled className="my-select-option">Loading categories...</option>}
          {error && <option disabled className="my-select-option error">Error: {error}</option>}
          {categories.map((category) => (
            <option key={category.id} value={category.id} className="my-select-option">
              {category.name}
            </option>
          ))}
        </select>
        <div className="select-arrow"></div>
      </div>
    </div>
  );
}

export default Select;