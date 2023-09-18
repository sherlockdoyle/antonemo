import { Component, JSXElement, ParentComponent, createSignal } from 'solid-js';
import Collapse from './components/Collapse';
import { globalStore, initialGlobalStore, persistentStore, setGlobalStore, setPersistentStore } from './store/store';
import { GameMode, GameState } from './utils/engine';

interface MenuItemProps {
  title: string;
  help?: JSXElement;
}
const MenuItem: ParentComponent<MenuItemProps> = props => (
  <>
    <div class='flex flex-wrap items-baseline justify-between'>
      <h1 class='mr-1 text-lg font-bold'>{props.title}</h1>
      {props.children}
    </div>
    <div class='text-sm'>{props.help}</div>
    <div class='divider' />
  </>
);

const DefaultGameMode: Component = () => (
  <MenuItem
    title='Default Game Mode'
    help={
      <ul>
        <li>
          <b>Easy Mode:</b> Easier to get new letters.
        </li>
        <li>
          <b>Hard Mode:</b> More difficult to get new letters.
        </li>
      </ul>
    }
  >
    <div class='join'>
      <button
        class='btn join-item'
        classList={{ 'btn-primary': persistentStore.defaultGameMode === GameMode.Easy }}
        onClick={() => setPersistentStore({ defaultGameMode: GameMode.Easy })}
      >
        Easy
      </button>
      <button
        class='btn join-item'
        classList={{ 'btn-primary': persistentStore.defaultGameMode === GameMode.Hard }}
        onClick={() => setPersistentStore({ defaultGameMode: GameMode.Hard })}
      >
        Hard
      </button>
    </div>
  </MenuItem>
);

const CustomGame: Component<{ handleClose: () => void }> = props => {
  const [gameMode, setGameMode] = createSignal(globalStore.gameMode);
  const [offset, setOffset] = createSignal(globalStore.offset);
  const [seed, setSeed] = createSignal(globalStore.seed);

  return (
    <>
      <MenuItem title='Game Mode'>
        <div class='join'>
          <button
            class='btn join-item'
            classList={{ 'btn-primary': gameMode() === GameMode.Easy }}
            onClick={() => setGameMode(GameMode.Easy)}
          >
            Easy
          </button>
          <button
            class='btn join-item'
            classList={{ 'btn-primary': gameMode() === GameMode.Hard }}
            onClick={() => setGameMode(GameMode.Hard)}
          >
            Hard
          </button>
        </div>
      </MenuItem>
      <MenuItem
        title='Word Offset'
        help='Every day, Antonemo welcomes you with a fresh word. But if you crave more challenges, you can increase this number. Changing this will change the letters available initially.'
      >
        <input
          type='number'
          min={0}
          class='input input-primary'
          value={offset()}
          onChange={e => setOffset(e.currentTarget.valueAsNumber)}
        />
      </MenuItem>
      <MenuItem
        title='Random Seed'
        help='Seed for the random number generator used to generate the final word. Changing this will change the final word.'
      >
        <input
          type='number'
          class='input input-primary'
          value={seed()}
          onChange={e => setSeed(e.currentTarget.valueAsNumber)}
        />
      </MenuItem>

      <div class='flex justify-end'>
        <button
          class='btn btn-primary'
          onClick={() => {
            setGlobalStore({
              ...initialGlobalStore,
              gameMode: gameMode(),
              gameState: GameState.Starting,
              seed: seed(),
              offset: offset(),
            });
            props.handleClose();
          }}
        >
          Play
        </button>
      </div>
    </>
  );
};

const Sidebar: Component<{ handleClose: () => void }> = props => {
  return (
    <>
      <DefaultGameMode />

      <Collapse title='Custom Game'>
        <CustomGame handleClose={props.handleClose} />
      </Collapse>
    </>
  );
};
export default Sidebar;
