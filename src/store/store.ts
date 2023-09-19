import { createStore } from 'solid-js/store';
import { EngineState, GameEngine, GameMode, GameState } from '../utils/engine';
import createLocalStore from './createLocalStore';

interface PersistentStore {
  isLightTheme: boolean;
  defaultGameMode: GameMode;
  showTips: boolean;
  playTime: Partial<Record<GameMode, number>>;
}
const [persistentStore, setPersistentStore] = createLocalStore<PersistentStore>('a', {
  isLightTheme: false,
  defaultGameMode: GameMode.Easy,
  showTips: true,
  playTime: {},
});

interface GlobalStore extends EngineState {
  gameMode: GameMode;
  gameState: GameState;
  seed: number;
  offset: number;
  finalWord: string | undefined;
}
const initialGlobalStore: Readonly<GlobalStore> = {
  gameMode: persistentStore.defaultGameMode,
  gameState: GameState.Idle,
  seed: GameEngine.getCurrentDay(),
  offset: 0,
  finalWord: undefined,
  steps: 0,

  words: [],
  currentWord: '',
  isCurrentWordValid: false,
  currentWordHasAntonym: false,
  isCurrentWordFinal: false,
  activeLetters: new Set(),
  correctLetters: new Set(),
  seenSolution: false,
};
const [globalStore, setGlobalStore] = createStore<GlobalStore>({ ...initialGlobalStore });

export { globalStore, initialGlobalStore, persistentStore, setGlobalStore, setPersistentStore };
