import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Hall } from '../../../types/index';
import { api } from '../../../utils/api';

interface HallPricesProps {
  hall: Hall;
}

export const HallPrices = ({ hall }: HallPricesProps) => {
  const [standartPrice, setStandartPrice] = useState(hall.hall_price_standart);
  const [vipPrice, setVipPrice] = useState(hall.hall_price_vip);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setStandartPrice(hall.hall_price_standart);
    setVipPrice(hall.hall_price_vip);
    setChanged(false);
  }, [hall]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.set('priceStandart', standartPrice.toString());
    formData.set('priceVip', vipPrice.toString());
    
    try {
      const response = await api.updateHallPrices(hall.id, {
        standartPrice,
        vipPrice
      });
      if (response.success) {
        setChanged(false);
      }
    } catch (error) {
      console.error('Error saving prices:', error);
    }
  };

  const handleCancel = () => {
    setStandartPrice(hall.hall_price_standart);
    setVipPrice(hall.hall_price_vip);
    setChanged(false);
  };

  return (
    <div className="price-config">
      <div className="price-fields">
        <div className="price-field">
          <label>
            Цена, рублей
            <input 
              type="number" 
              value={standartPrice}
              onChange={(e) => {
                setStandartPrice(parseInt(e.target.value));
                setChanged(true);
              }}
              min="0"
            />
          </label>
          <span className="price-description">
            за <span className="seat standart"></span> обычные кресла
          </span>
        </div>
        
        <div className="price-field">
          <label>
            Цена, рублей
            <input 
              type="number" 
              value={vipPrice}
              onChange={(e) => {
                setVipPrice(parseInt(e.target.value));
                setChanged(true);
              }}
              min="0"
            />
          </label>
          <span className="price-description">
            за <span className="seat vip"></span> VIP кресла
          </span>
        </div>
      </div>

      <div className="price-actions">
        <Button 
          variant="secondary" 
          onClick={handleCancel}
          disabled={!changed}
        >
          Отмена
        </Button>
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