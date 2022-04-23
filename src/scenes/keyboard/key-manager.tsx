import { useEffect, useRef, useState } from 'react';

type Props = {
  onKeyPressed: Function,
  onKeysChanged: Function,
  keysToWatch: string[]
}

export function KeyManager({ onKeyPressed, onKeysChanged, keysToWatch }: Props) {
  const keys = usePressObserver(keysToWatch);
  const prevKeys = usePreviousKeys(keys);

  useEffect(() => {
    keys.forEach(k => {
      if(prevKeys && !prevKeys.includes(k)){
        onKeyPressed(k);
      }
    });

    if(keys !== prevKeys){
      onKeysChanged && onKeysChanged(keys);
    }
  }, [ keys, prevKeys, onKeyPressed, onKeysChanged ]);

  return null;
}


// HOOKS
export function usePressObserver(watchKeys: string[]): string[] {
  const [curKeys, setCurKeys] = useState<string[]>([]);

  useEffect(() => {
    function handlePressStart({ key }: KeyboardEvent): void {
      if(watchKeys.includes(key) && !curKeys.includes(key)){
        setCurKeys([...curKeys, key]);
      }
    }

    function handlePressFinish({ key }: KeyboardEvent): void {
      if(watchKeys.includes(key)){
        setCurKeys(curKeys.filter(k => k !== key));
      }
    }

    document.addEventListener('keydown', handlePressStart);
    document.addEventListener('keyup', handlePressFinish);

    return () => {
      document.removeEventListener('keydown', handlePressStart);
      document.removeEventListener('keyup', handlePressFinish);
    };
  }, [watchKeys, curKeys]);

  return curKeys;
}

type RefForKeys = {
  current: string[]
}
export function usePreviousKeys(keys: string[]): string[] {
  const ref = useRef() as RefForKeys;

  useEffect(() => {
    ref.current = keys;
  }, [ keys ]);
  return ref.current;
}