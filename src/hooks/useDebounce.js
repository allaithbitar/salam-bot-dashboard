import { useEffect, useState } from "preact/hooks";

export const useDebounce = (value = null, delay = 300) => {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, value]);
  return delayedValue;
};
