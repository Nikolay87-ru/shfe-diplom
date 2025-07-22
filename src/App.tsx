import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GuestPage } from './pages/guest-page/GuestPage';
import { HallPage } from './pages/guest-page/HallPage';
import { TicketPage } from './pages/guest-page/TicketPage';
import { AdminPanel } from './pages/admin-page/AdminPanel';
import { Login } from './components/admin/Login/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GuestProvider } from './context/GuestContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { JSX } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <GuestProvider>
        <BrowserRouter>
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
      </GuestProvider>
    </AuthProvider>
  );
}

export default App;