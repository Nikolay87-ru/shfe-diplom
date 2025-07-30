import React, { useState } from 'react';
import { HallsList } from './HallsList/HallsList';
import { useHalls } from '../../../../context/HallsContext';
import { api } from '../../../../utils/api';
import { AddHallPopup } from './HallPopup/AddHallPopup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HallsManagement.scss';

export const HallsManagement: React.FC = () => {
  const { halls, selectedHallId, setSelectedHallId, update } = useHalls();
  const [showAddPopup, setShowAddPopup] = useState(false);

  async function addHall(name: string) {
    await api.addHall(name);
    await update();
  }

  async function deleteHall(id: number) {
    const ConfirmToast = () => (
      <div>
        <p style={{ display: 'flex', justifyContent: 'center' }}>Удалить зал?</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={() => {
              toast.dismiss();
              confirmDeleteHall(id);
            }}
            style={{
              padding: '5px 10px',
              background: '#16a6af',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Удалить
          </button>
          <button 
            onClick={() => toast.dismiss()}
            style={{
              padding: '5px 10px',
              background: '#63536c',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    );

    toast(<ConfirmToast />, {
      position: 'top-center',
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      draggable: false,
      style: {
        width: '300px',
        justifyContent: 'center'
      }
    });
  }

  async function confirmDeleteHall(id: number) {
    try {
      await api.deleteHall(id);
      await update();
      toast.success('Зал успешно удалён', {
        position: 'top-center',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Ошибка при удалении зала:', error);
      toast.error('Не удалось удалить зал', {
        position: 'top-center',
        autoClose: 5000,
      });
    }
  }

  return (
    <section className="admin__section halls-management">
      <p className="admin__info halls__info">Доступные залы:</p>
      <HallsList
        halls={halls}
        selectedId={selectedHallId}
        onSelect={setSelectedHallId}
        onDelete={deleteHall}
        className="halls-management-list"
      />
      <button className="admin__button_hall button" onClick={() => setShowAddPopup(true)}>
        Создать зал
      </button>
      <AddHallPopup show={showAddPopup} onClose={() => setShowAddPopup(false)} onSave={addHall} />
    </section>
  );
};
