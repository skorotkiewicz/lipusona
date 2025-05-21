import { useState } from "react";
import { tokiPonaSymbols } from "../data/tokiPonaSymbols";
import LearningModule from "../components/LearningModule";

const Learn = () => {
  const [activeModule, setActiveModule] = useState("basics");

  // Group symbols by category for different learning modules
  const basicSymbols = tokiPonaSymbols.filter((s) =>
    ["particle", "modifier"].includes(s.category),
  );

  // const basicSymbols = tokiPonaSymbols
  //   .filter((s) => ["particle", "modifier"].includes(s.category))
  //   .slice(0, 5);

  const nounSymbols = tokiPonaSymbols.filter((s) => s.category === "noun");
  const verbSymbols = tokiPonaSymbols.filter((s) => s.category === "verb");
  const allSymbols = tokiPonaSymbols;

  const modules = [
    {
      id: "basics",
      title: "Basic Elements",
      description:
        "Start here to learn the fundamental particles and modifiers of Toki Pona",
      symbols: basicSymbols,
    },
    {
      id: "nouns",
      title: "Nouns & Objects",
      description: "Learn the symbols for things and concepts in Toki Pona",
      symbols: nounSymbols,
    },
    {
      id: "verbs",
      title: "Actions & States",
      description: "Master the symbols for verbs and actions",
      symbols: verbSymbols,
    },
    {
      id: "all",
      title: "Complete Symbol Set",
      description: "Practice with all available Toki Pona symbols",
      symbols: allSymbols,
    },
  ];

  return (
    <div className="learn-page">
      <div className="container">
        <div className="page-header">
          <h1>Learn Toki Pona</h1>
          <p className="page-description">
            Master the symbols (sitelen pona) of Toki Pona through interactive
            lessons and practice.
          </p>
        </div>

        <div className="module-selector">
          <h2>Choose a Learning Module</h2>
          <div className="module-tabs">
            {modules.map((module) => (
              <button
                type="button"
                key={module.id}
                className={`module-tab ${activeModule === module.id ? "active" : ""}`}
                onClick={() => setActiveModule(module.id)}
              >
                {module.title}
              </button>
            ))}
          </div>
        </div>

        <div className="learning-container">
          {modules.map(
            (module) =>
              module.id === activeModule && (
                <LearningModule
                  key={module.id}
                  symbols={module.symbols}
                  moduleTitle={module.title}
                  moduleDescription={module.description}
                />
              ),
          )}
        </div>

        <div className="learning-tips">
          <h3>Tips for Learning Toki Pona</h3>
          <ul>
            <li>Focus on one category at a time</li>
            <li>Practice creating simple sentences daily</li>
            <li>Draw the symbols to help memorize them</li>
            <li>Join the Toki Pona community to practice with others</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Learn;
