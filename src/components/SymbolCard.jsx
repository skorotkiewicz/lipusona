import { useState } from "react";

const SymbolCard = ({
  symbol,
  showTranslation = true,
  interactive = false,
  onSelect,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    if (interactive) {
      setFlipped(!flipped);
      if (onSelect) onSelect(symbol);
    } else if (!showTranslation) {
      setShowDetails(!showDetails);
    }
  };

  return (
    <div
      className={`symbol-card ${flipped ? "flipped" : ""} ${interactive ? "interactive" : ""}`}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="symbol-image">
            <img
              src={symbol.symbol}
              alt={`Toki Pona symbol for ${symbol.word}`}
            />
          </div>
          <h3 className="symbol-word">{symbol.word}</h3>
          {showTranslation && (
            <p className="symbol-translation">{symbol.translation}</p>
          )}
        </div>

        {interactive && (
          <div className="card-back">
            <div className="card-back-content">
              <h3>{symbol.word}</h3>
              <p className="translation">{symbol.translation}</p>
              <p className="category">
                Category: <span>{symbol.category}</span>
              </p>
              {symbol.examples && symbol.examples.length > 0 && (
                <div className="examples">
                  <h4>Examples:</h4>
                  <ul>
                    {symbol.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!showTranslation && !interactive && (
        <div className={`symbol-details ${showDetails ? "visible" : ""}`}>
          <div className="details-content">
            <h3>{symbol.word}</h3>
            <p>{symbol.translation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolCard;
