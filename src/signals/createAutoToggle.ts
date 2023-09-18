import { Accessor, createSignal } from 'solid-js';

export default function createAutoToggle(delayMs: number): [Accessor<boolean>, () => void] {
  const [toggle, setToggle] = createSignal(false);
  let timeout: number;
  return [toggle, () => {
    window.clearTimeout(timeout);
    setToggle(true);
    timeout = window.setTimeout(() => setToggle(false), delayMs);
  }];
}