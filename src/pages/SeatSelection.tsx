import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";
import { type Session } from "../types/Session";

export const SeatSelection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<[number, number][]>([]);

  useEffect(() => {
    if (id) {
      api.getSessions().then(sessions => {
        setSession(sessions.find(s => String(s.id) === id) ?? null);
      });
    }
  }, [id]);

  if (!session) return <div className="container">Загрузка...</div>;

  const toggleSeat = (rowIdx: number, seatIdx: number) => {
    const isSelected = selectedSeats.some(
      ([r, s]) => r === rowIdx && s === seatIdx
    );
    setSelectedSeats(selected =>
      isSelected
        ? selected.filter(([r, s]) => !(r === rowIdx && s === seatIdx))
        : [...selected, [rowIdx, seatIdx]]
    );
  };

  const handleBuy = () => {
    if (selectedSeats.length === 0) {
      alert("Выберите хотя бы одно место!");
      return;
    }
    alert(`Места куплены: ${selectedSeats.map(([r, s]) => `${r + 1}-${s + 1}`).join(", ")}`);
  };

  return (
    <div className="container mt-4">
      <h3>Выбор мест</h3>
      <div>
        {session.seats.map((row, rIdx) => (
          <div key={rIdx} className="d-flex mb-2">
            {row.map((occupied, sIdx) => {
              const isSelected = selectedSeats.some(([r, s]) => r === rIdx && s === sIdx);
              return (
                <button
                  type="button"
                  disabled={occupied}
                  key={sIdx}
                  onClick={() => toggleSeat(rIdx, sIdx)}
                  className={`btn ${occupied ? 'btn-secondary' : isSelected ? 'btn-success' : 'btn-outline-primary'} mx-1`}
                  style={{ width: 40, height: 40 }}
                >
                  {sIdx + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3" onClick={handleBuy}>
        Купить ({selectedSeats.length})
      </button>
    </div>
  );
};