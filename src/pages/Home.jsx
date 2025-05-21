import { Link } from "react-router-dom";
import { tokiPonaSymbols } from "../data/tokiPonaSymbols";

const Home = () => {
  // Select 3 random symbols for the featured section
  const getRandomSymbols = (count) => {
    const shuffled = [...tokiPonaSymbols].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const featuredSymbols = getRandomSymbols(3);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              <span className="hero-title">lipu sona Toki Pona</span>
              <span className="hero-subtitle">
                Learn the language of simplicity
              </span>
            </h1>
            <p className="hero-description">
              Discover the beauty of Toki Pona, a philosophical language with
              just 120+ words and a unique writing system. Start your journey to
              linguistic minimalism today.
            </p>
            <div className="hero-cta">
              <Link to="/learn" className="btn btn-primary">
                Start Learning
              </Link>
              <Link to="/symbols" className="btn btn-secondary">
                View All Symbols
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="intro">
        <div className="container">
          <div className="section-header">
            <h2>What is Toki Pona?</h2>
          </div>
          <div className="intro-content">
            <div className="intro-text">
              <p>
                Toki Pona is a minimalist constructed language created by
                linguist Sonja Lang in 2001. With only about 120-130 words and
                simple grammar, it encourages clear thinking and a focus on the
                essential.
              </p>
              <p>
                The language has its own writing system called "sitelen pona"
                (simple drawing), where each word is represented by a unique
                symbol. These logograms capture the meaning and philosophy
                behind each word.
              </p>
            </div>
            <div className="intro-visual">
              <div className="intro-symbols">
                {featuredSymbols.map((symbol) => (
                  <div key={symbol.id} className="intro-symbol">
                    <h3 className="tokipona-symbol">{symbol.word}</h3>
                    <div className="symbol-info">
                      <h3>{symbol.word}</h3>
                      <p>{symbol.translation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Learn Toki Pona?</h2>
          </div>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Simplicity</h3>
              <p>Learn the entire vocabulary in just weeks, not years.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Mindfulness</h3>
              <p>Focus on the essential and simplify complex thoughts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Creative</h3>
              <p>
                Express yourself through beautiful logograms and creative
                combinations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Community</h3>
              <p>Join a friendly global community of Toki Pona speakers.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="get-started">
        <div className="container">
          <div className="get-started-content">
            <h2>Begin Your Journey</h2>
            <p>
              Start with interactive lessons, explore the unique symbols, and
              test your knowledge with quizzes.
            </p>
            <div className="get-started-buttons">
              <Link to="/learn" className="btn btn-large">
                Start Learning Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
