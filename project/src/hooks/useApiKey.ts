import { useState, useEffect, useCallback } from 'react';

const API_KEY_STORAGE = 'tmdb_api_key';
const PIN_STORAGE = 'tmdb_owner_pin';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [ownerPin, setOwnerPinState] = useState<string>('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem(API_KEY_STORAGE);
      if (storedKey) setApiKeyState(storedKey);
      const storedPin = localStorage.getItem(PIN_STORAGE);
      if (storedPin) setOwnerPinState(storedPin);
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    try {
      if (key) localStorage.setItem(API_KEY_STORAGE, key);
      else localStorage.removeItem(API_KEY_STORAGE);
    } catch {
      // ignore
    }
  }, []);

  const setOwnerPin = useCallback((pin: string) => {
    setOwnerPinState(pin);
    try {
      if (pin) localStorage.setItem(PIN_STORAGE, pin);
      else localStorage.removeItem(PIN_STORAGE);
    } catch {
      // ignore
    }
  }, []);

  return { apiKey, setApiKey, hasKey: !!apiKey, ownerPin, setOwnerPin, hasPin: !!ownerPin, loaded };
}
