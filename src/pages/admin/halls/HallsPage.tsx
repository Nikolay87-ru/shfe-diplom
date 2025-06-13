import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { fetchHalls, createHall, updateHall, deleteHall } from '../../../api/hallService';
import { type Hall } from '../../../types/hall';
import HallForm from '../../../components/admin/HallForm';

const HallsPage = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    try {
      const data = await fetchHalls();
      setHalls(data.result.halls);
    } catch (error) {
      console.error('Error loading halls:', error);
    }
  };

  const handleSave = async (hallData: Omit<Hall, 'id'>) => {
    try {
      if (editingHall) {
        await updateHall(editingHall.id, hallData);
      } else {
        await createHall(hallData);
      }
      loadHalls();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving hall:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteHall(id);
      loadHalls();
    } catch (error) {
      console.error('Error deleting hall:', error);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Управление залами</h2>
        <Button variant="primary" onClick={() => {
          setEditingHall(null);
          setShowModal(true);
        }}>
          Добавить зал
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Название</th>
            <th>Рядов</th>
            <th>Мест</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {halls.map(hall => (
            <tr key={hall.id}>
              <td>{hall.hall_name}</td>
              <td>{hall.hall_rows}</td>
              <td>{hall.hall_places}</td>
              <td>{hall.hall_open ? 'Открыт' : 'Закрыт'}</td>
              <td>
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="me-2"
                  onClick={() => {
                    setEditingHall(hall);
                    setShowModal(true);
                  }}
                >
                  Редактировать
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(hall.id)}
                >
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingHall ? 'Редактирование зала' : 'Добавление зала'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HallForm 
            initialData={editingHall} 
            onSubmit={handleSave} 
            onCancel={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HallsPage;