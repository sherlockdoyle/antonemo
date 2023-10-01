import defaultWordsPath from '../assets/words-default.txt?url';
import largeWordsPath from '../assets/words-large.txt?url';
import manualWordsPath from '../assets/words-manual.txt?url';
import { Random } from './random';
import { addAll, iou, isSubset } from './set-extensions';

const type2path = {
  m: manualWordsPath,
  d: defaultWordsPath,
  l: largeWordsPath,
};
export type WordListType = keyof typeof type2path;

const wordLists: Partial<Record<WordListType, Record<string, string[]>>> = {};
export async function fetchAndGetWordList(type: WordListType): Promise<Record<string, string[]>> {
  if (!wordLists[type]) {
    wordLists[type] = Object.fromEntries(
      (await (await fetch(type2path[type])).text()).split(';').map(s => {
        const [w, ...a] = s.split(',');
        return [w, a];
      }),
    );
  }
  return wordLists[type]!;
}

export class NoWordError extends Error {}

const MAX_NUMBER_OF_LETTERS = ((26 / 4) * 3) | 0;
export class Builder {
  #e: Set<string>;
  #t: Record<string, string | undefined>;
  #o: Random;
  #n: boolean;

  #a: Set<string>;
  #r: Set<string>;
  #s: Record<string, number>;
  #i: Record<string, number>;
  #c: string[];

  constructor(
    startingSet: Set<string>,
    wordGraph: Record<string, string | undefined>,
    random: Random,
    startingWords: string[] = [],
    differentFromStart: boolean = true,
  ) {
    this.#e = startingSet;
    this.#t = wordGraph;
    this.#o = random;
    this.#n = differentFromStart;

    this.#a = new Set(startingWords);
    this.#r = new Set(this.#e);
    this.#s = {};
    this.#i = {};
    this.#c = [];

    this.#l();
  }

  #l() {
    Object.keys(this.#t).forEach(word => {
      this.#s[word] = iou(new Set(word), this.#e);
    });
  }

  #u(): [words: string[], matches: number[]] {
    const words = Array<string>(),
      matches = Array<number>();
    for (const word in this.#t) {
      if (!this.#a.has(word) && isSubset(new Set(word), this.#r)) {
        words.push(word);
        matches.push((1 - this.#s[word]) * word.length);
      }
    }
    return [words, matches];
  }

  #p(m: number) {
    const [words, matches] = this.#u();
    if (words.length === 0) {
      throw new NoWordError('No words found for ' + Array.from(this.#e));
    }
    for (const word of words) {
      const wordSet = new Set(word);
      if (this.#n && isSubset(wordSet, this.#e)) continue;
      const match = (iou(wordSet, this.#e) + 1) * m;
      if (!(word in this.#i) || this.#i[word] < match) {
        this.#i[word] = match;
      }
    }
    const wordIdx = this.#o.o(matches);
    const nextWord = words[wordIdx];
    this.#a.add(nextWord);
    this.#c.push(nextWord);
    addAll(this.#r, nextWord);
    if (this.#t[nextWord]) {
      addAll(this.#r, this.#t[nextWord]!);
    }
  }

  f(maxLoop: number): string {
    const maxCacheLength = (Object.keys(this.#t).length / 3) * 2;
    while (maxLoop > 0 && this.#r.size <= MAX_NUMBER_OF_LETTERS && Object.keys(this.#i).length < maxCacheLength) {
      this.#p(maxLoop);
      --maxLoop;
    }
    const sortedWords = Object.keys(this.#i).sort((a, b) => {
      const diff = this.#i[a] - this.#i[b];
      if (diff === 0) {
        return b.length - a.length;
      }
      return diff;
    });
    return sortedWords[0];
  }

  get d(): string[] {
    return this.#c;
  }
}
