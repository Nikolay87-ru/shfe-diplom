import { Modal, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { api } from '../../../utils/api';

interface AddHallPopupProps {
  show: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const AddHallPopup = ({ show, onClose, onSave }: AddHallPopupProps) => {
  const [hallName, setHallName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hallName.trim()) {
      setError('Введите название зала');
      return;
    }

    try {
      await api.addHall(hallName);
      onSave(hallName);
      setHallName('');
      setError('');
      onClose();
    } catch (err) {
      setError('Ошибка при создании зала');
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Добавление зала</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Название зала</Form.Label>
            <Form.Control
              type="text"
              placeholder="Например, «Зал 1»"
              value={hallName}
              onChange={(e) => setHallName(e.target.value)}
              required
            />
            {error && <div className="text-danger mt-2">{error}</div>}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Отменить
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Добавить зал
        </Button>
      </Modal.Footer>
    </Modal>
  );
};