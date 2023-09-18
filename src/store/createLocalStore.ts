import { createEffect } from 'solid-js';
import { SetStoreFunction, Store, createStore } from 'solid-js/store';

export default function createLocalStore<T extends object = {}>(
  name: string,
  init: T,
): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore<T>(init);
  const localState = localStorage.getItem(name);
  if (localState) {
    setState(JSON.parse(localState));
  }
  createEffect(() => localStorage.setItem(name, JSON.stringify(state)));
  return [state, setState];
}
