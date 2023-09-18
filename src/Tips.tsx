import { Component, ParentComponent } from 'solid-js';
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

const Word: ParentComponent<{ success?: boolean }> = props => (
  <div class='flex flex-col items-center'>
    <div
      class='my-1 border-b-2 px-2 text-center text-2xl font-bold transition-all'
      classList={{
        'border-b-base-content': !props.success,
        'border-b-success text-success': props.success,
      }}
    >
      {props.children}
    </div>
  </div>
);

interface TipsProps {
  open: boolean;
  handleClose: () => void;
}
const Tips: Component<TipsProps> = props => (
  <Modal
    open={props.open}
    handleClose={props.handleClose}
    footer={
      <div class='flex justify-between'>
        <label class='label cursor-pointer'>
          <input
            type='checkbox'
            class='checkbox-primary checkbox'
            checked={persistentStore.showTips}
            onChange={e => setPersistentStore({ showTips: e.currentTarget.checked })}
          />
          <span class='label-text ml-2'>Show on startup</span>
        </label>
        <button
          class='btn btn-primary'
          onClick={() => {
            setGlobalStore({ ...initialGlobalStore, gameState: GameState.Starting });
            props.handleClose();
          }}
        >
          Let's Play
        </button>
      </div>
    }
  >
    <h2 class='text-xl font-bold'>How To Play</h2>
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
    <Word success>HARD</Word>

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
  </Modal>
);
export default Tips;
