import { useState, useEffect } from 'react';
import { fetchHalls, createHall, deleteHall } from '../../../api/hallService';
import AdminSection from '../../../components/ui/AdminSection';
import HallConfig from './HallConfig';
import HallPricesPage from './HallPricesPage';
import { type Hall } from '../../../types/hall';

const HallsPage = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHallName, setNewHallName] = useState('');

  useEffect(() => {
    const loadHalls = async () => {
      try {
        const data = await fetchHalls();
        setHalls(data.result.halls);
        if (data.result.halls.length > 0) {
          setSelectedHall(data.result.halls[0]);
        }
      } catch (error) {
        console.error('Error loading halls:', error);
      }
    };

    loadHalls();
  }, []);

  const handleAddHall = async () => {
    if (!newHallName.trim()) return;
    
    try {
      const formData = new FormData();
      formData.set('hallName', newHallName);
      
      const data = await createHall(formData);
      setHalls(data.result.halls);
      setNewHallName('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding hall:', error);
    }
  };

  const handleDeleteHall = async (id: number) => {
    try {
      const data = await deleteHall(id);
      setHalls(data.result.halls);
      if (selectedHall?.id === id) {
        setSelectedHall(data.result.halls[0] || null);
      }
    } catch (error) {
      console.error('Error deleting hall:', error);
    }
  };

  return (
    <>
      <AdminSection title="Управление залами" defaultOpen>
        <div className="admin__wrapper">
          <p className="admin__info halls__info">Доступные залы:</p>
          
          <ul className="halls__list">
            {halls.map(hall => (
              <li key={hall.id} className="halls__list_item">
                <span 
                  className={`halls__list_name ${selectedHall?.id === hall.id ? 'hall_item-selected' : ''}`}
                  onClick={() => setSelectedHall(hall)}
                >
                  {hall.hall_name}
                </span>
                <span 
                  className="admin__button_remove hall_remove"
                  onClick={() => handleDeleteHall(hall.id)}
                ></span>
              </li>
            ))}
          </ul>
          
          {showAddForm ? (
            <div className="add-hall-form">
              <input
                type="text"
                className="admin_input"
                value={newHallName}
                onChange={(e) => setNewHallName(e.target.value)}
                placeholder="Название зала"
              />
              <button 
                className="button"
                onClick={handleAddHall}
              >
                Добавить
              </button>
              <button 
                className="button"
                onClick={() => setShowAddForm(false)}
              >
                Отмена
              </button>
            </div>
          ) : (
            <button 
              className="admin__button_hall button"
              onClick={() => setShowAddForm(true)}
            >
              Создать зал
            </button>
          )}
        </div>
      </AdminSection>

      {selectedHall && (
        <>
          <HallConfig hall={selectedHall} />
          <HallPricesPage hall={selectedHall} />
        </>
      )}
    </>
  );
};

export default HallsPage;