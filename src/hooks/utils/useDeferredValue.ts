import { useEffect, useRef, useState } from 'react';

interface UseDeferredValue {
  <T>(value: T, delay?: number): T;
}

const useDeferredValue: UseDeferredValue = <T>(value: T, delay = 500) => {
  const [deferredValue, setDeferredValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setDeferredValue(value), delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return deferredValue;
};

export default useDeferredValue;
