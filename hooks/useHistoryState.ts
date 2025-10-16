import { useState, useCallback, useRef } from 'react';

// A custom hook to manage state with undo/redo capabilities.
export const useHistoryState = <T>(initialState: T) => {
  const [state, setState] = useState({
    history: [initialState],
    pointer: 0,
  });

  // Using a ref to hold the current state for comparison in callbacks
  // to prevent issues with stale closures.
  const currentStateRef = useRef(initialState);
  currentStateRef.current = state.history[state.pointer];

  const setCurrentState = useCallback((newState: T | ((prevState: T) => T)) => {
    const resolvedState =
      typeof newState === 'function'
        ? (newState as (prevState: T) => T)(currentStateRef.current)
        : newState;

    // Do not add a new entry if the state has not changed.
    if (JSON.stringify(resolvedState) === JSON.stringify(currentStateRef.current)) {
      return;
    }

    const newHistory = state.history.slice(0, state.pointer + 1);
    newHistory.push(resolvedState);

    setState({
      history: newHistory,
      pointer: newHistory.length - 1,
    });
  }, [state.history, state.pointer]);

  const undo = useCallback(() => {
    if (state.pointer > 0) {
      setState(s => ({ ...s, pointer: s.pointer - 1 }));
    }
  }, [state.pointer]);

  const redo = useCallback(() => {
    if (state.pointer < state.history.length - 1) {
      setState(s => ({ ...s, pointer: s.pointer + 1 }));
    }
  }, [state.pointer, state.history.length]);

  return {
    state: state.history[state.pointer],
    setState: setCurrentState,
    undo,
    redo,
    canUndo: state.pointer > 0,
    canRedo: state.pointer < state.history.length - 1,
  };
};
