import wordPath from '../assets/words.json?url';
import { Random } from './random';
import { addAll, iou, isSubset } from './set-extensions';

let wordList: Record<string, string[]> | undefined;
export async function fetchAndGetWordList(): Promise<Record<string, string[]>> {
  if (!wordList) {
    wordList = (await (await fetch(wordPath)).json()) as Record<string, string[]>;
  }
  return wordList;
}

export class NoWordError extends Error { }

const MAX_NUMBER_OF_LETTERS = ((26 / 4) * 3) | 0;
export class Builder {
  #startingSet: Set<string>;
  #wordGraph: Record<string, string | undefined>;
  #random: Random;
  #differentFromStart: boolean;

  #wordSet: Set<string>;
  #letterSet: Set<string>;
  #iouCache: Record<string, number>;
  #matchCache: Record<string, number>;
  #wordList: string[];

  constructor(
    startingSet: Set<string>,
    wordGraph: Record<string, string | undefined>,
    random: Random,
    startingWords: string[] = [],
    differentFromStart: boolean = true,
  ) {
    this.#startingSet = startingSet;
    this.#wordGraph = wordGraph;
    this.#random = random;
    this.#differentFromStart = differentFromStart;

    this.#wordSet = new Set(startingWords);
    this.#letterSet = new Set(this.#startingSet);
    this.#iouCache = {};
    this.#matchCache = {};
    this.#wordList = [];

    this.#calculateIouCache();
  }

  #calculateIouCache() {
    Object.keys(this.#wordGraph).forEach(word => {
      this.#iouCache[word] = iou(new Set(word), this.#startingSet);
    });
  }

  #getSubsetMatches(): [words: string[], matches: number[]] {
    const words = Array<string>(),
      matches = Array<number>();
    for (const word in this.#wordGraph) {
      if (!this.#wordSet.has(word) && isSubset(new Set(word), this.#letterSet)) {
        words.push(word);
        matches.push((1 - this.#iouCache[word]) * word.length);
      }
    }
    return [words, matches];
  }

  #findNextWord(m: number) {
    const [words, matches] = this.#getSubsetMatches();
    if (words.length === 0) {
      throw new NoWordError('No words found for ' + Array.from(this.#startingSet));
    }
    for (const word of words) {
      const wordSet = new Set(word);
      if (this.#differentFromStart && isSubset(wordSet, this.#startingSet)) continue;
      const match = (iou(wordSet, this.#startingSet) + 1) * m;
      if (!(word in this.#matchCache) || this.#matchCache[word] < match) {
        this.#matchCache[word] = match;
      }
    }
    const wordIdx = this.#random.cumulateAndGetWeightedRandomIndex(matches);
    const nextWord = words[wordIdx];
    this.#wordSet.add(nextWord);
    this.#wordList.push(nextWord);
    addAll(this.#letterSet, nextWord);
    if (this.#wordGraph[nextWord]) {
      addAll(this.#letterSet, this.#wordGraph[nextWord]!);
    }
  }

  getFinalWord(maxLoop: number): string {
    const maxCacheLength = (Object.keys(this.#wordGraph).length / 3) * 2;
    while (
      maxLoop > 0 &&
      this.#letterSet.size <= MAX_NUMBER_OF_LETTERS &&
      Object.keys(this.#matchCache).length < maxCacheLength
    ) {
      this.#findNextWord(maxLoop);
      --maxLoop;
    }
    const sortedWords = Object.keys(this.#matchCache).sort((a, b) => {
      const diff = this.#matchCache[a] - this.#matchCache[b];
      if (diff === 0) {
        return b.length - a.length;
      }
      return diff;
    });
    return sortedWords[0];
  }

  get _wordList(): string[] {
    return this.#wordList;
  }
}
