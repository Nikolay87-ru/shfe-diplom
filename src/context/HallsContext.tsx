import { createContext } from 'react';
import { Film, Hall, Seance } from '@/types';

export type Ctx = {
  allData: {
    films: Film[];
    halls: Hall[];
    seances: Seance[];
  };
  selectedHallId: number | undefined;
  setSelectedHallId: (id: number) => void;
  update: () => Promise<void>;
  updateLocalData: <T extends Film[] | Hall[] | Seance[]>(
    type: 'films' | 'halls' | 'seances', 
    newData: T
  ) => void;
  subscribe: (callback: () => void) => () => void;
  isLoading: boolean;
};

export const HallsContext = createContext<Ctx | undefined>(undefined);
