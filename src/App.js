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
  const [totalTime, setTotalTime] = React.useState(null);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      clearInterval(timerRef.current); // Clear timer when game is won
      timerRef.current = null;
      const endTime = new Date();
      const timeDiff = (endTime - startTime) / 1000; // in seconds
      const minutes = Math.floor(timeDiff / 60);
      const seconds = Math.floor(timeDiff % 60);
      setTotalTime(`${minutes}m ${seconds}s`);
    }
  }, [dice, startTime]);

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
      <p>Number of Rolls: {diceCount}</p> {/* Display the roll count */}
      <div className="timer_counter">
        <p>
          Elapsed Time: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s
        </p>{" "}
        {totalTime && <p>Total Time: {totalTime}</p>}{" "}
      </div>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
