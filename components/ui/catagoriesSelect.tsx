"use client";

import React, { useEffect, useState } from "react";
import { fetchFromNest } from "@/hooks/useFetch";

interface Category {
  id: number;
  name: string;
}

interface CategorySelectProps {
  /**
   * Currently selected category ID (if any).
   * If null, then no category is selected.
   */
  value: number | null;

  /**
   * Callback to notify parent when the user chooses a category.
   */
  onChange: (categoryId: number | null) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories once when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        // Example endpoint: GET /admin/categories (global categories)
        const data = await fetchFromNest("/admin/categories");
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Could not load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value ? Number(event.target.value) : null;
    onChange(categoryId);
  };

  return (
    <div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {loading && <p className="text-gray-500 mb-2">Loading categories...</p>}

      <select
        disabled={loading || !!error}
        value={value ?? ""}
        onChange={handleSelect}
        className="border rounded px-2 py-1"
      >
        <option value="">-- Select a Category --</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
