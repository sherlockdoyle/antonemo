import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import Footer from './Footer';
import GameOver from './GameOver';
import Hints from './Hints';
import Sidebar from './Sidebar';
import Tips from './Tips';
import Keyboard from './components/Keyboard';
import Shell from './components/Shell';
import ToastAlert from './components/ToastAlert';
import WordList from './components/WordList';
import createAutoToggle from './signals/createAutoToggle';
import { globalStore, persistentStore, setGlobalStore, setPersistentStore } from './store/store';
import { GameEngine, GameMode, GameState, Key, WORD_PRIME } from './utils/engine';
import { parseParam } from './utils/param';
import handleTheme from './utils/theme';

function App() {
  const [openSidebar, setOpenSidebar] = createSignal(false);
  const [showLoading, setShowLoading] = createSignal(false);
  const [showTips, setShowTips] = createSignal(persistentStore.s);
  const [renderHints, setRenderHints] = createSignal(false);
  const [showHints, setShowHints] = createSignal(false);
  const [showGameOver, setShowGameOver] = createSignal(false);

  const [isCurrentWordWrong, setCurrentWordWrong] = createAutoToggle(1000);

  let firstRun = true,
    today = GameEngine.R(),
    engine: GameEngine;
  createEffect(async () => {
    if (globalStore.u === GameState.t || (firstRun && !showTips())) {
      setShowLoading(true);
      const params = firstRun ? parseParam(window.location.search.slice(1)) : {};
      firstRun = false;
      engine = new GameEngine(params.o ?? globalStore.l, setGlobalStore);
      await engine.f(params.t ?? persistentStore.l);
      engine.h(params.n ?? globalStore.p);
      let day = params.e ?? today + globalStore.f;
      while (true) {
        try {
          engine.y(((day % engine.d) * WORD_PRIME) % engine.d);
          break;
        } catch (e) {
          ++day;
        }
      }
      engine.O();
      setGlobalStore({ u: GameState.o });
      if (params.e == null && params.t == null && params.o == null && params.n == null) {
        setPersistentStore(store => ({
          ...store,
          p: {
            ...store.p,
            [persistentStore.l]: { ...store.p[store.l], [globalStore.l]: today },
          },
        }));
      }
      setRenderHints(false);
      setShowLoading(false);
      (document.activeElement as HTMLElement | null)?.blur();
      window.focus();
    }
  });
  onMount(() => {
    handleTheme(persistentStore.t);
    document.body.addEventListener('keydown', handleBodyKeyDown);
  });
  onCleanup(() => {
    document.body.removeEventListener('keydown', handleBodyKeyDown);
  });

  function handleKeyPress(key: Key | 'HINT') {
    if (globalStore.u !== GameState.o || engine.j()) return;
    if (key === 'HINT') {
      setRenderHints(true);
      setShowHints(true);
      return;
    }
    if (key === 'ENTER' && !engine.x()) {
      setCurrentWordWrong();
    }

    engine.T(key);
    engine.O();
    if (engine.j()) {
      window.setTimeout(() => {
        setGlobalStore({ u: GameState.n });
        setShowGameOver(true);
      }, 2000);
    }
  }
  function handleBodyKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleKeyPress('ENTER');
    } else if (e.key === 'Backspace') {
      handleKeyPress('BACKSPACE');
    } else if (e.key.match(/[a-z]/i)) {
      handleKeyPress(e.key.toLowerCase() as Key);
    }
  }

  return (
    <>
      <Shell
        e={persistentStore.t}
        t={() => {
          const newTheme = !persistentStore.t;
          handleTheme(newTheme);
          setPersistentStore({ t: newTheme });
        }}
        o={openSidebar()}
        n={setOpenSidebar}
        a={
          <div
            class={'text-3xl font-black uppercase'}
            classList={{
              'text-success': globalStore.l === GameMode.e,
              'text-error': globalStore.l === GameMode.t,
            }}
          >
            Antonemo
          </div>
        }
        r={<Sidebar e={() => setOpenSidebar(false)} />}
        s={
          <Footer
            e={() => {
              setShowTips(true);
              setOpenSidebar(false);
            }}
          />
        }
      >
        {globalStore.u === GameState.o && (
          <div class='flex h-full w-full max-w-lg flex-col gap-2 self-center p-2'>
            <div class='flex items-center justify-between'>
              {globalStore.d ? (
                <span class='flex h-12 items-center px-4 text-xl font-bold uppercase' title='Final word'>
                  {globalStore.d}
                </span>
              ) : (
                <button class='btn' onClick={() => setGlobalStore({ d: engine.b })}>
                  Show final word
                </button>
              )}
              {globalStore.c || `Steps: ${globalStore.e}`}
            </div>
            <WordList
              e={globalStore.t}
              t={globalStore.o}
              o={globalStore.n}
              n={globalStore.a}
              a={isCurrentWordWrong()}
              r={globalStore.r}
              s={() => handleKeyPress('ENTER')}
            />
            <Keyboard e={globalStore.s} t={globalStore.i} o={handleKeyPress} />
          </div>
        )}
      </Shell>

      {showLoading() && <ToastAlert e='info'>Loading game...</ToastAlert>}
      {isCurrentWordWrong() && <ToastAlert e='warning'>Not in word list!</ToastAlert>}

      <Tips e={showTips()} t={() => setShowTips(false)} />
      <GameOver
        n={showGameOver() && !showHints()}
        e={today}
        t={() => setShowGameOver(false)}
        o={() => {
          setShowGameOver(false);
          setOpenSidebar(true);
        }}
      />
      {renderHints() && (
        <Hints
          e={showHints()}
          t={() => setShowHints(false)}
          o={() => {
            const words = engine.N();
            engine.O();
            return words;
          }}
          n={() => {
            const words = engine.N(true);
            engine.O();
            return words;
          }}
          a={() => {
            const words = engine.A();
            engine.O();
            setShowGameOver(true);
            return words;
          }}
        />
      )}
    </>
  );
}
export default App;
