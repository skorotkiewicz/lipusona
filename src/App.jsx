import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Symbols from "./pages/Symbols";
import LoadingScreen from "./components/LoadingScreen";
import { getSymbols } from "./data/tokiPonaSymbols";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSymbols = async () => {
      try {
        await getSymbols();
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load symbols:", error);
        setIsLoading(false);
      }
    };

    loadSymbols();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/symbols" element={<Symbols />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
