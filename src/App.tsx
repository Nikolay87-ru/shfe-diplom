import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { JSX } from 'react';
import { GuestPage } from '@/pages/guest-page/GuestPage';
import { HallPage } from '@/pages/guest-page/HallSchemePage/HallPage';
import { TicketPage } from '@/pages/guest-page/TicketPage/TicketPage';
import { AdminPanel } from '@/pages/admin-page/AdminPanel';
import { Login } from '@/pages/admin-page/Login/LoginPage';
import { useAuth } from '@/context/hooks/useAuth';
import { AuthProvider } from '@/context/provider/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<GuestPage />} />
          <Route path="/hall/:id" element={<HallPage />} />
          <Route path="/ticket/:id" element={<TicketPage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
