import { useNavigate } from 'react-router-dom';
import './Header.scss';

export const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/admin/login');
  };

  return (
    <header className="guest-header">
      <div className="container">
        <a href="/" className="logo">
          Идём<span className="logo-letter">в</span>кино
        </a>
        <button className="login-button" onClick={handleLoginClick}>
          Войти
        </button>
      </div>
    </header>
  );
};
