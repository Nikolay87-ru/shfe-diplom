import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError("Неверный пароль");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container" style={{ maxWidth: 400, marginTop: 100 }}>
      <h3>Вход в админ-панель</h3>
      <input className="form-control mb-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" />
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary">Войти</button>
    </form>
  );
};