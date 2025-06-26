import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../pages/authorization/hook/useAuth';
import GuestLayout from '../pages/guest/GuestLayout';
import AdminLayout from '../pages/admin/AdminLayout';
import LoginPage from '../pages/authorization/LoginPage';
import HomePage from '../pages/guest/HomePage';
import HallPage from '../pages/admin/halls/HallsPage';
import PaymentPage from '../pages/guest/PaymentPage';
import TicketPage from '../pages/guest/TicketPage';
import HallsPage from '../pages/admin/halls/HallsPage';
import AdminMoviesPage from '../pages/admin/movies/MoviesPage';
import HallPricesPage from '../pages/admin/halls/HallPricesPage';
import TimeTablePage from '../pages/admin/timetable/TimeTablePage';

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path='/login' element={<LoginPage />} />

      {/* Guest routes */}
      <Route path='/' element={<GuestLayout />}>
        <Route index element={<HomePage />} />
        <Route path='hall/:seanceId' element={<HallPage />} />
        <Route path='payment' element={<PaymentPage />} />
        <Route path='ticket' element={<TicketPage />} />
      </Route>

      {/* Admin routes */}
      {isAuthenticated && isAdmin && (
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Navigate to='halls' replace />} />
          <Route path='halls' element={<HallsPage />} />
          <Route path='movies' element={<AdminMoviesPage />} />
          <Route path='prices' element={<HallPricesPage />} />
          <Route path='schedule' element={<TimeTablePage />} />
        </Route>
      )}

      {/* Fallback */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default AppRoutes;
