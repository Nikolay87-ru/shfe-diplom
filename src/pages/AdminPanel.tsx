import { Tab, Tabs } from 'react-bootstrap';
import { HallsManagement } from '../components/admin/Halls/HallsManagement';
import { MoviesManagement } from '../components/admin/Movies/MoviesManagement';
import { SeancesManagement } from '../components/admin/Seances/SeancesManagement';

export const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <Tabs defaultActiveKey="halls">
        <Tab eventKey="halls" title="Управление залами">
          <HallsManagement />
        </Tab>
        <Tab eventKey="movies" title="Фильмы">
          <MoviesManagement />
        </Tab>
        <Tab eventKey="seances" title="Сеансы">
          <SeancesManagement />
        </Tab>
      </Tabs>
    </div>
  );
};