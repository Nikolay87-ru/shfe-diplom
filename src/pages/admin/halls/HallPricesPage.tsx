import AdminSection from '../../../components/ui/AdminSection';
import { type Hall } from '../../../types/hall';

interface Props {
  hall: Hall;
}

const HallPricesPage = ({ hall }: Props) => (
  <AdminSection title="Конфигурация цен">
    <div className="admin__wrapper">
      <div className="price-config__wrapper">
        <p className="admin__info">Установите цены для типов кресел:</p>
        <form className="price-config__form">
          <div className="price-config__legend">
            <label className="admin_label price-config__label">
              Цена, рублей
              <input type="number" className="admin_input price-config__input_standart" value={hall.hall_price_standart} min="0" readOnly />
            </label>
            <span className="price-config__legend_text"> за <span className="price-config__chair place_standart"></span> обычные кресла</span>
          </div>
          <div className="price-config__legend">
            <label className="admin_label price-config__label">
              Цена, рублей
              <input type="number" className="admin_input price-config__input_vip" value={hall.hall_price_vip} min="0" readOnly />
            </label>
            <span className="price-config__legend_text"> за <span className="price-config__chair place_vip"></span> VIP кресла</span>
          </div>
        </form>
        <div className="price-config__buttons">
          <button className="admin__button_cancel button button_disabled" disabled>Отмена</button>
          <button className="admin__button_save button button_disabled" disabled>Сохранить</button>
        </div>
      </div>
    </div>
  </AdminSection>
);

export default HallPricesPage;