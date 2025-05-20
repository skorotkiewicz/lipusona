import { useState, useEffect } from "react";
import SymbolCard from "./SymbolCard";

const SymbolList = ({ symbols }) => {
  const [filteredSymbols, setFilteredSymbols] = useState(symbols);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...new Set(symbols.map((s) => s.category))];

  useEffect(() => {
    filterSymbols();
  }, [searchTerm, selectedCategory]);

  const filterSymbols = () => {
    let results = symbols;

    if (searchTerm.trim() !== "") {
      results = results.filter(
        (symbol) =>
          symbol.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
          symbol.translation.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      results = results.filter(
        (symbol) => symbol.category === selectedCategory,
      );
    }

    setFilteredSymbols(results);
  };

  return (
    <div className="symbol-list">
      <div className="filter-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search symbols or meanings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <span className="filter-label">Filter by category: </span>
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredSymbols.length > 0 ? (
        <div className="symbols-grid">
          {filteredSymbols.map((symbol) => (
            <SymbolCard key={symbol.id} symbol={symbol} interactive={true} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No symbols found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default SymbolList;
