import { Component, For, JSX, createSignal } from 'solid-js';

interface TabComponent {
  name: string;
  children: JSX.Element;
}
const Tabs: Component<{ children: TabComponent[] }> = props => {
  const [active, setActive] = createSignal(0);

  return (
    <>
      <div class='tabs'>
        <For each={props.children}>
          {({ name }, i) => (
            <a class='tab tab-bordered' classList={{ 'tab-active': i() === active() }} onClick={() => setActive(i())}>
              {name}
            </a>
          )}
        </For>
      </div>
      {props.children[active()].children}
    </>
  );
};
export default Tabs;
