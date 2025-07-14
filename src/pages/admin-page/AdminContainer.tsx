import React from 'react';
import './AdminContainer.scss';

export const AdminContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="admin__container">
      {children}
    </div>
  );
};