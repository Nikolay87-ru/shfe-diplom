import { useState, useEffect } from 'react';
import './HallScheme.css';

interface HallSchemeProps {
  rows: number;
  places: number;
  config: string[][];
  onConfigChange: (config: string[][]) => void;
}

const HallScheme = ({ rows, places, config, onConfigChange }: HallSchemeProps) => {
  const [localConfig, setLocalConfig] = useState<string[][]>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSeatClick = (rowIndex: number, seatIndex: number) => {
    const newConfig = [...localConfig];
    const currentType = newConfig[rowIndex][seatIndex];
    
    if (currentType === 'standart') {
      newConfig[rowIndex][seatIndex] = 'vip';
    } else if (currentType === 'vip') {
      newConfig[rowIndex][seatIndex] = 'disabled';
    } else {
      newConfig[rowIndex][seatIndex] = 'standart';
    }
    
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="hall-config__hall">
      <div className="hall-config__hall_screen">экран</div>
      
      <div className="hall-config__hall_wrapper">
        {localConfig.map((row, rowIndex) => (
          <div key={rowIndex} className="hall-config__hall_row">
            {row.map((seat, seatIndex) => (
              <span
                key={seatIndex}
                className={`hall-config__hall_chair place_${seat}`}
                onClick={() => handleSeatClick(rowIndex, seatIndex)}
              ></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallScheme;