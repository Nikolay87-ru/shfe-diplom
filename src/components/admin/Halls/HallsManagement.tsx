import { useState, useEffect } from 'react';
import { Tab, Tabs, Button } from 'react-bootstrap';
import { HallConfig } from './HallConfig';
import { HallPrices } from './HallPrices';
import { HallOpen } from './HallOpen';
import { AddHallPopup } from './AddHallPopup';
import { api } from '@/utils/api';
import { Hall } from '@/types';

export const HallsManagement = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    const fetchHalls = async () => {
      const data = await api.getAllData();
      setHalls(data.halls);
      setSelectedHall(data.halls[0] || null);
    };
    fetchHalls();
  }, []);

  const handleAddHall = async (name: string) => {
    const formData = new FormData();
    formData.set('hallName', name);
    setShowAddPopup(false);
  };

  return (
    <div className="admin-halls">
      <div className="halls-list">
        <h3>Доступные залы</h3>
        <ul>
          {halls.map(hall => (
            <li 
              key={hall.id}
              className={selectedHall?.id === hall.id ? 'active' : ''}
              onClick={() => setSelectedHall(hall)}
            >
              {hall.hall_name}
              <button className="btn-remove">×</button>
            </li>
          ))}
        </ul>
        <Button onClick={() => setShowAddPopup(true)}>Создать зал</Button>
      </div>

      {selectedHall && (
        <Tabs defaultActiveKey="config" className="mt-3">
          <Tab eventKey="config" title="Конфигурация зала">
            <HallConfig hall={selectedHall} />
          </Tab>
          <Tab eventKey="prices" title="Конфигурация цен">
            <HallPrices hall={selectedHall} />
          </Tab>
          <Tab eventKey="open" title="Открыть продажи">
            <HallOpen hall={selectedHall} />
          </Tab>
        </Tabs>
      )}

      <AddHallPopup 
        show={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        onSave={handleAddHall}
      />
    </div>
  );
};