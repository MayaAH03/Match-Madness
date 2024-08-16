import React, { useState, useEffect, useCallback } from "react";
import Card from "./Card";
import Timer from "./Timer";
import axios from "axios";
import excitedDuo from "../styles/excited-duo.svg";
import excitedEddy from "../styles/excited-eddy.svg";
import excitedLily from "../styles/lily-excited.svg";
import excitedVikram from "../styles/vikram-excited.svg";
import excitedZari from "../styles/zari-excited.svg";

function GameBoard({ cards }) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [mismatchedCards, setMismatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [gameCards, setGameCards] = useState(cards);
  const [timeLeft, setTimeLeft] = useState(105); // Initial time
  const [gameOver, setGameOver] = useState(false); //game over state

  useEffect(() => {
    const loadInitialCards = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/game-data");
        const { pairs } = response.data;

        // Shuffle the pairs array (to make sure every game starts with new pairs, not the same ones every time it starts)
        const shuffledPairs = pairs.sort(() => Math.random() - 0.5);

        // Select the first 5 pairs from the shuffled array
        const selectedPairs = shuffledPairs.slice(0, 5);

        // Create cards from the selected pairs
        const initialCards = selectedPairs.flatMap((pair) => [
          { id: pair.id, word: pair.english, language: "english" },
          { id: pair.id, word: pair.spanish, language: "spanish" },
        ]);

        // Shuffle the cards and set them to state
        setGameCards(initialCards.sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error("Error fetching initial game data:", error);
      }
    };

    loadInitialCards();
  }, []);

  //Stopping game when time is up
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft]);

  //Logic for replacing matched cards with new ones
  const loadNewPair = useCallback((firstIndex, secondIndex) => {
    axios
      .get("http://127.0.0.1:5000/api/game-data")
      .then((response) => {
        const { pairs } = response.data;
        const newPair = pairs[Math.floor(Math.random() * pairs.length)];
        const newCards = [
          { id: newPair.id, word: newPair.english, language: "english" },
          { id: newPair.id, word: newPair.spanish, language: "spanish" },
        ];

        setGameCards((prevCards) => {
          const updatedCards = [...prevCards];
          updatedCards[firstIndex] = newCards[0]; // Replace first matched card
          updatedCards[secondIndex] = newCards[1]; // Replace second matched card
          return updatedCards;
        });

        // Reset matched cards after updating gameCards
        setMatchedCards([]);
      })
      .catch((error) => {
        console.error("Error fetching new game data:", error);
      }, 1000);
  }, []);

  //Click event for each card
  const handleCardClick = (index) => {
    // Prevent selecting more than 2 cards or clicking when game is over
    if (gameOver || selectedCards.length === 2) return;
    if (!selectedCards.includes(index) && !matchedCards.includes(index)) {
      const newSelectedCards = [...selectedCards, index];
      setSelectedCards(newSelectedCards);

      if (newSelectedCards.length === 2) {
        const [firstIndex, secondIndex] = newSelectedCards;
        const firstCard = gameCards[firstIndex];
        const secondCard = gameCards[secondIndex];

        if (
          firstCard.id === secondCard.id &&
          firstCard.language !== secondCard.language
        ) {
          setMatchedCards((prevMatchedCards) => [
            ...prevMatchedCards,
            firstIndex,
            secondIndex,
          ]);
          setScore((prevScore) => prevScore + 1);

          // Delay to show the green highlight before replacing with new cards. So the card replacing logic is called after 0.3 seconds.
          setTimeout(() => {
            //load a new pair after a match is made
            loadNewPair(firstIndex, secondIndex);
          }, 300); // Delay for 0.3 seconds
        } else {
          setMismatchedCards([firstIndex, secondIndex]);
          setTimeout(() => setMismatchedCards([]), 300);
        }
        setTimeout(() => setSelectedCards([]), 300);
      }
    }
  };

  return (
    <div>
      <Timer timeLeft={timeLeft} />
      <div className="score">Score: {score}</div>
      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <img
            src={excitedZari}
            alt="Excited Zari"
            title="Zari!"
            className="excited-duo"
          />
          <img
            src={excitedLily}
            alt="Excited Lily"
            title="Lily."
            className="excited-duo"
          />
          <img
            src={excitedDuo}
            alt="Excited Duo"
            title="Duo says Well done!"
            className="excited-duo"
          />
          <img
            src={excitedVikram}
            alt="Excited Vikram"
            title="Vikram!"
            className="excited-duo"
          />
          <img
            src={excitedEddy}
            alt="Excited Eddy"
            title="Eddy!"
            className="excited-duo"
          />
          <h3>Final Score: {score}</h3>
        </div>
      ) : (
        <div className="game-board">
          {gameCards.map((card, index) => (
            <Card
              key={index}
              index={index}
              card={card}
              isSelected={selectedCards.includes(index)}
              isMatched={matchedCards.includes(index)}
              isMismatched={mismatchedCards.includes(index)}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GameBoard;
