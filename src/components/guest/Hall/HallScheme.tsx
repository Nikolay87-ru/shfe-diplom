import './HallScheme.scss';

interface Seat {
  type: 'standart' | 'vip' | 'disabled';
  selected: boolean;
  occupied: boolean;
}

interface Row {
  seats: Seat[];
}

interface HallSchemeProps {
  rows: Row[];
  onSeatSelect: (rowIndex: number, seatIndex: number) => void;
}

export const HallScheme = ({ rows, onSeatSelect }: HallSchemeProps) => {
  return (
    <div className="hall-scheme">
      <div className="screen">Экран</div>
      
      <div className="rows">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.seats.map((seat, seatIndex) => (
              <button
                key={seatIndex}
                className={`seat ${seat.type} ${seat.selected ? 'selected' : ''} ${seat.occupied ? 'occupied' : ''}`}
                onClick={() => !seat.occupied && onSeatSelect(rowIndex, seatIndex)}
                disabled={seat.occupied}
              />
            ))}
          </div>
        ))}
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
          <div className="seat occupied"></div>
          <span>Занято</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Выбрано</span>
        </div>
      </div>
      
      <button className="buy-button">Забронировать</button>
    </div>
  );
};