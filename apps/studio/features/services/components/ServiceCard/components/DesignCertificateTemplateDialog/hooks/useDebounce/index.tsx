import { useState, useEffect } from 'react';

export type DebouncedFunction = (value: string) => void;

export type DebounceHookParams = {
  initialValue: string;
  debounced: DebouncedFunction;
  delay?: number;
};

export type DebounceHookReturn = [
  value: string,
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
];

export function useDebounce({
  initialValue,
  debounced,
  delay = 500,
}: DebounceHookParams): DebounceHookReturn {
  const [value, setValue] = useState(initialValue);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const onChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => setValue(event.target.value);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    const newTimerId = setTimeout(() => {
      debounced(value);
      setTimer(newTimerId);
    }, delay);

    return () => {
      if (newTimerId) {
        clearTimeout(newTimerId);
      }
    };
  }, [delay, debounced, value, timer]);

  return [value, onChange];
}

export default useDebounce;
