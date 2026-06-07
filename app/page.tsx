"use client";

import { useState, useEffect } from "react";
import wordData from "./word-data.json";

export default function Home() {
  const [substring, setSubstring] = useState("");
  const [inputs, setInputs] = useState(["", "", ""]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const viableSubstrings = Object.keys(wordData.substrings);

  const selectRandomSubstring = () => {
    const randomIndex = Math.floor(Math.random() * viableSubstrings.length);
    setSubstring(viableSubstrings[randomIndex]);
  };

  useEffect(() => {
    selectRandomSubstring();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value.toLowerCase();
    setInputs(newInputs);
  };

  const handleSubmit = () => {
    let roundScore = 0;
    let allWordsValid = true;

    inputs.forEach((input) => {
      const validWordsForSubstring =
        wordData.substrings[substring as keyof typeof wordData.substrings];
      if (validWordsForSubstring && validWordsForSubstring.includes(input)) {
        roundScore +=
          wordData.wordScores[input as keyof typeof wordData.wordScores];
      } else {
        allWordsValid = false;
      }
    });

    if (allWordsValid) {
      setScore(score + roundScore);
      setMessage(`Correct! You scored ${roundScore} points.`);
      setInputs(["", "", ""]);
      selectRandomSubstring();
    } else {
      setMessage("One or more words are not found in this word list.");
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-lg flex-col items-center justify-center py-24 px-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Word Game
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Your score: {score}
        </p>

        {substring && (
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
            {message && (
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                {message}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
