import { Component, For } from 'solid-js';

const WordRow: Component<{ word: string }> = props => {
  return (
    <div class='mb-2 flex'>
      <div class='w-full flex-1 border-b-2 border-b-base-content border-opacity-50 px-2 py-1 text-center text-2xl font-bold uppercase'>
        {props.word}
      </div>
      <a
        class='btn btn-circle btn-ghost border-0'
        href={`https://www.merriam-webster.com/thesaurus/${props.word}`}
        target='_blank'
      >
        <svg fill='none' viewBox='0 0 24 24' stroke-width='2' class='h-10 w-10 stroke-info'>
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
          />
        </svg>
      </a>
    </div>
  );
};

interface CurrentWordRowProps {
  word: string;
  isValid: boolean;
  hasAntonym: boolean;
  isWrong: boolean;
  isFinal: boolean;
  handleClick: () => void;
}
const CurrentWordRow: Component<CurrentWordRowProps> = props => {
  return (
    <div class='mb-2 flex'>
      <div
        class='w-full flex-1 border-b-2 px-2 py-1 text-center text-2xl font-bold uppercase outline-none transition-all'
        classList={{
          'border-b-base-content': !(props.isWrong || props.isValid),
          'border-b-success': !props.isWrong && props.isValid,
          'text-success': props.isFinal,
          'border-b-error text-error animate-shake': props.isWrong,
        }}
      >
        {props.isFinal ? (
          <For each={[...props.word]}>
            {(letter, i) => (
              <span class='inline-block animate-wave' style={{ 'animation-delay': `${0.1 * i()}s` }}>
                {letter}
              </span>
            )}
          </For>
        ) : (
          <>
            {props.word}
            <span class='-mt-2 ml-0.5 inline-block h-9 w-0.5 animate-blink bg-current align-middle' />
          </>
        )}
      </div>
      {props.isFinal ? (
        <div class='flex h-12 w-12 items-center justify-center rounded-full bg-success text-success-content'>
          <svg fill='none' viewBox='1 0 24 24' stroke-width='2.5' class='h-10 w-10 stroke-current'>
            <path stroke-linecap='round' stroke-linejoin='round' d='M4.5 12.75l6 6 9-13.5' />
          </svg>
        </div>
      ) : (
        <button
          class='btn btn-circle border-0'
          classList={{
            'btn-disabled': !props.hasAntonym,
            'btn-success': props.hasAntonym,
          }}
          onClick={props.handleClick}
        >
          <svg fill='none' viewBox='0 0 24 24' stroke-width='2' class='h-10 w-10 stroke-current'>
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
            />
          </svg>
        </button>
      )}
    </div>
  );
};

interface WordListProps {
  words: string[];
  currentWord: string;
  isCurrentWordValid: boolean;
  currentWordHasAntonym: boolean;
  isCurrentWordWrong: boolean;
  isCurrentWordFinal: boolean;
  handleClick: () => void;
}
const WordList: Component<WordListProps> = props => {
  return (
    <div class='mx-auto flex w-full max-w-sm flex-1 flex-col-reverse overflow-scroll py-1'>
      <div>
        <For each={props.words}>{word => <WordRow word={word} />}</For>
        <CurrentWordRow
          word={props.currentWord}
          isValid={props.isCurrentWordValid}
          hasAntonym={props.currentWordHasAntonym}
          isWrong={props.isCurrentWordWrong}
          isFinal={props.isCurrentWordFinal}
          handleClick={props.handleClick}
        />
      </div>
    </div>
  );
};
export default WordList;
