import { useState } from "react";
import { tokiPonaSymbols } from "../data/tokiPonaSymbols";
import SymbolList from "../components/SymbolList";

const Symbols = () => {
  const [viewMode, setViewMode] = useState("grid");

  const totalSymbols = tokiPonaSymbols.length;
  const categories = [...new Set(tokiPonaSymbols.map((s) => s.category))];

  return (
    <div className="symbols-page">
      <div className="container">
        <div className="page-header">
          <h1>Toki Pona Symbols</h1>
          <p className="page-description">
            Browse the complete collection of sitelen pona (Toki Pona symbols)
            with translations and examples.
          </p>
        </div>

        <div className="symbols-info">
          <div className="info-card">
            <h3>Symbol Count</h3>
            <p className="info-value">{totalSymbols}</p>
          </div>
          <div className="info-card">
            <h3>Categories</h3>
            <p className="info-value">{categories.length}</p>
          </div>
          <div className="info-card">
            <h3>Writing System</h3>
            <p className="info-value">Logographic</p>
          </div>
        </div>

        <div className="view-options">
          <button
            type="button"
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            List View
          </button>
        </div>

        <div className={`symbols-container ${viewMode}`}>
          <SymbolList symbols={tokiPonaSymbols} />
        </div>

        <div className="symbol-reference-info">
          <h3>About sitelen pona</h3>
          <p>
            Sitelen pona (meaning "simple drawing" or "good drawing") is the
            most common writing system for Toki Pona. Each symbol represents one
            word in the Toki Pona language. The symbols were designed to be
            visually intuitive and easy to draw, reflecting the philosophy of
            simplicity that underlies the language itself.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Symbols;
