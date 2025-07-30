import { useContext } from 'react';
import { HallsContext } from '../HallsContext';
import { Ctx } from '../HallsContext';

export const useHalls = (): Ctx => {
  const context = useContext(HallsContext);
  if (!context) throw new Error('useHalls must be used within a HallsProvider');
  return context;
};