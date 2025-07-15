import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Login.scss';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Неверный логин/пароль!');
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
    }
  };

  return (
    <div className="admin__container">
      <header className="header login__header">
        <h1 className="header__logo">
          Идём<span className="header__logo_letter">в</span>кино
        </h1>
        <p className="header__subtitle">Администраторская</p>
      </header>

      <main className="login__main">
        <div className="login__main_header">
          <h2 className="login__main_header-text">Авторизация</h2>
        </div>

        <form className="login__form" onSubmit={handleSubmit}>
          <label className="login__label">
            <span className="label__text">E-mail</span>
            <input
              type="email"
              name="login"
              className="login__input login__email"
              placeholder="example@domain.xyz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="login__label">
            <span className="label__text">Пароль</span>
            <input
              type="password"
              name="password"
              className="login__input login__password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login__button button">
            Авторизоваться
          </button>
        </form>
      </main>
    </div>
  );
};
