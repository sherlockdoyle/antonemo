import { Component } from 'solid-js';
import Modal from './components/Modal';
import { globalStore, initialGlobalStore, persistentStore, setGlobalStore } from './store/store';
import { GameMode, GameState } from './utils/engine';

interface CommonProps {
  today: number;
  handleNewGame: () => void;
  handleCustomGame: () => void;
}
const NextStep: Component<CommonProps> = props => (
  <>
    {(persistentStore.playTime[GameMode.Easy] ?? 0) < props.today && (
      <>
        <button
          class='btn btn-secondary'
          onClick={() => {
            setGlobalStore({ ...initialGlobalStore, gameMode: GameMode.Easy, gameState: GameState.Starting });
            props.handleNewGame();
          }}
        >
          try the easy mode
        </button>
        or
      </>
    )}
    {(persistentStore.playTime[GameMode.Hard] ?? 0) < props.today && (
      <>
        <button
          class='btn btn-secondary'
          onClick={() => {
            setGlobalStore({ ...initialGlobalStore, gameMode: GameMode.Hard, gameState: GameState.Starting });
            props.handleNewGame();
          }}
        >
          try the hard mode
        </button>
        or
      </>
    )}
    <button class='btn btn-accent' onClick={props.handleCustomGame}>
      try a custom game
    </button>
    or try again tomorrow.
  </>
);

const Won: Component = () => (
  <>
    <h1 class='mb-4 text-4xl font-bold text-success'>You Won!</h1>
    Congratulations! You won the game in {globalStore.steps} step{globalStore.steps === 1 || 's'}. You are awesome! You
    can
  </>
);

const Lost: Component = () => (
  <>
    <h1 class='mb-4 text-4xl font-bold text-error'>Game Over</h1>
    Oops! You saw the solution and lost the game. You can
  </>
);

interface GameOverProps extends CommonProps {
  open: boolean;
}
const GameOver: Component<GameOverProps> = props => {
  return (
    <Modal open={props.open} keepOpen>
      <div class='flex flex-col items-center gap-2 text-center text-lg'>
        {globalStore.gameState === GameState.Won ? <Won /> : <Lost />}
        <NextStep {...props} />
      </div>
    </Modal>
  );
};
export default GameOver;
