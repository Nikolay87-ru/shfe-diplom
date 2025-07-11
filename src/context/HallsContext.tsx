import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Hall } from '../types/index';

interface HallsContextType {
  halls: Hall[];
  loading: boolean;
  selectedHall: Hall | null;
  setSelectedHall: (hall: Hall) => void;
  addHall: (name: string) => Promise<void>;
  updateHallConfig: (hallId: number, config: any) => Promise<void>;
}

const HallsContext = createContext<HallsContextType | undefined>(undefined);

export const HallsProvider = ({ children }: { children: ReactNode }) => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        setLoading(true);
        const data = await api.getAllData();
        setHalls(data.result.halls);
        setSelectedHall(data.result.halls[0] || null);
      } catch (error) {
        console.error('Error fetching halls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, []);

  const addHall = async (name: string) => {
    try {
      const response = await api.addHall(name);
      if (response.success) {
        setHalls(prev => [...prev, response.result.halls]);
      }
    } catch (error) {
      console.error('Error adding hall:', error);
      throw error;
    }
  };

  const updateHallConfig = async (hallId: number, config: any) => {
    try {
      const response = await api.updateHallConfig(hallId, config);
      if (response.success) {
        setHalls(prev => 
          prev.map(hall => 
            hall.id === hallId ? { ...hall, ...response.result.halls } : hall
          )
        );
      }
    } catch (error) {
      console.error('Error updating hall config:', error);
      throw error;
    }
  };

  return (
    <HallsContext.Provider 
      value={{ 
        halls, 
        loading, 
        selectedHall, 
        setSelectedHall, 
        addHall, 
        updateHallConfig 
      }}
    >
      {children}
    </HallsContext.Provider>
  );
};

export const useHalls = () => {
  const context = useContext(HallsContext);
  if (!context) {
    throw new Error('useHalls must be used within a HallsProvider');
  }
  return context;
};