import React from 'react';
import { AdminHeader } from './AdminHeader';
import { HallsManagement } from '../../components/admin/Halls/Section---Управление_залами---/HallsManagement';
import { HallConfig } from '../../components/admin/Halls/Section---Конфигурация_залов---/HallConfig';
import { HallPrices } from '../../components/admin/Halls/Section---Конфигурация_цен---/HallPrices';
import { SeancesGridSection } from '../../components/admin/Halls/Section---Сетка_сеансов---/SeancesGridSection';
import { HallsProvider } from '../../context/HallsContext';
import { HallOpenSection } from '../../components/admin/Halls/Section---Открыть_продажи---/HallOpen';
import '../../styles/admin.scss';

import { AdminAccordionSection } from './AdminAccordionSection';

export const AdminPanel: React.FC = () => (
  <HallsProvider>
    <div className="admin__container">
      <AdminHeader />
      <main className="admin__main">
        <AdminAccordionSection title="Управление залами" defaultOpen>
          <HallsManagement />
        </AdminAccordionSection>
        <AdminAccordionSection title="Конфигурация залов">
          <HallConfig />
        </AdminAccordionSection>
        <AdminAccordionSection title="Конфигурация цен">
          <HallPrices />
        </AdminAccordionSection>
        <AdminAccordionSection title="Сетка сеансов">
          <SeancesGridSection />
        </AdminAccordionSection>
        <AdminAccordionSection title="Открыть продажи">
          {' '}
          <HallOpenSection />{' '}
        </AdminAccordionSection>
      </main>
    </div>
  </HallsProvider>
);
