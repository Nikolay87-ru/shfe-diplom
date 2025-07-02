import { useState, useEffect } from 'react';
import { updateHallConfig } from '../../../api/hallService';
import HallScheme from '../../../components/admin/HallScheme';
import AdminSection from '../../../components/ui/AdminSection';
import { type Hall } from '../../../types/hall';
import { toast } from 'react-toastify';

interface HallConfigProps {
  hall: Hall;
}

const HallConfig = ({ hall }: HallConfigProps) => {
  const [rows, setRows] = useState(hall.hall_rows);
  const [places, setPlaces] = useState(hall.hall_places);
  const [config, setConfig] = useState<string[][]>(hall.hall_config);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setRows(hall.hall_rows);
    setPlaces(hall.hall_places);
    setConfig(hall.hall_config);
    setIsChanged(false);
  }, [hall]);

  const handleConfigChange = (newConfig: string[][]) => {
    setConfig(newConfig);
    setIsChanged(true);
  };

  const handleSizeChange = (newRows: number, newPlaces: number) => {
    setRows(newRows);
    setPlaces(newPlaces);
    
    const newConfig = Array(newRows).fill(null).map(() => 
      Array(newPlaces).fill('standart')
    );
    
    setConfig(newConfig);
    setIsChanged(true);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.set('rowCount', rows.toString());
      formData.set('placeCount', places.toString());
      formData.set('config', JSON.stringify(config));
      
      await updateHallConfig(hall.id, formData);
      setIsChanged(false);
      toast.success('Конфигурация зала сохранена!');
    } catch (error) {
      toast.error('Ошибка сохранения конфигурации зала!');
    }
  };

  const handleCancel = () => {
    setRows(hall.hall_rows);
    setPlaces(hall.hall_places);
    setConfig(hall.hall_config);
    setIsChanged(false);
  };

  return (
    <AdminSection title="Конфигурация залов">
      <div className="admin__wrapper">
        <p className="admin__info">Выберите зал для конфигурации:</p>
        
        <div className="hall-config__wrapper">
          <p className="admin_info">Укажите количество рядов и максимальное количество кресел в ряду:</p>
          
          <div className="hall-config__size">
            <label className="admin_label">
              Рядов, шт
              <input
                type="number"
                className="admin_input hall-config__rows"
                value={rows}
                min="1"
                max="50"
                onChange={(e) => handleSizeChange(Number(e.target.value), places)}
              />
            </label>
            
            <span className="hall-size">x</span>
            
            <label className="admin_label">
              Мест, шт
              <input
                type="number"
                className="admin_input hall-config__places"
                value={places}
                min="1"
                max="50"
                onChange={(e) => handleSizeChange(rows, Number(e.target.value))}
              />
            </label>
          </div>

          <p className="admin__info">Теперь вы можете указать типы кресел на схеме зала:</p>

          <div className="hall-config__types">
            <div className="hall-config__type_place"> 
              <span className="place_standart"></span> — обычные кресла
            </div>
            <div className="hall-config__type_place">
              <span className="place_vip"></span> — VIP кресла
            </div>
            <div className="hall-config__type_place">
              <span className="place_block"></span> — заблокированные (нет кресла)
            </div>
          </div>

          <p className="hall-config__hint">Чтобы изменить вид кресла, нажмите по нему</p>

          <HallScheme 
            config={config}
            onConfigChange={handleConfigChange}
          />

          <div className="hall-config__buttons">
            <button
              className={`admin__button_cancel button ${!isChanged ? 'button_disabled' : ''}`}
              onClick={handleCancel}
              disabled={!isChanged}
            >
              Отмена
            </button>
            <button
              className={`admin__button_save button ${!isChanged ? 'button_disabled' : ''}`}
              onClick={handleSave}
              disabled={!isChanged}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </AdminSection>
  );
};

export default HallConfig;