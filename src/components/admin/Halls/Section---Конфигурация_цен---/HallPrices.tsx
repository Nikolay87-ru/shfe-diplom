import React, { useEffect, useState } from 'react';
import { useHalls } from '@/context/hooks/useHalls';
import { api } from '@/utils/api';
import { HallsList } from '../Section---Управление_залами---/HallsList/HallsList';
import './HallPrices.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const HallPrices: React.FC = () => {
  const {
    allData: { halls = [] },
    selectedHallId,
    setSelectedHallId,
    updateLocalData,
  } = useHalls();
  const hall = halls.find((h) => h.id === selectedHallId);

  const [priceSt, setPriceSt] = useState(0);
  const [priceVip, setPriceVip] = useState(0);
  const [initial, setInitial] = useState<{ standart: number; vip: number } | null>(null);
  const [changed, setChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, which: 'st' | 'vip') => {
    const value = e.target.value;

    if (value === '') {
      if (which === 'st') setPriceSt(0);
      else setPriceVip(0);
      const newChanged =
        (which === 'st' ? 0 : priceSt) !== (initial?.standart ?? 0) ||
        (which === 'vip' ? 0 : priceVip) !== (initial?.vip ?? 0);
      setChanged(newChanged);
      return;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    if (which === 'st') setPriceSt(numValue);
    else setPriceVip(numValue);

    const newChanged =
      (which === 'st' ? numValue : priceSt) !== (initial?.standart ?? 0) ||
      (which === 'vip' ? numValue : priceVip) !== (initial?.vip ?? 0);

    setChanged(newChanged);
  };

  const preventMathSigns = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === '+') {
      e.preventDefault();
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!initial) return;
    setPriceSt(initial.standart);
    setPriceVip(initial.vip);
    setChanged(false);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
  
    if (priceSt === 0 || priceVip === 0) {
      toast.error('Нельзя сохранить пустые поля ввода!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  
    if (!hall || isSaving) {
      return;
    }
  
    setIsSaving(true);
  
    try {
      const response = await api.updateHallPrices(hall.id, {
        standartPrice: priceSt,
        vipPrice: priceVip,
      });
  
      if (response && response.success) {
        await updateLocalData(
          'halls',
          halls.map((h) =>
            h.id === hall.id
              ? {
                  ...h,
                  hall_price_standart: priceSt,
                  hall_price_vip: priceVip,
                }
              : h,
          ),
        );
  
        setChanged(false);
        setInitial({
          standart: priceSt,
          vip: priceVip,
        });
        
        toast.success('Цены успешно сохранены!', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('handleSave:', error);
      toast.error('Ошибка при сохранении цен', {
        position: 'top-center',
        autoClose: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

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
                id="price-standart"
                name="priceStandart"
                type="number"
                min={0}
                className="admin_input price-config__input_standart"
                value={priceSt === 0 ? '' : priceSt}
                onChange={(e) => handleChange(e, 'st')}
                onKeyDown={preventMathSigns}
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
                id="price-vip"
                name="priceVip"
                type="number"
                min={0}
                className="admin_input price-config__input_vip"
                value={priceVip === 0 ? '' : priceVip}
                onChange={(e) => handleChange(e, 'vip')}
                onKeyDown={preventMathSigns}
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
              'admin__button_cancel price-config__button_cancel button' +
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
              'admin__button_save price-config__button_save button' +
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
