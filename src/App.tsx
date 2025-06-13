import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '../src/routes/AppRoutes';
import { AuthProvider } from './pages/authorization/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position='bottom-right' />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
