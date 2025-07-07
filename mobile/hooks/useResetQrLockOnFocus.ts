import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export default function useResetQrLockOnFocus(qrLock: React.MutableRefObject<boolean>) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        qrLock.current = false;
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, []);
}
