import { useState } from 'react';
import { useAuth } from './hook/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await auth.login(login, password);
      navigate('/admin/halls');
    } catch (e) {
      setError('Неправильный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin__container">
      <header className="header login__header">
        <h1 className="header__logo">Идём<span className="header__logo_letter">в</span>кино</h1>
        <p className="header__subtitle">Вход для администратора</p>
      </header>
      <main className="login__main">
        <div className="login__main_header">
          <div className="login__main_header-text">Вход</div>
        </div>
        <form className="login__form" onSubmit={handleSubmit}>
          <label className="login__label">
            <span className="label__text">Логин</span>
            <input
              className="login__input"
              type="email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </label>
          <label className="login__label">
            <span className="label__text">Пароль</span>
            <input
              className="login__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
          <button
            className="login__button button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;