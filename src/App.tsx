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
import handleTheme from './utils/theme';

function App() {
  const [openSidebar, setOpenSidebar] = createSignal(false);
  const [showLoading, setShowLoading] = createSignal(false);
  const [showTips, setShowTips] = createSignal(persistentStore.showTips);
  const [renderHints, setRenderHints] = createSignal(false);
  const [showHints, setShowHints] = createSignal(false);
  const [showGameOver, setShowGameOver] = createSignal(false);

  const [isCurrentWordWrong, setCurrentWordWrong] = createAutoToggle(1000);

  let firstRun = true,
    today = GameEngine.getCurrentDay(),
    engine: GameEngine;
  createEffect(async () => {
    if (globalStore.gameState === GameState.Starting || (firstRun && !showTips())) {
      setShowLoading(true);
      firstRun = false;
      engine = new GameEngine(globalStore.gameMode, setGlobalStore);
      await engine.buildWordGraph(persistentStore.wordListType);
      engine.setRandomSeed(globalStore.seed);
      let offset = globalStore.offset;
      while (true) {
        try {
          engine.initWithWordIdx((((today + offset) % engine.numberOfWords) * WORD_PRIME) % engine.numberOfWords);
          break;
        } catch (e) {
          ++offset;
        }
      }
      engine.updateStore();
      setGlobalStore({ gameState: GameState.Playing });
      setPersistentStore(store => ({
        ...store,
        playTime: {
          ...store.playTime,
          [persistentStore.wordListType]: { ...store.playTime[store.wordListType], [globalStore.gameMode]: today },
        },
      }));
      setRenderHints(false);
      setShowLoading(false);
      (document.activeElement as HTMLElement | null)?.blur();
      window.focus();
    }
  });
  onMount(() => {
    handleTheme(persistentStore.isLightTheme);
    document.body.addEventListener('keydown', handleBodyKeyDown);
  });
  onCleanup(() => {
    document.body.removeEventListener('keydown', handleBodyKeyDown);
  });

  function handleKeyPress(key: Key | 'HINT') {
    if (globalStore.gameState !== GameState.Playing || engine.isCurrentWordFinal()) return;
    if (key === 'HINT') {
      setRenderHints(true);
      setShowHints(true);
      return;
    }
    if (key === 'ENTER' && !engine.isCurrentWordValid()) {
      setCurrentWordWrong();
    }

    engine.handleKey(key);
    engine.updateStore();
    if (engine.isCurrentWordFinal()) {
      window.setTimeout(() => {
        setGlobalStore({ gameState: GameState.Won });
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
        isLightTheme={persistentStore.isLightTheme}
        onToggleTheme={() => {
          const newTheme = !persistentStore.isLightTheme;
          handleTheme(newTheme);
          setPersistentStore({ isLightTheme: newTheme });
        }}
        open={openSidebar()}
        handleToggle={setOpenSidebar}
        title={
          <div
            class={'text-3xl font-black uppercase'}
            classList={{
              'text-success': globalStore.gameMode === GameMode.Easy,
              'text-error': globalStore.gameMode === GameMode.Hard,
            }}
          >
            Antonemo
          </div>
        }
        sidebar={<Sidebar handleClose={() => setOpenSidebar(false)} />}
        footer={
          <Footer
            handleTips={() => {
              setShowTips(true);
              setOpenSidebar(false);
            }}
          />
        }
      >
        {globalStore.gameState === GameState.Playing && (
          <div class='flex h-full w-full max-w-lg flex-col gap-2 self-center p-2'>
            <div class='flex items-center justify-between'>
              {globalStore.finalWord ? (
                <span class='flex h-12 items-center px-4 text-xl font-bold uppercase' title='Final word'>
                  {globalStore.finalWord}
                </span>
              ) : (
                <button class='btn' onClick={() => setGlobalStore({ finalWord: engine.finalWord })}>
                  Show final word
                </button>
              )}
              {globalStore.seenSolution || `Steps: ${globalStore.steps}`}
            </div>
            <WordList
              words={globalStore.words}
              currentWord={globalStore.currentWord}
              isCurrentWordValid={globalStore.isCurrentWordValid}
              currentWordHasAntonym={globalStore.currentWordHasAntonym}
              isCurrentWordWrong={isCurrentWordWrong()}
              isCurrentWordFinal={globalStore.isCurrentWordFinal}
              handleClick={() => handleKeyPress('ENTER')}
            />
            <Keyboard
              activeLetters={globalStore.activeLetters}
              correctLetters={globalStore.correctLetters}
              handleKeyPress={handleKeyPress}
            />
          </div>
        )}
      </Shell>

      {showLoading() && <ToastAlert status='info'>Loading game...</ToastAlert>}
      {isCurrentWordWrong() && <ToastAlert status='warning'>Wrong word!</ToastAlert>}

      <Tips open={showTips()} handleClose={() => setShowTips(false)} />
      <GameOver
        open={showGameOver() && !showHints()}
        today={today}
        handleNewGame={() => setShowGameOver(false)}
        handleCustomGame={() => {
          setShowGameOver(false);
          setOpenSidebar(true);
        }}
      />
      {renderHints() && (
        <Hints
          open={showHints()}
          handleClose={() => setShowHints(false)}
          getWords={() => {
            const words = engine.getValidWords();
            engine.updateStore();
            return words;
          }}
          getWordsWithAntonyms={() => {
            const words = engine.getValidWords(true);
            engine.updateStore();
            return words;
          }}
          getSolution={() => {
            const words = engine.getSolution();
            engine.updateStore();
            setShowGameOver(true);
            return words;
          }}
        />
      )}
    </>
  );
}
export default App;
