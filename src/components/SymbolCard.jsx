import { useState } from "react";
import ReactHowler from "react-howler";

const SymbolCard = ({
  symbol,
  showTranslation = true,
  interactive = false,
  onSelect,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    if (interactive) {
      setFlipped(!flipped);
      if (onSelect) onSelect(symbol);
    } else if (!showTranslation) {
      setShowDetails(!showDetails);
    }
  };

  const playPronunciation = (e) => {
    e.stopPropagation(); // Prevent card flip when clicking the audio button
    setIsPlaying(!isPlaying);
  };

  // Handle audio end event
  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={`symbol-card ${flipped ? "flipped" : ""} ${interactive ? "interactive" : ""}`}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="symbol-image">{symbol.word}</div>
          <h3 className="symbol-word">{symbol.word}</h3>
          {symbol.pronunciation && (
            <div className="pronunciation-controls" onClick={playPronunciation}>
              <button type="button" className="pronunciation-btn">
                {isPlaying ? "◼" : "▶"}
              </button>
              {isPlaying && (
                <ReactHowler
                  src={symbol.pronunciation}
                  playing={isPlaying}
                  onEnd={handleAudioEnd}
                />
              )}
            </div>
          )}
          {showTranslation && (
            <p className="symbol-translation">{symbol.translation}</p>
          )}
        </div>

        {interactive && (
          <div className="card-back">
            <div className="card-back-content">
              <h3 className="tokipona-symbol">{symbol.word}</h3>
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
            {symbol.pronunciation && (
              <div
                className="pronunciation-controls"
                onClick={playPronunciation}
              >
                <button type="button" className="pronunciation-btn">
                  {isPlaying ? "◼" : "▶"}
                </button>
                {isPlaying && (
                  <ReactHowler
                    src={symbol.pronunciation}
                    playing={isPlaying}
                    onEnd={handleAudioEnd}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolCard;
