import { Component, For, createSignal } from 'solid-js';
import Modal from './components/Modal';
import Tabs from './components/Tabs';
import { globalStore, setGlobalStore } from './store/store';
import { ANTONYM_HINT_FACTOR, GameState, WORD_HINT_FACTOR, WordAndAntonym } from './utils/engine';

function wordToString(word: WordAndAntonym): string {
  return `${word[0]} (${word[1]})`;
}

interface TipsProps {
  open: boolean;
  handleClose: () => void;
  getWords: () => WordAndAntonym[];
  getWordsWithAntonyms: () => WordAndAntonym[];
  getSolution: () => WordAndAntonym[];
}
const Hints: Component<TipsProps> = props => {
  const [words, setWords] = createSignal<WordAndAntonym[]>();
  const [wordsWithAntonyms, setWordsWithAntonyms] = createSignal<WordAndAntonym[]>();
  const [solution, setSolution] = createSignal<WordAndAntonym[]>();

  let random = 0;

  return (
    <Modal open={props.open} handleClose={props.handleClose}>
      <Tabs>
        {[
          {
            name: 'Hint',
            children: (
              <div class='mt-3 flex gap-4'>
                <div class='flex-1'>
                  <button class='btn w-full' onClick={() => setWords(props.getWords())}>
                    Show a valid word
                  </button>
                  <div class='text mx-1 text-xs normal-case'>
                    Number of steps will become {Math.floor(globalStore.steps * WORD_HINT_FACTOR)}.
                  </div>
                  {words() && (
                    <div class='text-lg font-semibold uppercase'>{words()![random++ % words()!.length][0]}</div>
                  )}
                </div>
                <div class='flex-1'>
                  <button class='btn w-full' onClick={() => setWordsWithAntonyms(props.getWordsWithAntonyms())}>
                    with antonym
                  </button>
                  <div class='text mx-1 text-xs normal-case'>
                    Number of steps will become {Math.floor(globalStore.steps * ANTONYM_HINT_FACTOR)}.
                  </div>
                  {wordsWithAntonyms() && (
                    <div class='text-lg font-semibold uppercase'>
                      {wordToString(wordsWithAntonyms()![random++ % wordsWithAntonyms()!.length])}
                    </div>
                  )}
                </div>
              </div>
            ),
          },
          {
            name: 'Solution',
            children: solution() ? (
              <>
                <h2 class='mt-1 text-xl font-bold'>Here is one possible sequence of words (and their antonyms).</h2>
                <h3 class='mb-3 text-lg font-bold'>May contain redundant words.</h3>
                <div class='text-lg font-semibold uppercase'>
                  <For each={solution()}>
                    {([word, antonym], i) => (
                      <span class='inline-block'>
                        {i() === 0 || (
                          <svg
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke-width='2.5'
                            class='mx-2 inline-block h-6 w-6 stroke-current align-[-18%]'
                          >
                            <path
                              stroke-linecap='round'
                              stroke-linejoin='round'
                              d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                            />
                          </svg>
                        )}
                        {word} {i() < solution()!.length - 1 && antonym && <i>({antonym})</i>}
                      </span>
                    )}
                  </For>
                </div>
              </>
            ) : (
              <>
                <h2 class='mt-1 text-xl font-bold'>Are you sure you want to see the solution?</h2>
                <h3 class='mb-3 text-lg font-bold'>You will lose the game.</h3>
                <div class='flex gap-2'>
                  <button
                    class='btn'
                    onClick={() => {
                      setSolution(props.getSolution());
                      setGlobalStore({ gameState: GameState.Lost });
                    }}
                  >
                    Yes
                  </button>
                  <button class='btn btn-secondary' onClick={() => props.handleClose()}>
                    No
                  </button>
                </div>
              </>
            ),
          },
        ]}
      </Tabs>
    </Modal>
  );
};
export default Hints;
