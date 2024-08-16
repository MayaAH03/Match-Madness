import React from "react";
import "../styles/styles.css";

function Card({ card, isSelected, isMatched, isMismatched, onClick, index }) {
  let cardClass = "card";
  if (isMatched) {
    cardClass += " matched";
  } else if (isMismatched) {
    cardClass += " mismatched";
  } else if (isSelected) {
    cardClass += " selected";
  }

  return (
    <div className={cardClass} onClick={() => onClick(index)}>
      <div className="front">{card.word}</div>
    </div>
  );
}

export default Card;
