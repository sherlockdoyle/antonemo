import { SetStoreFunction } from 'solid-js/store';
import { Random } from './random';
import { addAll, isSubset } from './set-extensions';
import { Builder, fetchAndGetWordList } from './word-graph';

export const enum GameMode {
  Easy,
  Hard,
}
export const enum GameState {
  Idle,
  Starting,
  Playing,
  Won,
  Lost,
}

// Nearest prime to number of words (5000) / 2. This is also coprime with the final number of words, both in easy and
// hard mode.
export const WORD_PRIME = 2503;
export const WORD_HINT_FACTOR = 1.25;
export const ANTONYM_HINT_FACTOR = 1.5;

const ITER_FOR_GAME_MODE: Record<GameMode, number> = {
  [GameMode.Easy]: 15,
  [GameMode.Hard]: 30,
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
  steps: number;
  words: string[];
  currentWord: string;
  isCurrentWordValid: boolean;
  currentWordHasAntonym: boolean;
  isCurrentWordFinal: boolean;
  activeLetters: Set<string>;
  correctLetters: Set<string>;
  seenSolution: boolean;
}
export class GameEngine {
  #mode: GameMode;
  #setStore: SetStoreFunction<EngineState>;

  #wordGraph: Record<string, string | undefined>;
  #random: Random;

  #initialLetters: Set<string>;
  #words: string[];
  #currentWord: string;
  #finalWord: string;
  #steps: number;
  #solution: string[];
  #seenSolution: boolean;

  #_activeLetters: Set<string> | undefined;
  constructor(mode: GameMode, setStore: SetStoreFunction<EngineState>) {
    this.#mode = mode;
    this.#setStore = setStore;

    this.#wordGraph = {};
    this.#random = new Random();

    this.#initialLetters = new Set();
    this.#words = [];
    this.#currentWord = '';
    this.#finalWord = '';
    this.#steps = 0;
    this.#solution = [];
    this.#seenSolution = false;
  }

  async buildWordGraph() {
    const words = await fetchAndGetWordList();
    const antonymMap: Record<string, string> = {};
    Object.entries(words).forEach(([word, antonyms]) => {
      let antonym: string | undefined;
      if (antonyms.length > 0) {
        antonym = this.#mode === GameMode.Easy ? antonyms[0] : antonyms[antonyms.length - 1];
        antonymMap[antonym] = word;
      }
      this.#wordGraph[word] = antonym;
    });

    Object.entries(antonymMap).forEach(([antonym, word]) => {
      if (!(antonym in this.#wordGraph)) {
        this.#wordGraph[antonym] = word;
      }
    });
  }

  get numberOfWords(): number {
    return Object.keys(this.#wordGraph).length;
  }

  get activeLetters(): Set<string> {
    if (!this.#_activeLetters) {
      this.#_activeLetters = new Set(this.#initialLetters);
      for (const word of this.#words) {
        addAll(this.#_activeLetters, word);
      }
    }
    return this.#_activeLetters;
  }

  setRandomSeed(seed: number) {
    this.#random = new Random(seed);
  }

  getSetFromWords(...words: string[]): Set<string> {
    const set = new Set<string>();
    for (const word of words) {
      addAll(set, word);
      if (this.#wordGraph[word]) {
        addAll(set, this.#wordGraph[word]!);
      }
    }
    return set;
  }

  initWithWordIdx(wordIdx: number) {
    const startingWord = Object.keys(this.#wordGraph)[wordIdx];
    this.#initialLetters = new Set(startingWord);
    const builder = new Builder(this.getSetFromWords(startingWord), this.#wordGraph, this.#random, [startingWord]);
    this.#finalWord = builder.getFinalWord(ITER_FOR_GAME_MODE[this.#mode]);

    builder._wordList.unshift(startingWord);
    const solutionLetterSet = new Set(startingWord);
    this.#solution = [];
    for (const word of builder._wordList) {
      const wordSet = this.getSetFromWords(word);
      if (!isSubset(wordSet, solutionLetterSet)) {
        this.#solution.push(word);
        addAll(solutionLetterSet, wordSet);
      }
    }
    this.#solution.push(this.#finalWord);
  }

  get finalWord(): string {
    return this.#finalWord;
  }

  addLetter(letter: string) {
    if (this.activeLetters.has(letter)) {
      this.#currentWord += letter;
    }
  }

  popLetter() {
    if (this.#currentWord.length > 0) {
      this.#currentWord = this.#currentWord.slice(0, -1);
    }
  }

  isCurrentWordValid(): boolean {
    return this.#currentWord in this.#wordGraph;
  }

  currentWordHasAntonym(): boolean {
    return Boolean(this.#wordGraph[this.#currentWord]);
  }

  isCurrentWordFinal(): boolean {
    return this.#currentWord === this.#finalWord;
  }

  #addWord(word: string) {
    this.#words.push(word);
    this.#_activeLetters = undefined;
  }

  addCurrentWordWithAntonym() {
    if (this.isCurrentWordValid()) {
      this.#addWord(this.#currentWord);
      this.#steps += 1;
      if (this.currentWordHasAntonym()) {
        this.#addWord(this.#wordGraph[this.#currentWord]!);
      }
      this.#currentWord = '';
    }
  }

  handleKey(key: Key) {
    if (key === 'ENTER') {
      this.addCurrentWordWithAntonym();
    } else if (key === 'BACKSPACE') {
      if (this.#currentWord.length > 0) {
        this.popLetter();
      }
    } else {
      this.addLetter(key);
    }
  }

  updateStore() {
    this.#setStore({
      steps: this.#steps,
      words: [...this.#words],
      currentWord: this.#currentWord,
      isCurrentWordValid: this.isCurrentWordValid(),
      currentWordHasAntonym: this.currentWordHasAntonym(),
      isCurrentWordFinal: this.isCurrentWordFinal(),
      activeLetters: new Set(this.activeLetters),
      correctLetters: new Set(this.#finalWord),
      seenSolution: this.#seenSolution,
    });
  }

  getValidWords(withAntonyms?: false): [word: string, antonym: undefined][];
  getValidWords(withAntonyms: true): WordAndAntonym[];
  getValidWords(withAntonyms: boolean = false): WordAndAntonym[] {
    const words = Array<string>();
    Object.keys(this.#wordGraph).forEach(word => {
      if (
        isSubset(new Set(word), this.activeLetters) &&
        !this.#words.includes(word) &&
        (!withAntonyms || this.#wordGraph[word])
      ) {
        words.push(word);
      }
    });

    this.#steps = Math.floor(this.#steps * (withAntonyms ? ANTONYM_HINT_FACTOR : WORD_HINT_FACTOR));
    if (withAntonyms) {
      return words.map(word => [word, this.#wordGraph[word]]);
    }
    return words.map(word => [word, undefined]);
  }

  getSolution(): WordAndAntonym[] {
    this.#seenSolution = true;
    return this.#solution.map(word => [word, this.#wordGraph[word]]);
  }

  static getCurrentDay(): number {
    return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  }
}
