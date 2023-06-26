import { useState, useEffect } from 'react';

export type DebouncedFunction = (value: string) => void;

export type DebounceHookParams = {
  initialValue: string;
  debounced: DebouncedFunction;
  delay?: number;
};

export type DebounceHookReturn = [
  value: string,
  onChange: (value: string) => void
];

export function useDebounce({
  initialValue,
  debounced,
  delay = 500,
}: DebounceHookParams): DebounceHookReturn {
  const [value, setValue] = useState(initialValue);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const onChange = (value: string): void => setValue(value);

  useEffect(() => {
    if (timer) clearTimeout(timer);

    const current = setTimeout(() => {
      debounced(value);
      setTimer(current);
    }, delay);

    return () => {
      if (current) {
        clearTimeout(current);
      }
    };
  }, [delay, debounced, value, timer]);

  return [value, onChange];
}

export default useDebounce;
