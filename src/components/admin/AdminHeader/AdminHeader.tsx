import { Link } from 'react-router-dom';
import './AdminHeader.scss';

export const AdminHeader = () => {
  return (
    <header className="admin-header">
      <Link to="/" className="header__logo">
        Идём<span className="header__logo_letter">в</span>кино
      </Link>
      <p className="header__subtitle">Администраторская</p>
    </header>
  );
};
