import { Outlet } from 'react-router-dom';
const GuestLayout = () => (
  <>
    <header>Гостевая страница</header>
    <main>
      <Outlet />
    </main>
  </>
);
export default GuestLayout;
