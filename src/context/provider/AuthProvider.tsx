import React, { useState } from 'react';
import { AuthContext } from '../AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem('isAdmin'));

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('login', email);
      formData.append('password', password);

      const response = await fetch('https://shfe-diplom.neto-server.ru/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', '1');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return <AuthContext.Provider value={{ isAdmin, login, logout }}>{children}</AuthContext.Provider>;
};