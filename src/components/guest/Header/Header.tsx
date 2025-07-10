import './Header.scss';

export const Header = () => {
  return (
    <header className="guest-header">
      <div className="container">
        <a href="/" className="logo">
          Идём<span className="logo-letter">в</span>кино
        </a>
        <button className="login-button">Войти</button>
      </div>
    </header>
  );
};