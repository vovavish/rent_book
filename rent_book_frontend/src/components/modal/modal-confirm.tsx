import { UserActionButton } from '../ui';
import { ModalPortal } from './modal-portal';

import styles from './modal.module.scss';

interface ConfirmModalProps {
  message: string;
  variant?: 'owner' | 'reader' | 'admin';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ message, variant, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <ModalPortal>

      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Подтверждение</h2>
            <button onClick={onCancel} className={styles.closeIcon} aria-label="Close modal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className={styles.modalBody}>
            <p>{message}</p>
          </div>
          <div className={styles.modalFooter}>
            <UserActionButton onClick={onConfirm} variant={variant}>
              Подтвердить
            </UserActionButton>
            <UserActionButton onClick={onCancel} variant='rejected'>
              Отменить
            </UserActionButton>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
