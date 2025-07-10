import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GuestPage } from './pages/guest-page/GuestPage';
import { HallPage } from './pages/guest-page/HallPage';
import { PaymentPage } from './pages/PaymentPage';
import { TicketPage } from './pages/TicketPage';
// import { AdminPanel } from './pages/AdminPanel';
import { Login } from './components/admin/Login/Login';
import { AuthProvider } from './context/AuthContext';
import { GuestProvider } from './context/GuestContext';

function App() {
  return (
    <AuthProvider>
      <GuestProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GuestPage />} />
            <Route path="/hall/:id" element={<HallPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/ticket/:id" element={<TicketPage />} />
            <Route path="/admin/login" element={<Login />} />
            {/* <Route path="/admin/*" element={<AdminPanel />} /> */}
          </Routes>
        </BrowserRouter>
      </GuestProvider>
    </AuthProvider>
  );
}

export default App;
