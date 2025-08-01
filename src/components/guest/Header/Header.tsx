import { useNavigate } from 'react-router-dom';
import './Header.scss';

interface HeaderProps {
  showLoginButton?: boolean;
}

export const Header = ({ showLoginButton = true }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/admin/login');
  };

  return (
    <header className="guest-header">
      <div className="container">
        <a href={import.meta.env.BASE_URL} className="logo">
          Идём<span className="logo-letter">в</span>кино
        </a>
        {showLoginButton && (
          <button className="login-button" onClick={handleLoginClick}>
            Войти
          </button>
        )}
      </div>
    </header>
  );
};
