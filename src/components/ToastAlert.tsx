import { ParentComponent } from 'solid-js';

const ToastAlert: ParentComponent<{ e?: 'info' | 'warning' }> = props => (
  <div class='toast toast-center toast-top top-12'>
    <div
      class='alert'
      classList={{
        'alert-info': !props.e || props.e === 'info',
        'alert-warning': props.e === 'warning',
      }}
    >
      <span>{props.children}</span>
    </div>
  </div>
);
export default ToastAlert;
