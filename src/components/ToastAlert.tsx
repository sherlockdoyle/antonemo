import { ParentComponent } from 'solid-js';

const ToastAlert: ParentComponent<{ status?: 'info' | 'warning' }> = props => (
  <div class='toast toast-center toast-top top-12'>
    <div
      class='alert'
      classList={{
        'alert-info': !props.status || props.status === 'info',
        'alert-warning': props.status === 'warning',
      }}
    >
      <span>{props.children}</span>
    </div>
  </div>
);
export default ToastAlert;
