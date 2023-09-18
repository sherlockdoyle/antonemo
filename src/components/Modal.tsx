import { JSX, ParentComponent, createEffect } from 'solid-js';

interface CommonModalProps {
  open: boolean;
  footer?: JSX.Element;
}
interface CloseableModalProps extends CommonModalProps {
  keepOpen?: false;
  handleClose: () => void;
}
interface KeepOpenModalProps extends CommonModalProps {
  keepOpen: true;
  handleClose?: undefined;
}
const Modal: ParentComponent<CloseableModalProps | KeepOpenModalProps> = props => {
  let dialog!: HTMLDialogElement;

  createEffect(() => {
    if (props.open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  });

  return (
    <dialog
      class='modal'
      ref={dialog}
      onCancel={props.keepOpen ? e => e.preventDefault() : undefined}
      onClose={props.handleClose}
    >
      <div class='modal-box flex flex-col'>
        {props.keepOpen || (
          <form method='dialog'>
            <button class='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>✕</button>
          </form>
        )}
        <div class='overflow-scroll'>{props.children}</div>
        {props.footer && <div class='pt-4'>{props.footer}</div>}
      </div>
    </dialog>
  );
};
export default Modal;
