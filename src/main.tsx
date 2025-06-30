import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../src/css/admin.css';
import '../src/css/guest.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(<App />);
