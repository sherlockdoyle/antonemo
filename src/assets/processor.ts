// run with ts-node-esm ./src/assets/processor.ts
import fs from 'fs';
import path from 'path';

function isWordOkay(word: string): boolean {
  return word.length > 2 && !word.match(/[^a-z]/);
}

const allWords: Record<
  string,
  {
    synonyms: Set<string>;
    antonyms: Set<string>;
    _synonyms?: Set<string>;
    _antonyms?: Set<string>;
  }
> = {};

const thesaurus: Record<
  string,
  {
    word: string;
    synonyms: string[];
    antonyms: string[];
  }
> = JSON.parse(fs.readFileSync('./src/assets/thesaurus.json', 'utf-8'));
Object.entries(thesaurus).forEach(([word, { synonyms, antonyms }]) => {
  if (!(word in allWords))
    allWords[word] = {
      synonyms: new Set<string>(),
      antonyms: new Set<string>(),
      _synonyms: new Set<string>(),
      _antonyms: new Set<string>(),
    };

  synonyms.forEach(synonym => {
    if (isWordOkay(synonym)) allWords[word]._synonyms!.add(synonym);
  });

  antonyms.forEach(antonym => {
    if (isWordOkay(antonym)) allWords[word]._antonyms!.add(antonym);
  });
});

const antonyms: Record<string, string> = JSON.parse(fs.readFileSync('./src/assets/antonyms.json', 'utf-8'));
Object.entries(antonyms).forEach(([word_pos, antonyms]) => {
  const word = word_pos.split(':')[0];
  if (isWordOkay(word)) {
    if (!(word in allWords))
      allWords[word] = {
        synonyms: new Set<string>(),
        antonyms: new Set<string>(),
      };

    antonyms
      .split('|')
      .flatMap(antonym => antonym.split(';'))
      .forEach(antonym => {
        if (isWordOkay(antonym)) allWords[word].antonyms.add(antonym);
      });
  }
});

const eaclFiles = fs.readdirSync('./src/assets/eacl2017');
eaclFiles.forEach(file => {
  const eaclLines = fs.readFileSync(path.join('./src/assets/eacl2017', file), 'utf-8').trim().split('\n');
  eaclLines.forEach(line => {
    const parts = line.trim().split(/\s+/);
    const word = parts[0],
      otherWord = parts[1],
      isAntonym = parts[2] === '1';
    if (isWordOkay(word) && isWordOkay(otherWord)) {
      if (!(word in allWords))
        allWords[word] = {
          synonyms: new Set<string>(),
          antonyms: new Set<string>(),
        };

      if (isAntonym) allWords[word].antonyms.add(otherWord);
      else allWords[word].synonyms.add(otherWord);
    }
  });
});

fs.writeFileSync(
  './src/assets/allWords.json',
  JSON.stringify(allWords, (_, v) => (v instanceof Set ? Array.from(v) : v), 1),
);

const wordFrequencies: Record<string, number> = {};
Object.entries(allWords).forEach(([word, { synonyms, antonyms, _synonyms = [], _antonyms = [] }]) => {
  [word, ...synonyms, ...antonyms, ..._synonyms, ..._antonyms].forEach(w => {
    if (w in wordFrequencies) ++wordFrequencies[w];
    else wordFrequencies[w] = 1;
  });
});
const mainWordFrequencies = Object.fromEntries(Object.keys(allWords).map(word => [word, wordFrequencies[word]]));
const topWords = Object.entries(mainWordFrequencies)
  .sort(([, v1], [, v2]) => v2 - v1)
  .slice(0, 5000)
  .map(([word]) => word);

/**
 * Returns the intersection over union (Jaccard index) and difference ratio of two strings.
 */
function iou(a: string, b: string): [number, number] {
  const setA = new Set(a),
    setB = new Set(b);
  let intersection = 0,
    b_minus_a = 0;
  for (const c of setB)
    if (setA.has(c)) ++intersection;
    else ++b_minus_a;
  return [intersection / (setA.size + b_minus_a), b_minus_a / setA.size];
}

const finalAntonyms: Record<string, string[]> = {};

topWords.forEach(word => {
  const { antonyms } = allWords[word];
  if (antonyms.size < 2) finalAntonyms[word] = Array.from(antonyms);
  else {
    const sortedAntonyms = Array.from(antonyms).sort((a, b) => {
      const [iouA, diffA] = iou(word, a),
        [iouB, diffB] = iou(word, b);
      if (iouA !== iouB) return iouA - iouB;
      if (iouA * diffB !== iouB * diffA) return iouA * diffB - iouB * diffA;
      if (a.length !== b.length) return b.length - a.length;
      return wordFrequencies[b] - wordFrequencies[a];
    });
    finalAntonyms[word] = [sortedAntonyms[0], sortedAntonyms[sortedAntonyms.length - 1]];
  }
});

fs.writeFileSync(
  './src/assets/words-default.txt',
  Object.entries(finalAntonyms)
    .map(([w, a]) => [w, ...a].join(','))
    .join(';'),
);
