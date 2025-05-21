import { useState, useEffect, useRef } from "react";
import SymbolCard from "./SymbolCard";
import { Howl } from "howler";

const LearningModule = ({ symbols, moduleTitle, moduleDescription }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learned, setLearned] = useState(() => {
    const saved = localStorage.getItem(`learned_${moduleTitle}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [mode, setMode] = useState("learn"); // "learn", "quiz", "sentence", "writing"
  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(`stats_${moduleTitle}`);
    return saved ? JSON.parse(saved) : { correct: 0, incorrect: 0, streak: 0 };
  });
  const [sentence, setSentence] = useState("");
  const [translation, setTranslation] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [spaceRepetitionQueue, setSpaceRepetitionQueue] = useState([]);
  const [writingInput, setWritingInput] = useState("");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastReviewTime, setLastReviewTime] = useState({});

  const currentSymbol = symbols[currentIndex];

  // Save learned symbols and other data to localStorage
  useEffect(() => {
    localStorage.setItem(`learned_${moduleTitle}`, JSON.stringify(learned));
    localStorage.setItem(`stats_${moduleTitle}`, JSON.stringify(stats));
    localStorage.setItem(
      `lastReview_${moduleTitle}`,
      JSON.stringify(lastReviewTime),
    );
  }, [learned, stats, lastReviewTime, moduleTitle]);

  // Initialize spaced repetition queue and last review times
  useEffect(() => {
    if (symbols.length > 0 && spaceRepetitionQueue.length === 0) {
      initializeSpacedRepetition();

      // Load last review times from localStorage
      const savedReviewTimes = localStorage.getItem(
        `lastReview_${moduleTitle}`,
      );
      if (savedReviewTimes) {
        setLastReviewTime(JSON.parse(savedReviewTimes));
      }
    }
  }, [symbols, moduleTitle]);

  // Set up canvas for writing practice
  useEffect(() => {
    if (mode === "writing" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [mode, currentIndex]);

  // Generate quiz options when entering quiz mode or changing symbol
  useEffect(() => {
    if (mode === "quiz") {
      generateQuizOptions();
    } else if (mode === "sentence") {
      generateSentenceExercise();
    }
  }, [mode, currentIndex]);

  const initializeSpacedRepetition = () => {
    // Create initial queue with all symbols
    const queue = symbols.map((symbol) => ({
      symbolId: symbol.id,
      level: 0, // 0: new, 1-5: learning levels
      nextReview: new Date().getTime(),
    }));

    setSpaceRepetitionQueue(queue);
  };

  const updateSpacedRepetition = (symbolId, correct) => {
    setSpaceRepetitionQueue((prev) => {
      return prev.map((item) => {
        if (item.symbolId === symbolId) {
          const now = new Date().getTime();
          let level = item.level;

          // Adjust level based on answer
          if (correct) {
            level = Math.min(5, level + 1);
          } else {
            level = Math.max(0, level - 1);
          }

          // Calculate next review time based on level
          // Level 0: 1 hour, Level 1: 1 day, Level 2: 3 days, Level 3: 1 week, Level 4: 2 weeks, Level 5: 1 month
          const intervals = [
            3600000, 86400000, 259200000, 604800000, 1209600000, 2592000000,
          ];
          const nextReview = now + intervals[level];

          return { ...item, level, nextReview };
        }
        return item;
      });
    });

    // Update last review time
    setLastReviewTime((prev) => ({
      ...prev,
      [symbolId]: new Date().getTime(),
    }));
  };

  const getNextDueSymbol = () => {
    const now = new Date().getTime();
    const dueItems = spaceRepetitionQueue
      .filter((item) => item.nextReview <= now)
      .sort((a, b) => a.nextReview - b.nextReview);

    if (dueItems.length > 0) {
      const symbolIndex = symbols.findIndex(
        (s) => s.id === dueItems[0].symbolId,
      );
      if (symbolIndex !== -1) {
        return symbolIndex;
      }
    }

    return currentIndex;
  };

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

  const generateSentenceExercise = () => {
    // Simple sentence structures based on the current symbol
    const structures = [
      `mi ${currentSymbol.word} e ni.`,
      `sina ${currentSymbol.word} ala ${currentSymbol.word}?`,
      `ona li ${currentSymbol.word}.`,
      `${currentSymbol.word} li pona tawa mi.`,
      `mi wile ${currentSymbol.word}.`,
    ];

    // If the symbol is a noun, use different structures
    if (currentSymbol.category === "noun") {
      const nounStructures = [
        `${currentSymbol.word} li pona.`,
        `mi lukin e ${currentSymbol.word}.`,
        `sina jo e ${currentSymbol.word} ala?`,
        `${currentSymbol.word} ni li suli.`,
        `mi wile jo e ${currentSymbol.word}.`,
      ];
      setSentence(
        nounStructures[Math.floor(Math.random() * nounStructures.length)],
      );
    } else {
      setSentence(structures[Math.floor(Math.random() * structures.length)]);
    }

    setShowTranslation(false);

    setTranslation("(Translations comming soon...)");
  };

  const handleNext = () => {
    if (mode === "review") {
      // For review mode, get the next due symbol
      const nextIndex = getNextDueSymbol();
      setCurrentIndex(nextIndex);
    } else if (currentIndex < symbols.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Cycle back to beginning
      setCurrentIndex(0);
    }

    // Reset states
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setWritingInput("");
    setShowTranslation(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Cycle to end
      setCurrentIndex(symbols.length - 1);
    }

    // Reset states
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setWritingInput("");
    setShowTranslation(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const markAsLearned = () => {
    if (!learned.includes(currentSymbol.id)) {
      setLearned([...learned, currentSymbol.id]);
    }
  };

  const changeMode = (newMode) => {
    setMode(newMode);
  };

  const handleAnswerSelect = (option) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(option.id);
    setCorrectAnswer(currentSymbol.id);

    const isCorrect = option.id === currentSymbol.id;

    if (isCorrect) {
      markAsLearned();
      setStats((prev) => ({
        ...prev,
        correct: prev.correct + 1,
        streak: prev.streak + 1,
      }));
    } else {
      setStats((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        streak: 0,
      }));
    }

    // Update spaced repetition
    updateSpacedRepetition(currentSymbol.id, isCorrect);
  };

  const handleWritingCheck = () => {
    const isCorrect =
      writingInput.trim().toLowerCase() === currentSymbol.word.toLowerCase();

    if (isCorrect) {
      markAsLearned();
      setStats((prev) => ({
        ...prev,
        correct: prev.correct + 1,
        streak: prev.streak + 1,
      }));
    } else {
      setStats((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        streak: 0,
      }));
    }

    // Update spaced repetition
    updateSpacedRepetition(currentSymbol.id, isCorrect);

    setCorrectAnswer(currentSymbol.word);
  };

  const handleCanvasMouseDown = (e) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    if (!canvasRef.current) return;

    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const playAudio = () => {
    // This would use the actual pronunciation URL if available
    if (currentSymbol.pronunciation) {
      const sound = new Howl({
        src: [currentSymbol.pronunciation],
        html5: true,
      });
      sound.play();
    } else {
      // Fallback speech synthesis if no audio file is available
      const utterance = new SpeechSynthesisUtterance(currentSymbol.word);
      utterance.lang = "en-US"; // Default to English pronunciation
      speechSynthesis.speak(utterance);
    }
  };

  const progressPercentage = (learned.length / symbols.length) * 100;
  const accuracy =
    stats.correct + stats.incorrect > 0
      ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)
      : 0;

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

        <div className="stats-container">
          <div className="stat">
            <span className="stat-label">Learned:</span>
            <span className="stat-value">
              {learned.length}/{symbols.length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Accuracy:</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Streak:</span>
            <span className="stat-value">{stats.streak}</span>
          </div>
        </div>

        <div className="module-controls">
          <button
            type="button"
            className={`mode-btn ${mode === "learn" ? "active" : ""}`}
            onClick={() => changeMode("learn")}
          >
            Learn
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === "quiz" ? "active" : ""}`}
            onClick={() => changeMode("quiz")}
          >
            Quiz
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === "sentence" ? "active" : ""}`}
            onClick={() => changeMode("sentence")}
          >
            Sentences
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === "writing" ? "active" : ""}`}
            onClick={() => changeMode("writing")}
          >
            Writing
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === "review" ? "active" : ""}`}
            onClick={() => changeMode("review")}
          >
            Review
          </button>
        </div>
      </div>

      {mode === "learn" && (
        <div className="learning-content">
          <div className="symbol-showcase">
            <SymbolCard symbol={currentSymbol} interactive={true} />

            <div className="symbol-details">
              <div className="symbol-pronunciation">
                <h4>Practice Pronunciation</h4>
                <p className="phonetic-guide">{currentSymbol.word}</p>
                <button type="button" className="audio-btn" onClick={playAudio}>
                  Listen
                </button>
              </div>

              <div className="symbol-info">
                <h4>About This Symbol</h4>
                <p>
                  <strong>Category:</strong> {currentSymbol.category}
                </p>
                <p>
                  <strong>Translation:</strong> {currentSymbol.translation}
                </p>
              </div>
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
      )}

      {mode === "quiz" && (
        <div className="quiz-content">
          <div className="quiz-question">
            <div className="quiz-symbol">
              <h3 className="tokipona-symbol">{currentSymbol.word}</h3>
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

      {mode === "sentence" && (
        <div className="sentence-content">
          <div className="sentence-exercise">
            <h3>Practice with Sentences</h3>

            <div className="sentence-display">
              <p className="tokipona-sentence">{sentence}</p>
              {showTranslation && (
                <p className="sentence-translation">{translation}</p>
              )}
            </div>

            <div className="sentence-controls">
              <button
                type="button"
                className="translation-btn"
                onClick={() => setShowTranslation(!showTranslation)}
              >
                {showTranslation ? "Hide Translation" : "Show Translation"}
              </button>
              <button
                type="button"
                className="listen-btn"
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(sentence);
                  utterance.lang = "en-US";
                  speechSynthesis.speak(utterance);
                }}
              >
                Listen to Sentence
              </button>
              <button
                type="button"
                className="next-sentence-btn"
                onClick={() => {
                  generateSentenceExercise();
                }}
              >
                New Sentence
              </button>
            </div>
          </div>

          <div className="learning-navigation">
            <button type="button" className="nav-btn" onClick={handlePrev}>
              Previous Symbol
            </button>
            <button type="button" className="nav-btn" onClick={handleNext}>
              Next Symbol
            </button>
          </div>
        </div>
      )}

      {mode === "writing" && (
        <div className="writing-content">
          <div className="writing-exercise">
            <h3>Practice Writing</h3>

            <div className="symbol-to-write">
              <p>Write the word for:</p>
              <p className="target-word">
                <strong>{currentSymbol.translation}</strong>
              </p>
            </div>

            <div className="writing-input-area">
              <input
                type="text"
                className="writing-input"
                value={writingInput}
                onChange={(e) => setWritingInput(e.target.value)}
                placeholder="Type the word in Toki Pona"
              />
              <button
                type="button"
                className="check-btn"
                onClick={handleWritingCheck}
              >
                Check
              </button>
            </div>

            {correctAnswer && (
              <div className="writing-result">
                {writingInput.trim().toLowerCase() ===
                correctAnswer.toLowerCase() ? (
                  <p className="correct-message">Correct! Well done!</p>
                ) : (
                  <p className="incorrect-message">
                    Not quite. The correct word is:{" "}
                    <strong>{correctAnswer}</strong>
                  </p>
                )}
              </div>
            )}

            <div className="drawing-area">
              <h4>Draw the Symbol</h4>
              <canvas
                ref={canvasRef}
                width={300}
                height={200}
                className="drawing-canvas"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              ></canvas>
              <button type="button" className="clear-btn" onClick={clearCanvas}>
                Clear Drawing
              </button>
            </div>
          </div>

          <div className="learning-navigation">
            <button type="button" className="nav-btn" onClick={handlePrev}>
              Previous
            </button>
            <button type="button" className="nav-btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      )}

      {mode === "review" && (
        <div className="review-content">
          <div className="review-exercise">
            <h3>Spaced Repetition Review</h3>

            <div className="symbol-showcase">
              <SymbolCard symbol={currentSymbol} interactive={true} />

              <div className="symbol-details">
                <div className="symbol-info">
                  <h4>Recall This Symbol</h4>
                  <p>
                    Try to remember the meaning and pronunciation of this
                    symbol.
                  </p>
                  {lastReviewTime[currentSymbol.id] && (
                    <p className="symbol-last-reviewed">
                      <small>
                        Last reviewed:{" "}
                        {new Date(
                          lastReviewTime[currentSymbol.id],
                        ).toLocaleString()}
                      </small>
                    </p>
                  )}
                  <button
                    type="button"
                    className="reveal-btn"
                    onClick={() => setShowTranslation(!showTranslation)}
                  >
                    {showTranslation ? "Hide Details" : "Reveal Details"}
                  </button>
                </div>

                {showTranslation && (
                  <div className="symbol-revealed">
                    <p>
                      <strong>Word:</strong> {currentSymbol.word}
                    </p>
                    <p>
                      <strong>Translation:</strong> {currentSymbol.translation}
                    </p>
                    <p>
                      <strong>Category:</strong> {currentSymbol.category}
                    </p>
                    <button
                      type="button"
                      className="audio-btn"
                      onClick={playAudio}
                    >
                      Listen to Pronunciation
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="recall-quality">
              <h4>How well did you remember this?</h4>

              <div className="recall-buttons">
                <button
                  type="button"
                  className="recall-btn hard"
                  onClick={() => {
                    updateSpacedRepetition(currentSymbol.id, false);
                    handleNext();
                  }}
                >
                  Difficult
                </button>
                <button
                  type="button"
                  className="recall-btn okay"
                  onClick={() => {
                    updateSpacedRepetition(currentSymbol.id, true);
                    handleNext();
                  }}
                >
                  Good
                </button>
                <button
                  type="button"
                  className="recall-btn easy"
                  onClick={() => {
                    updateSpacedRepetition(currentSymbol.id, true);
                    markAsLearned();
                    handleNext();
                  }}
                >
                  Easy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModule;
