import { useState, useEffect } from "react";
import SymbolCard from "./SymbolCard";

const LearningModule = ({ symbols, moduleTitle, moduleDescription }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learned, setLearned] = useState([]);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const currentSymbol = symbols[currentIndex];

  useEffect(() => {
    if (quizMode) {
      generateQuizOptions();
    }
  }, [quizMode, currentIndex]);

  const generateQuizOptions = () => {
    // Get the correct answer
    const correct = symbols[currentIndex];

    // Get 3 random incorrect options
    let options = [correct];
    while (options.length < 4) {
      const randomIndex = Math.floor(Math.random() * symbols.length);
      const randomSymbol = symbols[randomIndex];

      if (!options.find((opt) => opt.id === randomSymbol.id)) {
        options.push(randomSymbol);
      }
    }

    // Shuffle the options
    options = options.sort(() => Math.random() - 0.5);

    setQuizOptions(options);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
  };

  const handleNext = () => {
    if (currentIndex < symbols.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
    } else {
      // Cycle back to beginning
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
    } else {
      // Cycle to end
      setCurrentIndex(symbols.length - 1);
    }
  };

  const markAsLearned = () => {
    if (!learned.includes(currentSymbol.id)) {
      setLearned([...learned, currentSymbol.id]);
    }
  };

  const toggleQuizMode = () => {
    setQuizMode(!quizMode);
  };

  const handleAnswerSelect = (option) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(option.id);
    setCorrectAnswer(currentSymbol.id);

    if (option.id === currentSymbol.id) {
      markAsLearned();
    }
  };

  const progressPercentage = (learned.length / symbols.length) * 100;

  return (
    <div className="learning-module">
      <div className="module-header">
        <h2>{moduleTitle}</h2>
        <p>{moduleDescription}</p>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
            data-percentage={`${Math.round(progressPercentage)}%`}
          />
        </div>

        <div className="module-controls">
          <button
            type="button"
            className={`mode-toggle ${quizMode ? "quiz-active" : "learn-active"}`}
            onClick={toggleQuizMode}
          >
            {quizMode ? "Switch to Learning Mode" : "Switch to Quiz Mode"}
          </button>
        </div>
      </div>

      {!quizMode ? (
        <div className="learning-content">
          <div className="symbol-showcase">
            <SymbolCard symbol={currentSymbol} interactive={true} />

            <div className="symbol-pronunciation">
              <h4>Practice Pronunciation</h4>
              <p className="phonetic-guide">{currentSymbol.word}</p>
              <button type="button" className="audio-btn">
                Listen
              </button>
            </div>
          </div>

          <div className="learning-navigation">
            <button type="button" className="nav-btn" onClick={handlePrev}>
              Previous
            </button>
            <button
              type="button"
              className="mark-learned-btn"
              onClick={markAsLearned}
            >
              {learned.includes(currentSymbol.id)
                ? "Learned ✓"
                : "Mark as Learned"}
            </button>
            <button type="button" className="nav-btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-content">
          <div className="quiz-question">
            <div className="quiz-symbol">
              <img
                src={currentSymbol.symbol}
                alt="Quiz symbol"
                className="quiz-symbol-image"
              />
            </div>
            <h3>What does this symbol mean?</h3>

            <div className="quiz-options">
              {quizOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={`quiz-option ${
                    selectedAnswer === option.id
                      ? option.id === correctAnswer
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option.word} - {option.translation}
                </button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <div className="quiz-result">
                {selectedAnswer === correctAnswer ? (
                  <p className="correct-message">Correct! Well done!</p>
                ) : (
                  <p className="incorrect-message">
                    Not quite. The correct answer is:{" "}
                    <strong>{currentSymbol.word}</strong> -{" "}
                    {currentSymbol.translation}
                  </p>
                )}
                <button
                  type="button"
                  className="next-question-btn"
                  onClick={handleNext}
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModule;
