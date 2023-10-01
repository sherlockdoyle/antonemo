import { Component, For } from 'solid-js';
import { Key } from '../utils/engine';

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['💡', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
] as const;

interface ButtonProps {
  e: string;
  t: boolean;
  o: boolean;
  n: () => void;
}
const Button: Component<ButtonProps> = props => {
  const isEnter = props.e === 'ENTER';
  const isBackspace = props.e === '⌫';
  const isHint = props.e === '💡';
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
        'btn-disabled': !(isBigKey || isHint || props.t),
        'btn-success': props.o,
      }}
      style={
        !props.t && props.o ? { 'background-color': 'hsl(var(--su)/var(--tw-bg-opacity))' } : undefined
      }
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
      onClick={props.n}
    >
      {props.e}
    </button>
  );
};

interface KeyboardProps {
  e: Set<string>;
  t: Set<string>;
  o: (key: Key | 'HINT') => void;
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
                  e={key}
                  t={props.e.has(key)}
                  o={props.t.has(key)}
                  n={() => props.o(key === '💡' ? 'HINT' : key === '⌫' ? 'BACKSPACE' : key)}
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
