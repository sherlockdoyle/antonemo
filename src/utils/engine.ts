import { SetStoreFunction } from 'solid-js/store';
import { Random } from './random';
import { addAll, isSubset } from './set-extensions';
import { Builder, WordListType, fetchAndGetWordList } from './word-graph';

export const enum GameMode {
  e,
  t,
}
export const enum GameState {
  e,
  t,
  o,
  n,
  a,
}

// Nearest prime to number of words (5000) / 2. This is also coprime with the final number of words, both in easy and
// hard mode.
export const WORD_PRIME = 2503;
export const WORD_HINT_FACTOR = 1.25;
export const ANTONYM_HINT_FACTOR = 1.5;

const ITER_FOR_GAME_MODE: Record<GameMode, number> = {
  [GameMode.e]: 15,
  [GameMode.t]: 30,
};

export type Key =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'ENTER'
  | 'BACKSPACE';
export type WordAndAntonym = [word: string, antonym: string | undefined];

export interface EngineState {
  e: number;
  t: string[];
  o: string;
  n: boolean;
  a: boolean;
  r: boolean;
  s: Set<string>;
  i: Set<string>;
  c: boolean;
}
export class GameEngine {
  #e: GameMode;
  #t: SetStoreFunction<EngineState>;

  #o: Record<string, string | undefined>;
  #n: Random;

  #a: Set<string>;
  #r: string[];
  #s: string;
  #i: string;
  #c: number;
  #l: string[];
  #u: boolean;

  #p: Set<string> | undefined;
  constructor(mode: GameMode, setStore: SetStoreFunction<EngineState>) {
    this.#e = mode;
    this.#t = setStore;

    this.#o = {};
    this.#n = new Random();

    this.#a = new Set();
    this.#r = [];
    this.#s = '';
    this.#i = '';
    this.#c = 0;
    this.#l = [];
    this.#u = false;
  }

  async f(type: WordListType) {
    const words = await fetchAndGetWordList(type);
    const antonymMap: Record<string, string> = {};
    Object.entries(words).forEach(([word, antonyms]) => {
      let antonym: string | undefined;
      if (antonyms.length > 0) {
        antonym = this.#e === GameMode.e ? antonyms[0] : antonyms[antonyms.length - 1];
        antonymMap[antonym] = word;
      }
      this.#o[word] = antonym;
    });

    Object.entries(antonymMap).forEach(([antonym, word]) => {
      if (!(antonym in this.#o)) {
        this.#o[antonym] = word;
      }
    });
  }

  get d(): number {
    return Object.keys(this.#o).length;
  }

  get m(): Set<string> {
    if (!this.#p) {
      this.#p = new Set(this.#a);
      for (const word of this.#r) {
        addAll(this.#p, word);
      }
    }
    return this.#p;
  }

  h(seed: number) {
    this.#n = new Random(seed);
  }

  g(...words: string[]): Set<string> {
    const set = new Set<string>();
    for (const word of words) {
      addAll(set, word);
      if (this.#o[word]) {
        addAll(set, this.#o[word]!);
      }
    }
    return set;
  }

  y(wordIdx: number) {
    const startingWord = Object.keys(this.#o)[wordIdx];
    this.#a = new Set(startingWord);
    const builder = new Builder(this.g(startingWord), this.#o, this.#n, [startingWord]);
    this.#i = builder.f(ITER_FOR_GAME_MODE[this.#e]);

    builder.d.unshift(startingWord);
    const solutionLetterSet = new Set(startingWord);
    this.#l = [];
    for (const word of builder.d) {
      const wordSet = this.g(word);
      if (!isSubset(wordSet, solutionLetterSet)) {
        this.#l.push(word);
        addAll(solutionLetterSet, wordSet);
      }
    }
    this.#l.push(this.#i);
  }

  get b(): string {
    return this.#i;
  }

  v(letter: string) {
    if (this.m.has(letter)) {
      this.#s += letter;
    }
  }

  w() {
    if (this.#s.length > 0) {
      this.#s = this.#s.slice(0, -1);
    }
  }

  x(): boolean {
    return this.#s in this.#o;
  }

  k(): boolean {
    return Boolean(this.#o[this.#s]);
  }

  j(): boolean {
    return this.#s === this.#i;
  }

  #z(word: string) {
    this.#r.push(word);
    this.#p = undefined;
  }

  E() {
    if (this.x()) {
      this.#z(this.#s);
      this.#c += 1;
      if (this.k()) {
        this.#z(this.#o[this.#s]!);
      }
      this.#s = '';
    }
  }

  T(key: Key) {
    if (key === 'ENTER') {
      this.E();
    } else if (key === 'BACKSPACE') {
      if (this.#s.length > 0) {
        this.w();
      }
    } else {
      this.v(key);
    }
  }

  O() {
    this.#t({
      e: this.#c,
      t: [...this.#r],
      o: this.#s,
      n: this.x(),
      a: this.k(),
      r: this.j(),
      s: new Set(this.m),
      i: new Set(this.#i),
      c: this.#u,
    });
  }

  N(withAntonyms?: false): [word: string, antonym: undefined][];
  N(withAntonyms: true): WordAndAntonym[];
  N(withAntonyms: boolean = false): WordAndAntonym[] {
    const words = Array<string>();
    Object.keys(this.#o).forEach(word => {
      if (
        isSubset(new Set(word), this.m) &&
        !this.#r.includes(word) &&
        (!withAntonyms || this.#o[word])
      ) {
        words.push(word);
      }
    });

    this.#c = Math.floor(this.#c * (withAntonyms ? ANTONYM_HINT_FACTOR : WORD_HINT_FACTOR));
    if (withAntonyms) {
      return words.map(word => [word, this.#o[word]]);
    }
    return words.map(word => [word, undefined]);
  }

  A(): WordAndAntonym[] {
    this.#u = true;
    return this.#l.map(word => [word, this.#o[word]]);
  }

  static R(): number {
    return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  }
}
