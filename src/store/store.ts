import { createStore } from 'solid-js/store';
import { EngineState, GameEngine, GameMode, GameState } from '../utils/engine';
import { WordListType } from '../utils/word-graph';
import createLocalStore from './createLocalStore';

interface PersistentStore {
  t: boolean;
  l: WordListType;
  m: GameMode;
  s: boolean;
  p: Partial<Record<WordListType, Partial<Record<GameMode, number>>>>;
}
const [persistentStore, setPersistentStore] = createLocalStore<PersistentStore>('a', {
  t: false,
  l: 'm',
  m: GameMode.e,
  s: true,
  p: {},
});

interface GlobalStore extends EngineState {
  l: GameMode;
  u: GameState;
  p: number;
  f: number;
  d: string | undefined;
}
const initialGlobalStore: Readonly<GlobalStore> = {
  l: persistentStore.m,
  u: GameState.e,
  p: GameEngine.R(),
  f: 0,
  d: undefined,
  e: 0,

  t: [],
  o: '',
  n: false,
  a: false,
  r: false,
  s: new Set(),
  i: new Set(),
  c: false,
};
const [globalStore, setGlobalStore] = createStore<GlobalStore>({ ...initialGlobalStore });

export { globalStore, initialGlobalStore, persistentStore, setGlobalStore, setPersistentStore };
