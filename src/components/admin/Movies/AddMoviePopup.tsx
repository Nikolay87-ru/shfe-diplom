import { useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { api } from '../../../utils/api';

interface AddMoviePopupProps {
  show: boolean;
  onClose: () => void;
  onSave: (movieData: {
    name: string;
    duration: number;
    description: string;
    country: string;
    poster: File;
  }) => void;
}

export const AddMoviePopup = ({ show, onClose, onSave }: AddMoviePopupProps) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(0);
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 3 * 1024 * 1024) {
        alert('Размер файла должен быть не более 3 MB');
        return;
      }
      
      setPoster(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !duration || !description || !country || !poster) {
      alert('Заполните все поля');
      return;
    }
    
    if (poster) {
      onSave({
        name,
        duration,
        description,
        country,
        poster
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDuration(0);
    setDescription('');
    setCountry('');
    setPoster(null);
    setPosterPreview('');
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавление фильма</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Название фильма</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, «Гражданин Кейн»"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Продолжительность (мин)</Form.Label>
            <Form.Control
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              min="1"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Страна</Form.Label>
            <Form.Control
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Постер</Form.Label>
            <div className="d-flex align-items-center">
              {posterPreview && (
                <img 
                  src={posterPreview} 
                  alt="Preview" 
                  className="img-thumbnail me-3" 
                  style={{ width: '50px', height: '70px' }}
                />
              )}
              <Button 
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                {poster ? 'Изменить' : 'Загрузить постер'}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <Form.Text className="text-muted">
              Максимальный размер файла: 3MB
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={resetForm}>
          Отменить
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Добавить фильм
        </Button>
      </Modal.Footer>
    </Modal>
  );
};