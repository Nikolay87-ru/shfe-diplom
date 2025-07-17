import React, { useState } from 'react';
import { HallsList } from '../HallsList';
import { useHalls } from '../../../../context/HallsContext';
import { api } from '../../../../utils/api';
import { AddHallPopup } from './HallPopup/AddHallPopup';
import './HallsManagement.scss';

export const HallsManagement: React.FC = () => {
  const { halls, selectedHallId, setSelectedHallId, update } = useHalls();
  const [showAddPopup, setShowAddPopup] = useState(false);

  async function addHall(name: string) {
    await api.addHall(name);
    await update();
  }

  async function deleteHall(id: number) {
    if (window.confirm('Удалить зал?')) {
      await api.deleteHall(id);
      await update();
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
