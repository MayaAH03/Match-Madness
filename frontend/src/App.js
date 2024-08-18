import React, { useEffect, useState } from "react";
import axios from "axios";
import GameBoard from "./components/GameBoard";
import happyDuo from "./styles/happy-duo.svg";
import "./styles/styles.css";
export const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "https://match-madness-0pyq.onrender.com/api";

function App() {
  const [gameData, setGameData] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Fetch game data from the backend
    axios
      .get(BASE_URL + "/game-data")
      .then((response) => {
        const { pairs } = response.data;
        // Create card list with both English and Spanish words
        const cards = pairs.flatMap((pair) => [
          { id: pair.id, word: pair.english, language: "english" },
          { id: pair.id, word: pair.spanish, language: "spanish" },
        ]);
        setGameData(cards.sort(() => Math.random() - 0.5)); // Shuffle cards
      })
      .catch((error) => {
        console.error("Error fetching game data:", error);
      });
  }, []);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="App">
      <h1>Match Madness</h1>
      {!gameStarted ? (
        <>
          <img
            src={happyDuo}
            alt="happy duo"
            title="Duo says Welcome!"
            className="happy-duo"
          />
          <br></br>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </>
      ) : (
        <GameBoard cards={gameData} />
      )}

      <footer className="Copyright">
        All duo assets used from{" "}
        <a href="https://design.duolingo.com/marketing/assets">here.</a>
      </footer>
    </div>
  );
}

export default App;
