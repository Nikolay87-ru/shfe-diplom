import { useEffect, useState, useCallback } from 'react';
import { api } from '@/utils/api';
import { HallsContext } from '../HallsContext';
import { Film, Hall, Seance } from '@/types';

export const HallsProvider = ({ children }: { children: React.ReactNode }) => {
  const [allData, setAllData] = useState<{
    films: Film[];
    halls: Hall[];
    seances: Seance[];
  }>({ films: [], halls: [], seances: [] });
  const [selectedHallId, setSelectedHallId] = useState<number | undefined>();
  const [subscribers, setSubscribers] = useState<(() => void)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const update = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.getAllData();
      if (res.result) {
        setAllData({
          films: res.result.films || [],
          halls: res.result.halls || [],
          seances: res.result.seances || [],
        });
        
        setSelectedHallId(prevId => {
          const hallExists = res.result?.halls?.some(h => h.id === prevId);
          return hallExists ? prevId : res.result?.halls?.[0]?.id;
        });
        
        subscribers.forEach(cb => cb());
      }
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [subscribers]);

  const updateLocalData = useCallback(
    <T extends Film[] | Hall[] | Seance[]>(type: "films" | "halls" | "seances", newData: T) => {
      setAllData(prev => ({
        ...prev,
        [type]: newData
      }));
    }, 
    []
  );

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
    <HallsContext.Provider value={{ 
      allData, 
      selectedHallId, 
      setSelectedHallId, 
      update, 
      updateLocalData,
      subscribe,
      isLoading
    }}>
      {children}
    </HallsContext.Provider>
  );
};
