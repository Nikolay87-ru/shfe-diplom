import React, { useState, useEffect } from 'react';
import './HallConfig.scss';
import { useHalls } from '../../../../context/HallsContext';
import { HallsList } from '../HallsList';
import { api } from '../../../../utils/api';

const ROWS_MIN = 1,
  ROWS_MAX = 50,
  PLACES_MIN = 1,
  PLACES_MAX = 50;

export const HallConfig: React.FC = () => {
  const { halls, selectedHallId, setSelectedHallId, update } = useHalls();
  const hall = halls.find((h) => h.id === selectedHallId);

  const [rows, setRows] = useState(0);
  const [places, setPlaces] = useState(0);
  const [config, setConfig] = useState<string[][]>([]);
  const [initial, setInitial] = useState<{
    rows: number;
    places: number;
    config: string[][];
  } | null>(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (hall) {
      setRows(hall.hall_rows);
      setPlaces(hall.hall_places);
      setConfig(JSON.parse(JSON.stringify(hall.hall_config)));
      setInitial({
        rows: hall.hall_rows,
        places: hall.hall_places,
        config: JSON.parse(JSON.stringify(hall.hall_config)),
      });
      setChanged(false);
    }
  }, [hall]);

  function handleSizeApply(e: React.FormEvent) {
    e.preventDefault();
    if (rows < ROWS_MIN || rows > ROWS_MAX || places < PLACES_MIN || places > PLACES_MAX) return;
    setConfig(
      Array.from({ length: rows }, () => Array.from({ length: places }, (_) => 'standart')),
    );
    setChanged(true);
  }

  function handleChairClick(rowIdx: number, placeIdx: number) {
    if (!config[rowIdx]) return;
    const next = { standart: 'vip', vip: 'disabled', disabled: 'standart' };
    setConfig((prev) => {
      const c = prev.map((row) => [...row]);
      c[rowIdx][placeIdx] = next[c[rowIdx][placeIdx]] || 'standart';
      return c;
    });
    setChanged(true);
  }

  function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    if (!initial) return;
    setRows(initial.rows);
    setPlaces(initial.places);
    setConfig(JSON.parse(JSON.stringify(initial.config)));
    setChanged(false);
  }

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    if (!hall) return;
    await api.updateHallConfig(hall.id, {
      rowCount: rows,
      placeCount: places,
      config,
    });
    await update();
    setChanged(false);
  }

  if (!hall) return <div style={{ padding: '2em' }}>Залы не найдены</div>;

  return (
    <section className="admin__section hall-config">
      <p className="admin__info">Выберите зал для конфигурации:</p>
      <HallsList halls={halls} selectedId={hall.id} onSelect={setSelectedHallId} />
      <div className="hall-config__wrapper">
        <p className="admin__info">
          Укажите количество рядов и максимальное количество кресел в ряду:
        </p>
        <form className="hall-config__size" onSubmit={handleSizeApply}>
          <label className="admin_label">
            Рядов, шт
            <input
              type="number"
              min={ROWS_MIN}
              max={ROWS_MAX}
              className="admin_input hall-config__rows"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />
          </label>
          <p className="hall-size">x</p>
          <label className="admin_label">
            Мест, шт
            <input
              type="number"
              min={PLACES_MIN}
              max={PLACES_MAX}
              className="admin_input hall-config__places"
              value={places}
              onChange={(e) => setPlaces(Number(e.target.value))}
            />
          </label>
          <button type="submit" className="button" style={{ marginLeft: 12 }}>
            Применить
          </button>
        </form>

        <p className="admin__info">Теперь вы можете указать типы кресел на схеме зала:</p>
        <div className="hall-config__types">
          <div className="hall-config__type_place">
            <span className="place_standart"></span>&nbsp;— обычные кресла
          </div>
          <div className="hall-config__type_place">
            <span className="place_vip"></span>&nbsp;— VIP кресла
          </div>
          <div className="hall-config__type_place">
            <span className="place_block"></span>&nbsp;— заблокированные (нет кресла)
          </div>
        </div>
        <div className="hall-config__hint">Чтобы изменить вид кресла, нажмите по нему</div>

        <div className="hall-config__hall">
          <div className="hall-config__hall_screen">экран</div>
          <div className="hall-config__hall_wrapper">
            {config.map((row, rowIdx) => (
              <div key={rowIdx} className="hall-config__hall_row">
                {row.map((place, pIdx) => (
                  <span
                    key={pIdx}
                    className={`hall-config__hall_chair place_${place}`}
                    onClick={() => handleChairClick(rowIdx, pIdx)}
                    tabIndex={0}
                    title={
                      place === 'standart' ? 'Обычный' : place === 'vip' ? 'VIP' : 'Нет кресла'
                    }
                  ></span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="hall-config__buttons">
          <button
            className={
              'admin__button_cancel hall-config__batton_cancel button' +
              (!changed ? ' button_disabled' : '')
            }
            onClick={handleCancel}
            disabled={!changed}
          >
            Отмена
          </button>
          <button
            className={
              'admin__button_save hall-config__batton_save button' +
              (!changed ? ' button_disabled' : '')
            }
            onClick={handleSave}
            disabled={!changed}
          >
            Сохранить
          </button>
        </div>
      </div>
    </section>
  );
};
