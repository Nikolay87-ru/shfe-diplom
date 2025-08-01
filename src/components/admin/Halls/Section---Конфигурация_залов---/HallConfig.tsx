import React, { useState, useEffect } from 'react';
import './HallConfig.scss';
import { useHalls } from '@/context/hooks/useHalls';
import { HallsList } from '../Section---Управление_залами---/HallsList/HallsList';
import { api } from '@/utils/api';

const ROWS_MIN = 1,
  ROWS_MAX = 50,
  PLACES_MIN = 1,
  PLACES_MAX = 50;

export const HallConfig: React.FC = () => {
  const { halls, selectedHallId, setSelectedHallId, update } = useHalls();
  const hall = halls.find((h) => h.id === selectedHallId);

  const [rows, setRows] = useState<number | ''>('');
  const [places, setPlaces] = useState<number | ''>('');
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

      const updatedConfig = hall.hall_config.map((row) => [...row]);
      setConfig(updatedConfig);

      setInitial({
        rows: hall.hall_rows,
        places: hall.hall_places,
        config: updatedConfig,
      });
      setChanged(false);
    }
  }, [hall]);

  function handleRowsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === '') {
      setRows('');
      setConfig([]);
      setChanged(true);
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) return;

    setRows(numValue);

    if (places !== '') {
      setConfig(
        Array.from({ length: numValue }, () => Array.from({ length: places }, () => 'standart')),
      );
    } else {
      setConfig([]);
    }
    setChanged(true);
  }

  function handlePlacesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === '') {
      setPlaces('');
      setConfig([]);
      setChanged(true);
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) return;

    setPlaces(numValue);

    if (rows !== '') {
      setConfig(
        Array.from({ length: rows }, () => Array.from({ length: numValue }, () => 'standart')),
      );
    } else {
      setConfig([]);
    }
    setChanged(true);
  }

  function handleChairClick(rowIdx: number, placeIdx: number) {
    if (!config[rowIdx]) return;
    const next = { standart: 'vip', vip: 'disabled', disabled: 'standart' };
    setConfig((prev) => {
      const c = prev.map((row) => [...row]);
      const currentType = c[rowIdx][placeIdx] as keyof typeof next;
      c[rowIdx][placeIdx] = next[currentType] || 'standart';
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
    if (!hall || rows === '' || places === '') return;
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
      <HallsList halls={halls} selectedId={selectedHallId} onSelect={setSelectedHallId} />
      <div className="hall-config__wrapper">
        <p className="admin__info">
          Укажите количество рядов и максимальное количество кресел в ряду:
        </p>
        <div className="hall-config__size">
          <label className="admin_label">
            Рядов, шт
            <input
              type="number"
              min={ROWS_MIN}
              max={ROWS_MAX}
              className="admin_input hall-config__rows"
              style={{ width: '100%' }}
              value={rows}
              onChange={handleRowsChange}
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
              style={{ width: '100%' }}
              value={places}
              onChange={handlePlacesChange}
            />
          </label>
        </div>

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
            {config.length > 0 ? (
              config.map((row, rowIdx) => (
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
              ))
            ) : (
              <div className="hall-config__empty">Укажите количество рядов и мест</div>
            )}
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
            disabled={!changed || rows === '' || places === ''}
          >
            Сохранить
          </button>
        </div>
      </div>
    </section>
  );
};
