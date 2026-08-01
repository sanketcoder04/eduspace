type Listener = (accessToken: string | null) => void;

let listeners: Listener[] = [];

export const authEvents = {
  subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  emit(accessToken: string | null) {
    listeners.forEach((listener) => listener(accessToken));
  },
};
