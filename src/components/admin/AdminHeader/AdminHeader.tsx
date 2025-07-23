import React from 'react';
import './AdminHeader.scss';

export const AdminHeader = () => {
  return (
    <header className="admin-header">
      <h1 className="header__logo">
        Идём<span className="header__logo_letter">в</span>кино
      </h1>
      <p className="header__subtitle">Администраторская</p>
    </header>
  );
};
