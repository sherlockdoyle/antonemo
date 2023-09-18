import { ParentComponent } from 'solid-js';

const Collapse: ParentComponent<{ title: string }> = props => {
  return (
    <div class='collapse border border-info'>
      <input type='checkbox' />
      <div class='collapse-title text-lg font-bold'>{props.title}</div>
      <div class='collapse-content'>{props.children}</div>
    </div>
  );
};
export default Collapse;
