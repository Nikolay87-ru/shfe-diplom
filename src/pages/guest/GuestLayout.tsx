import { Outlet, Link } from 'react-router-dom';

const GuestLayout = () => (
  <div className="container" style={{minHeight: '100vh'}}>
    <header className="header">
      <Link to="/" className="header__logo_link">
        <span className="header__logo">Идём<span className="header__logo_letter">в</span>кино</span>
      </Link>
      <Link to="/login" className="button header__button">
        Войти
      </Link>
    </header>
    <main className="main">
      <Outlet />
    </main>
  </div>
);

export default GuestLayout;
