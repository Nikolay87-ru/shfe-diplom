import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Hall } from '../../../types/index';

interface HallConfigProps {
  hall: Hall;
}

export const HallConfig = ({ hall }: HallConfigProps) => {
  const [rows, setRows] = useState(hall.hall_rows);
  const [places, setPlaces] = useState(hall.hall_places);
  const [config, setConfig] = useState<string[][]>(hall.hall_config);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setRows(hall.hall_rows);
    setPlaces(hall.hall_places);
    setConfig(hall.hall_config);
    setChanged(false);
  }, [hall]);

  const handlePlaceClick = (row: number, seat: number) => {
    const newConfig = [...config];
    const current = newConfig[row][seat];
    
    if (current === 'standart') newConfig[row][seat] = 'vip';
    else if (current === 'vip') newConfig[row][seat] = 'disabled';
    else newConfig[row][seat] = 'standart';
    
    setConfig(newConfig);
    setChanged(true);
  };

  const handleSizeChange = () => {
    const newConfig = Array(rows).fill(0).map(() => 
      Array(places).fill('standart')
    );
    setConfig(newConfig);
    setChanged(true);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.set('rowCount', rows.toString());
    formData.set('placeCount', places.toString());
    formData.set('config', JSON.stringify(config));
    setChanged(false);
  };

  return (
    <div className="hall-config">
      <div className="size-controls">
        <label>
          Рядов: 
          <input 
            type="number" 
            value={rows} 
            onChange={(e) => setRows(parseInt(e.target.value))}
            min="1" 
            max="50" 
          />
        </label>
        <span>×</span>
        <label>
          Мест: 
          <input 
            type="number" 
            value={places} 
            onChange={(e) => setPlaces(parseInt(e.target.value))}
            min="1" 
            max="50" 
          />
        </label>
        <Button onClick={handleSizeChange}>Применить</Button>
      </div>

      <div className="hall-scheme">
        <div className="screen">ЭКРАН</div>
        <div className="seats-grid">
          {config.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((seat, seatIndex) => (
                <div
                  key={seatIndex}
                  className={`seat ${seat}`}
                  onClick={() => handlePlaceClick(rowIndex, seatIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="seat standart"></div>
          <span>Обычные</span>
        </div>
        <div className="legend-item">
          <div className="seat vip"></div>
          <span>VIP</span>
        </div>
        <div className="legend-item">
          <div className="seat disabled"></div>
          <span>Заблокированные</span>
        </div>
      </div>

      <div className="actions">
        <Button variant="secondary">Отмена</Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={!changed}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};