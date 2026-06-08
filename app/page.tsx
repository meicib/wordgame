"use client";

import { useState, useEffect } from "react";
import wordData from "./word-data.json";

type GameState = "playing" | "round-over";
type Difficulty = "easy" | "medium" | "hard";

export default function Home() {
  const [substring, setSubstring] = useState("");
  const [inputs, setInputs] = useState(["", "", ""]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [gameState, setGameState] = useState<GameState>("playing");
  const [roundResults, setRoundResults] = useState<{ word: string; score: number }[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const selectRandomSubstring = (currentDifficulty: Difficulty) => {
    const viableSubstrings = Object.keys(wordData.substrings[currentDifficulty]);
    const randomIndex = Math.floor(Math.random() * viableSubstrings.length);
    setSubstring(viableSubstrings[randomIndex]);
  };

  useEffect(() => {
    selectRandomSubstring(difficulty);
  }, [difficulty]);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value.toLowerCase();
    setInputs(newInputs);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setInputs(["", "", ""]);
    setMessage("");
    setGameState("playing");
  };

  const handleSubmit = () => {
    let roundScore = 0;
    const currentRoundResults: { word: string; score: number }[] = [];
    const invalidWords: string[] = [];
    const alreadyUsedWords: string[] = [];

    const uniqueInputs = new Set(inputs.filter(input => input !== ""));
    if (uniqueInputs.size !== inputs.filter(input => input !== "").length) {
      setMessage("Please enter three different words.");
      return;
    }

    inputs.forEach((input) => {
      if (input === "") return; // Ignore empty inputs for now

      if (usedWords.has(input)) {
        alreadyUsedWords.push(input);
      } else {
        const validWordsForSubstring = (wordData.substrings[difficulty] as any)[substring];
        if (validWordsForSubstring && validWordsForSubstring.includes(input)) {
          const wordScore = (wordData.wordScores as any)[input];
          roundScore += wordScore;
          currentRoundResults.push({ word: input, score: wordScore });
        } else {
          invalidWords.push(input);
        }
      }
    });

    if (alreadyUsedWords.length > 0) {
      setMessage(`Already used: ${alreadyUsedWords.join(", ")}. Try new words.`);
    } else if (invalidWords.length > 0) {
      setMessage(`Invalid word(s): ${invalidWords.join(", ")}. Please try again.`);
    } else if (currentRoundResults.length < 3) {
      setMessage("Please enter three valid words.");
    } else {
      setScore(score + roundScore);
      setRoundResults(currentRoundResults);
      setGameState("round-over");
      setMessage(`Correct! You scored ${roundScore} points this round.`);
      setUsedWords(new Set([...usedWords, ...inputs]));
    }
  };

  const handleNextRound = () => {
    setInputs(["", "", ""]);
    selectRandomSubstring(difficulty);
    setGameState("playing");
    setMessage("");
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-lg flex-col items-center justify-center py-12 px-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Word Game
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
          Your score: {score}
        </p>

        <div className="flex gap-4 mb-8">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => handleDifficultyChange(d)}
              className={`px-4 py-2 rounded-md transition-colors ${
                difficulty === d
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {gameState === "playing" && substring && (
          <div className="flex flex-col items-center gap-6 w-full">
            <p className="text-xl text-zinc-700 dark:text-zinc-300">
              Find three words containing the substring:
            </p>
            <div className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-md">
              <h2 className="text-3xl font-semibold tracking-widest text-zinc-900 dark:text-zinc-50">
                {substring}
              </h2>
            </div>

            <div className="flex flex-col gap-4 w-full mt-4">
              {inputs.map((input, index) => (
                <input
                  key={index}
                  type="text"
                  value={input}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-full h-12 px-4 text-lg bg-white dark:bg-zinc-800 border border-solid border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder={`Word ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="mt-4 h-12 w-full bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        )}

        {gameState === "round-over" && (
          <div className="flex flex-col items-center gap-4 w-full text-center">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Round Over!</h2>
            <ul className="list-disc list-inside text-lg text-zinc-600 dark:text-zinc-300">
              {roundResults.map((result, index) => (
                <li key={index}>
                  <span className="font-semibold">{result.word}</span>: {result.score} points
                </li>
              ))}
            </ul>
            <button
              onClick={handleNextRound}
              className="mt-4 h-12 w-full bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
            >
              Next Round
            </button>
          </div>
        )}

        {message && (
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 text-center">
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
