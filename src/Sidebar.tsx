import { Component, For, JSXElement, ParentComponent, createSignal } from 'solid-js';
import Collapse from './components/Collapse';
import { globalStore, initialGlobalStore, persistentStore, setGlobalStore, setPersistentStore } from './store/store';
import { GameMode, GameState } from './utils/engine';
import { WordListType } from './utils/word-graph';

interface MenuItemProps {
  e: string;
  t?: JSXElement;
}
const MenuItem: ParentComponent<MenuItemProps> = props => (
  <>
    <div class='flex flex-wrap items-baseline justify-between'>
      <h1 class='mr-1 text-lg font-bold'>{props.e}</h1>
      {props.children}
    </div>
    <div class='text-sm'>{props.t}</div>
    <div class='divider' />
  </>
);

const wordListHint: Record<
  WordListType,
  {
    e: string;
    t: string;
  }
> = {
  m: { e: 'MANUAL', t: '500+ most common words. The antonyms were manually picked.' },
  d: { e: 'DEFAULT', t: 'Auto-generated wordlist with 5000+ words. May contain mistakes.' },
  l: { e: 'LARGE', t: '38769 words. Probably contains slangs, may hang the page.' },
};
const DefaultWordList: Component = () => {
  const initialWordListType = persistentStore.l;
  return (
    <MenuItem
      e='Word List'
      t={
        <>
          <p>{wordListHint[persistentStore.l].t}</p>
          {persistentStore.l !== initialWordListType && <i>Reload the page to apply changes.</i>}
        </>
      }
    >
      <select
        class='select select-bordered select-primary uppercase'
        value={persistentStore.l}
        onChange={e => setPersistentStore({ l: e.currentTarget.value as WordListType })}
      >
        <For each={Object.entries(wordListHint)}>{([key, { e }]) => <option value={key}>{e}</option>}</For>
      </select>
    </MenuItem>
  );
};

const DefaultGameMode: Component = () => (
  <MenuItem
    e='Default Game Mode'
    t={
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
        classList={{ 'btn-primary': persistentStore.m === GameMode.e }}
        onClick={() => setPersistentStore({ m: GameMode.e })}
      >
        Easy
      </button>
      <button
        class='btn join-item'
        classList={{ 'btn-primary': persistentStore.m === GameMode.t }}
        onClick={() => setPersistentStore({ m: GameMode.t })}
      >
        Hard
      </button>
    </div>
  </MenuItem>
);

const CustomGame: Component<{ e: () => void }> = props => {
  const [gameMode, setGameMode] = createSignal(globalStore.l);
  const [offset, setOffset] = createSignal(globalStore.f);
  const [seed, setSeed] = createSignal(globalStore.p);

  return (
    <>
      <MenuItem e='Game Mode'>
        <div class='join'>
          <button
            class='btn join-item'
            classList={{ 'btn-primary': gameMode() === GameMode.e }}
            onClick={() => setGameMode(GameMode.e)}
          >
            Easy
          </button>
          <button
            class='btn join-item'
            classList={{ 'btn-primary': gameMode() === GameMode.t }}
            onClick={() => setGameMode(GameMode.t)}
          >
            Hard
          </button>
        </div>
      </MenuItem>
      <MenuItem
        e='Word Offset'
        t='Every day, Antonemo welcomes you with a fresh word. But if you crave more challenges, you can increase this number. Changing this will change the letters available initially.'
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
        e='Random Seed'
        t='Seed for the random number generator used to generate the final word. Changing this will change the final word.'
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
              l: gameMode(),
              u: GameState.t,
              p: seed(),
              f: offset(),
            });
            props.e();
          }}
        >
          Play
        </button>
      </div>
    </>
  );
};

const Sidebar: Component<{ e: () => void }> = props => {
  return (
    <>
      <DefaultWordList />
      <DefaultGameMode />

      <Collapse e='Custom Game'>
        <CustomGame e={props.e} />
      </Collapse>
    </>
  );
};
export default Sidebar;
