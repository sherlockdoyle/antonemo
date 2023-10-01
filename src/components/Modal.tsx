import { JSX, ParentComponent, createEffect } from 'solid-js';

interface CommonModalProps {
  e: boolean;
  t?: JSX.Element;
}
interface CloseableModalProps extends CommonModalProps {
  o?: false;
  n: () => void;
}
interface KeepOpenModalProps extends CommonModalProps {
  o: true;
  n?: undefined;
}
const Modal: ParentComponent<CloseableModalProps | KeepOpenModalProps> = props => {
  let dialog!: HTMLDialogElement;

  createEffect(() => {
    if (props.e) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  });

  return (
    <dialog
      class='modal'
      ref={dialog}
      onCancel={props.o ? e => e.preventDefault() : undefined}
      onClose={props.n}
    >
      <div class='modal-box flex flex-col'>
        {props.o || (
          <form method='dialog'>
            <button class='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>✕</button>
          </form>
        )}
        <div class='overflow-scroll'>{props.children}</div>
        {props.t && <div class='pt-4'>{props.t}</div>}
      </div>
    </dialog>
  );
};
export default Modal;
