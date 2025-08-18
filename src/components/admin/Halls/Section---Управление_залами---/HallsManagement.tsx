import React, { useState } from 'react';
import { HallsList } from './HallsList/HallsList';
import { useHalls } from '@/context/hooks/useHalls';
import { api } from '@/utils/api';
import { AddHallPopup } from './HallPopup/AddHallPopup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HallsManagement.scss';
import { ConfirmDeleteModal } from '@/components/modal/ConfirmDeleteModal';

export const HallsManagement: React.FC = () => {
  const {
    allData: { halls = [] },
    selectedHallId,
    setSelectedHallId,
    updateLocalData,
  } = useHalls();
  const [showAddPopup, setShowAddPopup] = useState(false);

  async function addHall(name: string) {
    try {
      const response = await api.addHall(name);
      if (response.success && response.result?.halls) {
        updateLocalData('halls', response.result.halls);
        toast.success('Зал успешно добавлен', {
          position: 'top-center',
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error adding hall:', error);
      toast.error('Не удалось добавить зал', {
        position: 'top-center',
        autoClose: 5000,
      });
    }
  }

  async function deleteHall(id: number) {
    toast(
      <ConfirmDeleteModal
        title="Удалить зал?"
        onConfirm={() => confirmDeleteHall(id)}
        onCancel={() => toast.dismiss()}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        style: {
          width: '300px',
          justifyContent: 'center',
        },
      },
    );
  }

  async function confirmDeleteHall(id: number) {
    try {
      const response = await api.deleteHall(id);
      if (response.success && response.result?.halls) {
        updateLocalData('halls', response.result.halls);
        
        if (id === selectedHallId) {
          const remainingHalls = response.result.halls;
          setSelectedHallId(remainingHalls[0]?.id); 
        }
        
        toast.success('Зал успешно удалён', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
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
