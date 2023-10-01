import { Component, ParentComponent, createSignal } from 'solid-js';
import Modal from './components/Modal';
import { initialGlobalStore, persistentStore, setGlobalStore, setPersistentStore } from './store/store';
import { GameState } from './utils/engine';

const KBD1: Component = () => (
  <div class='my-1 flex flex-wrap gap-1'>
    <div
      class='btn btn-disabled text-xl font-bold'
      style={{
        'background-color': 'hsl(var(--su)/var(--tw-bg-opacity))',
      }}
    >
      A
    </div>
    <div class='btn btn-disabled text-xl font-bold'>C</div>
    <div class='btn btn-success text-xl font-bold'>D</div>
    <div class='btn text-xl font-bold'>E</div>
    <div
      class='btn btn-disabled text-xl font-bold'
      style={{
        'background-color': 'hsl(var(--su)/var(--tw-bg-opacity))',
      }}
    >
      H
    </div>
    <div class='btn text-xl font-bold'>O</div>
    <div class='btn btn-success text-xl font-bold'>R</div>
    <div class='btn btn-disabled text-xl font-bold'>S</div>
  </div>
);
const KBD2: Component = () => (
  <div class='my-1 flex flex-wrap gap-1'>
    <div class='btn btn-success text-xl font-bold'>A</div>
    <div class='btn text-xl font-bold'>C</div>
    <div class='btn btn-success text-xl font-bold'>D</div>
    <div class='btn text-xl font-bold'>E</div>
    <div class='btn btn-success text-xl font-bold'>H</div>
    <div class='btn text-xl font-bold'>O</div>
    <div class='btn btn-success text-xl font-bold'>R</div>
    <div class='btn text-xl font-bold'>S</div>
  </div>
);

const Word: ParentComponent<{ e?: boolean }> = props => (
  <div class='flex flex-col items-center'>
    <div
      class='my-1 border-b-2 px-2 text-center text-2xl font-bold transition-all'
      classList={{
        'border-b-base-content': !props.e,
        'border-b-success text-success': props.e,
      }}
    >
      {props.children}
    </div>
  </div>
);

const EasyTips: Component = () => (
  <>
    <p>You need to make a word with the correct letters. This is how you can play:</p>
    <ul class='ml-4 mt-4 list-disc'>
      <li>Use the letters that are on to make words.</li>
      <li>You win the game when you make the final word. The letters for this word are green.</li>
      <li>When you make a word, its opposite word (if it has one) is also added to the game.</li>
      <li>The letters in the opposite words turns on and you can use them later.</li>
    </ul>

    <h3 class='mb-1 mt-4 text-lg font-bold'>Example</h3>
    <KBD1 />
    <p>
      Let's see an example where <b>A</b>, <b>D</b>, <b>H</b>, and <b>R</b> are the letters that form the final word,
      which in this case is <b>HARD</b>.
    </p>
    <p>
      The letters that are on are <b>D</b>, <b>E</b>, <b>O</b>, and <b>R</b>. You can use them to make words. The other
      letters are off and you need to turn them on before you can use them.
    </p>
    <Word>ORDER</Word>
    <p>
      Let's say we make the word <b>ORDER</b>.
    </p>
    <Word>CHAOS</Word>
    <p>
      The opposite word of <b>ORDER</b> is <b>CHAOS</b>, which is added to the game too.
    </p>
    <KBD2 />
    <p>Now, all the letters we need are on, and we can make the final word!</p>
    <Word e>HARD</Word>

    <h3 class='mb-1 mt-4 text-lg font-bold'>Scoring</h3>
    <p>
      Your score is based on how many steps you take to make the final word. A lower score is better. Every word you
      make adds 1 to your steps. If you use hints, your steps will go up more.
    </p>

    <h3 class='mb-1 mt-4 text-lg font-bold'>Notes</h3>
    <p>
      Please remember that a word can have more than one opposite word. So the opposite of an opposite may not be the
      same as the first word.
    </p>
    <p>
      Also, since the game uses a list of auto-generated words, there may be some wrong opposite words. If you find any
      mistakes, please let me know.
    </p>
  </>
);

const HardTips: Component = () => (
  <>
    <p>The objective of the game is to construct the final word using the correct letters. Here's how you can play:</p>
    <ul class='ml-4 mt-4 list-disc'>
      <li>Utilize the active letters to form words.</li>
      <li>
        The game is won when the final word is constructed. The letters that make up this word are highlighted in green.
      </li>
      <li>When a word is added, its antonym (if it exists) is also included in the game.</li>
      <li>Letters present in the added antonyms become active for future use.</li>
    </ul>

    <h3 class='mb-1 mt-4 text-lg font-bold'>Example</h3>
    <KBD1 />
    <p>
      Let's consider an example where <b>A</b>, <b>D</b>, <b>H</b>, and <b>R</b> are the letters that form the final
      word, which in this case is <b>HARD</b>.
    </p>
    <p>
      The active letters are <b>D</b>, <b>E</b>, <b>O</b>, and <b>R</b>. These can be used to form words. The remaining
      letters are inactive and need to be activated before they can be used.
    </p>
    <Word>ORDER</Word>
    <p>
      Suppose we add the word <b>ORDER</b>.
    </p>
    <Word>CHAOS</Word>
    <p>
      The antonym of <b>ORDER</b> is <b>CHAOS</b>, which is automatically added to the game.
    </p>
    <KBD2 />
    <p>Now, all the required letters are active, and we can construct the final word!</p>
    <Word e>HARD</Word>

    <h3 class='mb-1 mt-4 text-lg font-bold'>Scoring</h3>
    <p>
      The score is calculated based on the number of steps taken to construct the final word. Therefore, a lower score
      is more desirable. Each added word increases the step count by 1. Utilizing hints will multiply the current step
      count by a certain amount.
    </p>

    <h3 class='mb-1 mt-4 text-lg font-bold'>Notes</h3>
    <p>
      Please note that a word may have multiple antonyms. So the antonym of an antonym may not be the same as the
      original word.
    </p>
    <p>
      Additionally, since the game uses an auto-generated wordlist, there may be wrong antonyms. If you come across any
      such errors, please let me know.
    </p>
  </>
);

interface TipsProps {
  e: boolean;
  t: () => void;
}
const Tips: Component<TipsProps> = props => {
  const [showEasy, setShowEasy] = createSignal(Math.random() < 0.5);

  return (
    <Modal
      e={props.e}
      n={props.t}
      t={
        <div class='flex justify-between'>
          <label class='label cursor-pointer'>
            <input
              type='checkbox'
              class='checkbox-primary checkbox'
              checked={persistentStore.s}
              onChange={e => setPersistentStore({ s: e.currentTarget.checked })}
            />
            <span class='label-text ml-2'>Show on startup</span>
          </label>
          <button
            class='btn btn-primary'
            onClick={() => {
              setGlobalStore({ ...initialGlobalStore, u: GameState.t });
              props.t();
            }}
          >
            Let's Play
          </button>
        </div>
      }
    >
      <h2 class='text-xl font-bold' onClick={() => setShowEasy(!showEasy())}>
        How To Play
      </h2>
      {showEasy() ? <EasyTips /> : <HardTips />}
    </Modal>
  );
};
export default Tips;
