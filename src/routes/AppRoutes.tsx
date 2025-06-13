import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../pages/authorization/AuthContext';
import ClientLayout from '../layouts/GuestLayout';
import AdminLayout from '../layouts/AdminLayout';
import LoginPage from '../pages/authorization/LoginPage';
import HomePage from '../pages/guest/HomePage';
import HallPage from '../pages/admin/halls/HallsPage';
import PaymentPage from '../pages/guest/PaymentPage';
import TicketPage from '../pages/guest/TicketPage';
import AdminHallsPage from '../pages/admin/halls/HallsPage';
import AdminMoviesPage from '../pages/admin/movies/MoviesPage';
import AdminPricesPage from '../pages/admin/prices/PricesPage';
import AdminSchedulePage from '../pages/admin/schedule/SchedulePage';

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path='/login' element={<LoginPage />} />

      {/* Guest routes */}
      <Route path='/' element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path='hall/:seanceId' element={<HallPage />} />
        <Route path='payment' element={<PaymentPage />} />
        <Route path='ticket' element={<TicketPage />} />
      </Route>

      {/* Admin routes */}
      {isAuthenticated && isAdmin && (
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Navigate to='halls' replace />} />
          <Route path='halls' element={<AdminHallsPage />} />
          <Route path='movies' element={<AdminMoviesPage />} />
          <Route path='prices' element={<AdminPricesPage />} />
          <Route path='schedule' element={<AdminSchedulePage />} />
        </Route>
      )}

      {/* Fallback */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default AppRoutes;
