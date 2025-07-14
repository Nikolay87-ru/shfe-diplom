import React from 'react';
import { AdminHeader } from './AdminHeader';
import { HallsManagement } from '../../components/admin/Halls/HallsManagement';
import { HallConfig } from '../../components/admin/Halls/HallConfig';
import { HallPrices } from '../../components/admin/Halls/HallPrices';
import { SeancesGridSection } from '../../components/admin/Seances/SeancesGridSection';
import { HallsProvider } from '../../context/HallsContext';
import { HallOpenSection } from '../../components/admin/Halls/HallOpen';
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
