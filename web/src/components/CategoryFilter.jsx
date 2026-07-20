import { useEffect, useState } from "react";
import { getCategories } from "../api";

// Chip row that filters the archive by category (the secondary table).
export default function CategoryFilter({ selected, onSelect }) {
  const [categories, setCategories] = useState([]);

  //useEffect to get the categories from the database
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="chip-row" role="group" aria-label="Filter by category">
      <button //All button
        type="button"
        className="chip"
        aria-pressed={selected === "all"}
        onClick={() => onSelect("all")}
      >
        All
      </button>

      {/* map over the categories and create a button for each category */}
      {categories.map((cat) => (
        <button //Category buttons
          key={cat.id}
          type="button"
          className="chip"
          //set the aria-pressed attribute to the category id if the category is selected
          aria-pressed={selected === cat.id}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
