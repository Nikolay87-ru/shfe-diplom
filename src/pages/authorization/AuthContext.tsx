import { useState, useEffect, type ReactNode } from 'react';
import apiClient from '../../api/apiClient';
import { AuthContext } from './auth-context.const'; 

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const authFlag = localStorage.getItem('isAuthenticated');
    if (authFlag === 'true') {
      setIsAuthenticated(true);
      setIsAdmin(true);
    }
  }, []);

  const login = async (login: string, password: string) => {
    const formData = new FormData();
    formData.append('login', login);
    formData.append('password', password);
    
    try {
      const response = await apiClient.post('/login', formData, { withCredentials: true });
      
      if (response.data.result?.includes('успешно')) {
        setIsAuthenticated(true);
        setIsAdmin(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        throw new Error('Ошибка авторизации');
      }
    } catch (error) {
      throw new Error('Ошибка при выполнении запроса авторизации');
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};