import { useEffect, useState, useCallback } from 'react';
import { api } from '../../utils/api';
import { Hall } from '../../types';
import { HallsContext } from '../HallsContext'

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
      subscribers.forEach(cb => cb());
    }
  }, [selectedHallId, subscribers]);

  const subscribe = useCallback((callback: () => void) => {
    setSubscribers(subs => [...subs, callback]);
    return () => {
      setSubscribers(subs => subs.filter(cb => cb !== callback));
    };
  }, []);

  useEffect(() => {
    update();
  }, [update]);

  return (
    <HallsContext.Provider value={{ halls, selectedHallId, setSelectedHallId, update, subscribe }}>
      {children}
    </HallsContext.Provider>
  );
};