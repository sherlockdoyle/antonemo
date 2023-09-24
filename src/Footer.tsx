import { Component } from 'solid-js';

const GitHub: Component = () => (
  <a class='flex flex-col items-center' href='https://github.com/sherlockdoyle/antonemo' target='_blank'>
    <svg viewBox='0 0 24 24' class='h-12 w-12 fill-current'>
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z'
      ></path>
    </svg>
    See code
  </a>
);

const HowToPlay: Component<{ handleTips: () => void }> = props => (
  <button class='flex flex-col items-center' onClick={props.handleTips}>
    <svg viewBox='0 0 24 24' stroke-width='2' class='h-12 w-12 fill-none stroke-current'>
      <path
        stroke-linecap='round'
        stroke-linejoin='round'
        d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z'
      />
    </svg>
    How to play
  </button>
);

const Footer: Component<{ handleTips: () => void }> = props => {
  return (
    <div class='flex justify-around'>
      <GitHub />
      <HowToPlay handleTips={props.handleTips} />
    </div>
  );
};
export default Footer;
