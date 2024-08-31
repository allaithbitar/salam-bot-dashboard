import { useReducer } from "preact/hooks";

const useReducerState = (initialState) => {
  const [state, onChange] = useReducer(
    (curr, update) => ({
      ...curr,
      ...(typeof update === "function" ? update(curr) : update),
    }),
    typeof initialState !== "function" ? initialState : undefined,
    typeof initialState === "function" ? initialState : undefined,
  );
  return [state, onChange];
};

export default useReducerState;
