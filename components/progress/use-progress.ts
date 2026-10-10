'use client';
import { useCallback, useSyncExternalStore } from 'react';
import { EMPTY, STORAGE_KEY, parseImport, serialize, type ProgressData } from '@/lib/progress';

// One shared copy of the visitor's progress, kept in localStorage and synced across tabs.
let current: ProgressData | null = null;
let storageWorks = true;
const listeners = new Set<() => void>();

function read(): ProgressData {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (!text) return EMPTY;
    const parsed = parseImport(text);
    return parsed.ok ? parsed.data : EMPTY;
  } catch {
    storageWorks = false; // private mode / blocked storage: keep it in memory for this visit
    return EMPTY;
  }
}

function getSnapshot(): ProgressData {
  if (current === null) current = read();
  return current;
}

const getServerSnapshot = () => EMPTY;

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      current = read();
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function write(next: ProgressData) {
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, serialize(next));
  } catch {
    storageWorks = false;
  }
  listeners.forEach((l) => l());
}

/** The visitor's progress plus an `update` function that takes a pure function from lib/progress.ts. */
export function useProgress() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const update = useCallback((fn: (d: ProgressData) => ProgressData) => write(fn(getSnapshot())), []);
  const replace = useCallback((d: ProgressData) => write(d), []);
  return { data, update, replace, hydrated, storageWorks };
}
