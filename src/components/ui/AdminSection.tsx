import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface AdminSectionProps {
  title: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

const AdminSection = ({
  title,
  defaultOpen = false,
  children,
}: AdminSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="admin__section">
      <div className="admin__header">
        <h2 className="admin__header_text">{title}</h2>
        <button
          className={`admin__header_arrow${!open ? " admin__header_arrow-hide" : ""}`}
          onClick={() => setOpen((v) => !v)}
          type="button"
          aria-label="Скрыть/раскрыть раздел"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
          <FaChevronDown />
        </button>
      </div>
      <div className={`admin__wrapper${!open ? ' admin__wrapper-hide' : ''}`}>
        {children}
      </div>
    </section>
  );
};

export default AdminSection;