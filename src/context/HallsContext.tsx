import { Film, Hall, Seance } from '@/types';
import { createContext } from 'react';

export type Ctx = {
  allData: {
    films: Film[];
    halls: Hall[];
    seances: Seance[];
  };
  selectedHallId: number | undefined; 
  setSelectedHallId: (id: number | undefined) => void; 
  update: () => Promise<void>;
  updateLocalData: <T extends Film[] | Hall[] | Seance[]>(
    type: 'films' | 'halls' | 'seances', 
    newData: T
  ) => Promise<void>;
  updateSeances: (newSeances: Seance[]) => Promise<void>; 
  subscribe: (callback: () => void) => () => void;
  isLoading: boolean;
};

export const HallsContext = createContext<Ctx | undefined>(undefined);
