import { createContext } from 'react';
import { Hall } from '@/types';

export type Ctx = {
  halls: Hall[];
  selectedHallId: number | undefined;
  setSelectedHallId: (id: number) => void;
  update: () => Promise<void>;
  subscribe: (callback: () => void) => () => void;
};

export const HallsContext = createContext<Ctx | undefined>(undefined);
