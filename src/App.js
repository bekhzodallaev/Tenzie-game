import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import "./style.css";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [diceCount, setDiceCount] = React.useState(0);
  const [startTime, setStartTime] = React.useState(null);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [bestCount, setBestCount] = React.useState(() => {
    const savedCount = localStorage.getItem("bestCount");
    return savedCount ? Number(savedCount) : null;
  });
  const [bestTime, setBestTime] = React.useState(() => {
    const savedTime = localStorage.getItem("bestTime");
    return savedTime ? Number(savedTime) : null;
  });
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      clearInterval(timerRef.current);
      timerRef.current = null;

      // Update the best time if the new elapsed time is lower
      if (!bestTime || elapsedTime < bestTime) {
        setBestTime(elapsedTime);
        localStorage.setItem("bestTime", elapsedTime);
      }

      // Update the best count if the new dice count is lower
      if (!bestCount || diceCount < bestCount) {
        setBestCount(diceCount);
        localStorage.setItem("bestCount", diceCount);
      }
    }
  }, [dice, elapsedTime, bestTime, bestCount, diceCount]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDiceCount((oldVal) => oldVal + 1);
      if (diceCount === 0 && !timerRef.current) {
        setStartTime(new Date()); // Record start time on the first roll
        timerRef.current = setInterval(() => {
          setElapsedTime((prevTime) => prevTime + 1);
        }, 1000);
      }
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDiceCount(0);
      setElapsedTime(0);
      clearInterval(timerRef.current); // Clear timer
      timerRef.current = null;
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <p>
        Rolls: {diceCount} (<span className="time_red">Best Count:</span>{" "}
        {bestCount !== null ? bestCount : "N/A"})
      </p>
      <div className="timer_counter">
        <p>
          Time: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s (
          <span className="time_red">Best Time: </span>{" "}
          {bestTime !== null
            ? `${Math.floor(bestTime / 60)}m ${bestTime % 60}s`
            : "N/A"}
          )
        </p>
      </div>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
