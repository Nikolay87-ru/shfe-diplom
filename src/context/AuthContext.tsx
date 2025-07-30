import { createContext } from 'react';

interface AuthContextValue {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);



