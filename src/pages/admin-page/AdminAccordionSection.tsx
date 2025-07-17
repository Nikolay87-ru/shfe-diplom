import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export function AdminAccordionSection({
  title,
  children,
  defaultOpen = true,
  isFirst = false,
  isLast = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="admin__section">
      <div className="admin__header" onClick={() => setOpen((o) => !o)}>
        <div className={`admin__header_text ${isFirst ? 'admin__header_text-first' : ''} ${isLast ? 'admin__header_text-last' : ''}`}>
          {title}
        </div>
        <IoIosArrowDown
          className={'admin__header_arrow' + (open ? '' : ' admin__header_arrow-hide')}
          style={{ strokeWidth: 40 }}
        />
      </div>
      <div className={`admin__wrapper ${isLast ? 'admin__wrapper-last' : ''} ${!open ? 'admin__wrapper-hide' : ''}`}>
        {open && children}
      </div>
    </section>
  );
}