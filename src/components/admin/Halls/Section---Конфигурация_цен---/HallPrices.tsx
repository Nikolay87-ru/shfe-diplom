import React, { useEffect, useState } from 'react';
import { useHalls } from '../../../../context/HallsContext';
import { api } from '../../../../utils/api';
import { HallsList } from '../HallsList';
import './HallPrices.scss';

export const HallPrices: React.FC = () => {
  const { halls, selectedHallId, setSelectedHallId, update } = useHalls();
  const hall = halls.find((h) => h.id === selectedHallId);

  const [priceSt, setPriceSt] = useState(0);
  const [priceVip, setPriceVip] = useState(0);
  const [initial, setInitial] = useState<{ standart: number; vip: number } | null>(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (hall) {
      setPriceSt(hall.hall_price_standart);
      setPriceVip(hall.hall_price_vip);
      setInitial({
        standart: hall.hall_price_standart,
        vip: hall.hall_price_vip,
      });
      setChanged(false);
    }
  }, [hall]);

  function handleChange(val: number, which: 'st' | 'vip') {
    if (which === 'st') setPriceSt(val);
    else setPriceVip(val);
    setChanged(
      (which === 'st' ? val : priceSt) !== (initial?.standart ?? 0) ||
        (which === 'vip' ? val : priceVip) !== (initial?.vip ?? 0),
    );
  }

  function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    if (!initial) return;
    setPriceSt(initial.standart);
    setPriceVip(initial.vip);
    setChanged(false);
  }

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    if (!hall) return;
    await api.updateHallPrices(hall.id, { standartPrice: priceSt, vipPrice: priceVip });
    await update();
    setChanged(false);
  }

  if (!hall) return <div style={{ padding: '2em' }}>Залы не найдены</div>;

  return (
    <section className="admin__section price-config">
      <p className="admin__info">Выберите зал для конфигурации:</p>
      <HallsList halls={halls} selectedId={selectedHallId} onSelect={setSelectedHallId} />
      <div className="price-config__wrapper">
        <p className="admin__info">Установите цены для типов кресел:</p>
        <form className="price-config__form" autoComplete="off">
          <div className="price-config__legend">
            <label className="admin_label price-config__label">
              Цена, рублей
              <input
                type="number"
                min={0}
                className="admin_input price-config__input_standart"
                value={priceSt}
                onChange={(e) => handleChange(Number(e.target.value), 'st')}
                required
              />
            </label>
            <p className="price-config__legend_text">
              за <span className="place_standart"></span> обычные кресла
            </p>
          </div>
          <div className="price-config__legend">
            <label className="admin_label price-config__label">
              Цена, рублей
              <input
                type="number"
                min={0}
                className="admin_input price-config__input_vip"
                value={priceVip}
                onChange={(e) => handleChange(Number(e.target.value), 'vip')}
                required
              />
            </label>
            <p className="price-config__legend_text">
              за <span className="place_vip"></span> VIP кресла
            </p>
          </div>
        </form>
        <div className="price-config__buttons">
          <button
            className={
              'admin__button_cancel price-config__batton_cancel button' +
              (changed ? '' : ' button_disabled')
            }
            onClick={handleCancel}
            tabIndex={0}
            disabled={!changed}
          >
            Отмена
          </button>
          <button
            className={
              'admin__button_save price-config__batton_save button' +
              (changed ? '' : ' button_disabled')
            }
            onClick={handleSave}
            tabIndex={0}
            disabled={!changed}
          >
            Сохранить
          </button>
        </div>
      </div>
    </section>
  );
};
