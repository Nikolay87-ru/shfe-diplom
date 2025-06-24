import { Outlet } from 'react-router-dom';
import { useAuth } from '../../pages/authorization/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminLayout = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin__container">
      <header className="header header__admin">
        <h1 className="header__logo">Идём<span className="header__logo_letter">в</span>кино</h1>
        <p className="header__subtitle">Администраторррская</p>
      </header>
      
      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;