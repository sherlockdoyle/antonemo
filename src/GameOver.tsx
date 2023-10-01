import { Component } from 'solid-js';
import Modal from './components/Modal';
import { globalStore, initialGlobalStore, persistentStore, setGlobalStore } from './store/store';
import { GameMode, GameState } from './utils/engine';

interface CommonProps {
  e: number;
  t: () => void;
  o: () => void;
}
const NextStep: Component<CommonProps> = props => (
  <>
    {(persistentStore.p[persistentStore.l]?.[GameMode.e] ?? 0) < props.e && (
      <>
        <button
          class='btn btn-secondary'
          onClick={() => {
            setGlobalStore({ ...initialGlobalStore, l: GameMode.e, u: GameState.t });
            props.t();
          }}
        >
          try the easy mode
        </button>
        or
      </>
    )}
    {(persistentStore.p[persistentStore.l]?.[GameMode.t] ?? 0) < props.e && (
      <>
        <button
          class='btn btn-secondary'
          onClick={() => {
            setGlobalStore({ ...initialGlobalStore, l: GameMode.t, u: GameState.t });
            props.t();
          }}
        >
          try the hard mode
        </button>
        or
      </>
    )}
    <button class='btn btn-accent' onClick={props.o}>
      try a custom game
    </button>
    or try again tomorrow.
  </>
);

const Won: Component = () => (
  <>
    <h1 class='mb-4 text-4xl font-bold text-success'>You Won!</h1>
    Congratulations! You won the game in {globalStore.e} step{globalStore.e === 1 || 's'}. You are awesome! You can
  </>
);

const Lost: Component = () => (
  <>
    <h1 class='mb-4 text-4xl font-bold text-error'>Game Over</h1>
    Oops! You saw the solution and lost the game. You can
  </>
);

const PAGE_URL = 'https://sherlockdoyle.github.io/antonemo';
const Share: Component<CommonProps> = props => {
  const text = () =>
    `I just finished Antonemo, a logical game about opposite words, in only ${globalStore.e} step${
      globalStore.e === 1 ? '' : 's'
    }! Can you beat my record?`;
  const url = () => {
    const day = props.e + globalStore.f;
    return PAGE_URL + `?${day}${persistentStore.l}${globalStore.l}${globalStore.p === day ? '' : globalStore.p}`;
  };

  return (
    <>
      <div class='mt-2 w-full border-t-2 border-t-base-content border-opacity-20 pt-1 text-left text-xl font-bold'>
        Share
      </div>
      <div class='flex w-full flex-wrap justify-around'>
        <button
          class='btn btn-circle'
          title='Copy text'
          onClick={() => navigator.clipboard.writeText(text() + '\n\n' + url())}
        >
          <svg viewBox='0 0 24 24' class='h-12 w-12 fill-current'>
            <path d='m19.086 6.061-1.6214-1.6214a1.5 1.5 0 0 0-1.0606-0.43941h-5.3786c-0.82861 0-1.5 0.67162-1.5 1.5v1.5h-2.5c-0.82842 0-1.5 0.67162-1.5 1.5v9.9998c0 0.82861 0.67162 1.5 1.5 1.5h6.9999c0.82842 0 1.4999-0.67144 1.4999-1.5v-1.4999h2.5001c0.82842 0 1.4999-0.67162 1.4999-1.5v-8.3786a1.5 1.5 0 0 0-0.43941-1.0606zm-5.2481 12.439h-6.6249a0.1875 0.1875 0 0 1-0.18741-0.18741v-9.6249a0.1875 0.1875 0 0 1 0.18741-0.18741h2.3125v6.9999c0 0.82842 0.67144 1.5 1.5 1.5h2.9999v1.3126a0.1875 0.1875 0 0 1-0.18741 0.18741zm4-2.9999h-6.625a0.1875 0.1875 0 0 1-0.18741-0.1876v-9.6248a0.1875 0.1875 0 0 1 0.18741-0.1876h3.3126v2.75c0 0.41421 0.33581 0.75002 0.75002 0.75002h2.75v6.3124a0.1875 0.1875 0 0 1-0.1876 0.1876zm0.1876-8h-2.0001v-2h0.30109c0.0504 0 0.09707 0.01867 0.13253 0.05413l1.5114 1.5116a0.1875 0.1875 0 0 1 0.05413 0.13253z' />
          </svg>
        </button>

        <a
          class='btn btn-circle'
          title='Share on WhatsApp'
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text() + '\n\n' + url())}`}
          target='_blank'
        >
          <svg viewBox='0 0 24 24' class='h-12 w-12 fill-current'>
            <path d='m17.643 6.3351c-1.4703-1.5135-3.5027-2.3351-5.5784-2.3351-4.4108 0-7.9568 3.5892-7.9135 7.9568 0 1.3838 0.38919 2.7243 1.0378 3.9351l-1.1243 4.1081 4.1946-1.0811c1.1676 0.64865 2.4649 0.95135 3.7622 0.95135 4.3676 0 7.9135-3.5892 7.9135-7.9568 0-2.1189-0.82162-4.1081-2.2919-5.5784zm-5.5784 12.195c-1.1676 0-2.3351-0.3027-3.3297-0.90811l-0.25946-0.12973-2.5081 0.64865 0.64865-2.4649-0.17297-0.25946c-1.9027-3.0703-0.99459-7.1351 2.1189-9.0378 3.1135-1.9027 7.1351-0.99459 9.0378 2.1189 1.9027 3.1135 0.9946 7.1351-2.1189 9.0378-0.99459 0.64865-2.2054 0.9946-3.4162 0.9946zm3.8054-4.8-0.47568-0.21622s-0.69189-0.3027-1.1243-0.51892c-0.04324 0-0.08649-0.04324-0.12973-0.04324-0.12973 0-0.21622 0.04324-0.3027 0.08649 0 0-0.04324 0.04324-0.64865 0.73514-0.04324 0.08649-0.12973 0.12973-0.21622 0.12973h-0.04324c-0.04324 0-0.12973-0.04324-0.17297-0.08649l-0.21622-0.08649c-0.47568-0.21622-0.90811-0.47568-1.2541-0.82162-0.08649-0.08649-0.21622-0.17297-0.3027-0.25946-0.3027-0.3027-0.60541-0.64865-0.82162-1.0378l-0.04324-0.08649c-0.04325-0.04324-0.04325-0.08649-0.08649-0.17297 0-0.08649 0-0.17297 0.04324-0.21622 0 0 0.17297-0.21622 0.3027-0.34595 0.08649-0.08648 0.12973-0.21621 0.21622-0.3027 0.08649-0.12973 0.12973-0.3027 0.08649-0.43243-0.043244-0.21622-0.56216-1.3838-0.69189-1.6432-0.086486-0.12973-0.17297-0.17297-0.3027-0.21622h-0.47568c-0.086486 0-0.17297 0.04324-0.25946 0.04324l-0.043243 0.04324c-0.086486 0.04324-0.17297 0.12973-0.25946 0.17297-0.086487 0.08649-0.12973 0.17297-0.21622 0.25946-0.3027 0.38919-0.47568 0.86486-0.47568 1.3405 0 0.34595 0.086486 0.69189 0.21622 0.9946l0.043243 0.12973c0.38919 0.82162 0.90811 1.5568 1.6 2.2054l0.17297 0.17297c0.12973 0.12973 0.25946 0.21622 0.34595 0.34595 0.90811 0.77838 1.9459 1.3405 3.1135 1.6432 0.12973 0.04324 0.3027 0.04324 0.43243 0.08649h0.43243c0.21622 0 0.47568-0.08649 0.64865-0.17297 0.12973-0.08649 0.21622-0.08649 0.3027-0.17297l0.08649-0.08648c0.08649-0.08649 0.17297-0.12973 0.25946-0.21622s0.17297-0.17297 0.21622-0.25946c0.08649-0.17297 0.12973-0.38919 0.17297-0.6054v-0.3027s-0.04324-0.04324-0.12973-0.08649z' />
          </svg>
        </a>

        <a
          class='btn btn-circle'
          title='Share on Facebook'
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url(),
          )}&title=Antonemo&description=${encodeURIComponent(text())}&hashtag=antonemo`}
          target='_blank'
        >
          <svg viewBox='0 0 24 24' class='h-12 w-12 fill-current'>
            <path d='m16.667 15.333 0.53333-3.3333h-3.2v-2.3333c0-0.93333 0.33333-1.6667 1.8-1.6667h1.5333v-3.0667c-0.86667-0.13333-1.8-0.26667-2.6667-0.26667-2.7333 0-4.6667 1.6667-4.6667 4.6667v2.6667h-3v3.3333h3v8.4667c0.66667 0.13333 1.3333 0.2 2 0.2s1.3333-0.06667 2-0.2v-8.4667z' />
          </svg>
        </a>

        <a
          class='btn btn-circle'
          title='Share on Twitter'
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text())}&url=${encodeURIComponent(
            url(),
          )}&hashtags=antonemo`}
          target='_blank'
        >
          <svg viewBox='0 0 24 24' class='h-9 w-9 fill-current'>
            <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
          </svg>
        </a>

        <a
          class='btn btn-circle'
          title='Share on Reddit'
          href={`https://www.reddit.com/submit?url=${encodeURIComponent(url())}&title=${encodeURIComponent(
            `I finished Antonemo in ${globalStore.e} step${globalStore.e === 1 ? '' : 's'}`,
          )}`}
          target='_blank'
        >
          <svg viewBox='0 0 24 24' class='h-12 w-12 fill-current'>
            <path d='m20.004 12a1.752 1.752 0 0 0-2.964-1.2 8.544 8.544 0 0 0-4.62-1.476l0.78-3.744 2.568 0.54a1.2 1.2 0 1 0 0.156-0.732l-2.94-0.588a0.372 0.372 0 0 0-0.444 0.288l-0.888 4.164a8.568 8.568 0 0 0-4.68 1.476 1.752 1.752 0 1 0-1.932 2.868 3.444 3.444 0 0 0 0 0.528c0 2.688 3.132 4.872 6.996 4.872s6.996-2.184 6.996-4.872a3.444 3.444 0 0 0 0-0.528 1.752 1.752 0 0 0 0.972-1.596zm-12 1.2a1.2 1.2 0 1 1 1.2 1.2 1.2 1.2 0 0 1-1.2-1.2zm6.972 3.3a4.608 4.608 0 0 1-2.964 0.924 4.608 4.608 0 0 1-2.964-0.924 0.324 0.324 0 0 1 0.456-0.456 3.924 3.924 0 0 0 2.496 0.756 3.936 3.936 0 0 0 2.508-0.732 0.3352 0.3352 0 1 1 0.468 0.48zm-0.216-2.052a1.2 1.2 0 1 1 1.2-1.2 1.2 1.2 0 0 1-1.212 1.248z' />
          </svg>
        </a>

        <button
          class='btn btn-circle'
          title='Share anywhere'
          onClick={() => navigator.share?.({ title: 'Antonemo', text: text(), url: url() })}
        >
          <svg viewBox='0 0 24 24' class='h-12 w-12 fill-current'>
            <path d='m16.053 14.105c-0.76643 0-1.4644 0.29268-1.9886 0.77216l-5.2609-2.146c0.12216-0.47994 0.12216-0.98284 0-1.4628l5.2609-2.146c0.52421 0.47952 1.2222 0.77221 1.9886 0.77221 1.6278 0 2.9474-1.3196 2.9474-2.9474s-1.3196-2.9474-2.9474-2.9474-2.9474 1.3196-2.9474 2.9474c0 0.25247 0.03184 0.49752 0.09158 0.73142l-5.2609 2.146c-0.52416-0.47952-1.2221-0.77221-1.9885-0.77221-1.6278 0-2.9474 1.3196-2.9474 2.9474s1.3196 2.9474 2.9474 2.9474c0.76642 0 1.4644-0.29268 1.9886-0.77216l5.2609 2.146c-0.06096 0.23902-0.09173 0.48474-0.09158 0.73142 0 1.6278 1.3196 2.9474 2.9474 2.9474s2.9474-1.3196 2.9474-2.9474c-6.1e-5 -1.6278-1.3196-2.9474-2.9474-2.9474z' />
          </svg>
        </button>
      </div>
    </>
  );
};

interface GameOverProps extends CommonProps {
  n: boolean;
}
const GameOver: Component<GameOverProps> = props => {
  return (
    <Modal e={props.n} o>
      <div class='flex flex-col items-center gap-2 text-center text-lg'>
        {globalStore.u === GameState.n ? <Won /> : <Lost />}
        <NextStep {...props} />
        {globalStore.u === GameState.n && <Share {...props} />}
      </div>
    </Modal>
  );
};
export default GameOver;
