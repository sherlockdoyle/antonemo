import { Component, For } from 'solid-js';
import { Key } from '../utils/engine';

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['💡', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
] as const;

interface ButtonProps {
  key: string;
  isActive: boolean;
  isCorrect: boolean;
  handleClick: () => void;
}
const Button: Component<ButtonProps> = props => {
  const isEnter = props.key === 'ENTER';
  const isBackspace = props.key === '⌫';
  const isHint = props.key === '💡';
  const isBigKey = isEnter || isBackspace;
  return (
    <button
      class='btn h-12 flex-1 touch-manipulation px-0 font-bold'
      classList={{
        'flex-grow-[1.5]': isBigKey,
        'text-xl': !isEnter,
        'text-lg btn-info': isEnter,
        'btn-warning': isBackspace,
        'btn-circle btn-ghost': isHint,
        'btn-disabled': !(isBigKey || isHint || props.isActive),
        'btn-success': props.isCorrect,
      }}
      style={
        !props.isActive && props.isCorrect ? { 'background-color': 'hsl(var(--su)/var(--tw-bg-opacity))' } : undefined
      }
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
      onClick={props.handleClick}
    >
      {props.key}
    </button>
  );
};

interface KeyboardProps {
  activeLetters: Set<string>;
  correctLetters: Set<string>;
  handleKeyPress: (key: Key | 'HINT') => void;
}
const Keyboard: Component<KeyboardProps> = props => {
  return (
    <div class='flex flex-col gap-1'>
      <For each={KEYBOARD_ROWS}>
        {row => (
          <div class='flex w-full justify-center gap-0.5 sm:gap-1'>
            <For each={row}>
              {key => (
                <Button
                  key={key}
                  isActive={props.activeLetters.has(key)}
                  isCorrect={props.correctLetters.has(key)}
                  handleClick={() => props.handleKeyPress(key === '💡' ? 'HINT' : key === '⌫' ? 'BACKSPACE' : key)}
                />
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};
export default Keyboard;
