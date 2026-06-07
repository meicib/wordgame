import fs from "fs";
import path from "path";
import readline from "readline";

const filePath = path.join(process.cwd(), "20k.txt");
const outputFilePath = path.join(process.cwd(), "app", "word-data.json");

const wordMap = new Map<string, number>();
const substringMap = new Map<string, Array<string>>();

async function processWordsByLine(filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;
  for await (const line of rl) {
    lineNumber++;

    if (line.length >= 3) {
      wordMap.set(line, lineNumber);
    }
  }
}

function findAllSubstrings(substringLength: number, wordMap: Map<string, number>) {
  for (const [word] of wordMap) {
    if (word.length < substringLength) {
      continue;
    }

    const seenSubstringsForThisWord = new Set<string>();
    for (let i = 0; i <= word.length - substringLength; i++) {
      const substring = word.slice(i, i + substringLength);
      
      if (!seenSubstringsForThisWord.has(substring)) {
        const wordsContainingSubstring = substringMap.get(substring) ?? [];
        wordsContainingSubstring.push(word);
        substringMap.set(substring, wordsContainingSubstring);
        seenSubstringsForThisWord.add(substring);
      }
    }
  }
}

function getViableSubstrings(num: number) {
  const viableSubstringMap = new Map<string, Array<string>>();
  for (const [substring, lst] of substringMap) {
    if (lst.length >= num) {
      viableSubstringMap.set(substring, lst);
    }
  }
  return viableSubstringMap;
}

function generateJsonFile(
  wordScores: Map<string, number>,
  viableSubstrings: Map<string, string[]>
) {
  const data = {
    wordScores: Object.fromEntries(wordScores),
    substrings: Object.fromEntries(viableSubstrings),
  };

  fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
}

async function main() {
  await processWordsByLine(filePath);
  findAllSubstrings(3, wordMap);
  const viableSubstrings = getViableSubstrings(3);
  generateJsonFile(wordMap, viableSubstrings);
}

main();