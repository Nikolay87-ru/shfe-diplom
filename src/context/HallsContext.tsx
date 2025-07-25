import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../utils/api';
import { Hall } from '../types';

type Ctx = {
  halls: Hall[];
  selectedHallId: number | undefined;
  setSelectedHallId: (id: number) => void;
  update: () => Promise<void>;
  subscribe: (callback: () => void) => () => void;
};

const ctx = createContext<Ctx | undefined>(undefined);

export const HallsProvider = ({ children }: { children: React.ReactNode }) => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHallId, setSelectedHallId] = useState<number | undefined>();
  const [subscribers, setSubscribers] = useState<(() => void)[]>([]);

  const update = useCallback(async () => {
    const res = await api.getAllData();
    if (res.result?.halls) {
      setHalls(res.result.halls);
      if (!res.result.halls.some((h) => h.id === selectedHallId)) {
        setSelectedHallId(res.result.halls[0]?.id);
      }

      subscribers.forEach((cb) => cb());
    }
  }, [selectedHallId, subscribers]);

  const subscribe = useCallback((callback: () => void) => {
    setSubscribers((subs) => [...subs, callback]);
    return () => {
      setSubscribers((subs) => subs.filter((cb) => cb !== callback));
    };
  }, []);

  useEffect(() => {
    update();
  }, [update]);

  return (
    <ctx.Provider value={{ halls, selectedHallId, setSelectedHallId, update, subscribe }}>
      {children}
    </ctx.Provider>
  );
};

export const useHalls = () => {
  const c = useContext(ctx);
  if (!c) throw new Error();
  return c;
};
