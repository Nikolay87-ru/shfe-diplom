import React from 'react';
import { toast } from 'react-toastify';

interface confirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  cancelColor?: string;
}

export const ConfirmDeleteModal: React.FC<confirmDeleteModalProps> = ({
  onConfirm,
  onCancel,
  title = 'Подтвердите действие',
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  confirmColor = '#16a6af',
  cancelColor = '#63536c',
}) => {
  return (
    <div>
      <p style={{ display: 'flex', justifyContent: 'center' }}>{title}</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          onClick={() => {
            toast.dismiss();
            onConfirm();
          }}
          style={{
            padding: '5px 10px',
            background: confirmColor,
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {confirmText}
        </button>
        <button
          onClick={() => {
            toast.dismiss();
            onCancel();
          }}
          style={{
            padding: '5px 10px',
            background: cancelColor,
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
};