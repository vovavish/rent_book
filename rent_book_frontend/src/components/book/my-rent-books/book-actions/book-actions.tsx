import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../hooks/useStore';

import styles from './book-actions.module.scss';
import { UserActionButton } from '../../../ui';
import { ConfirmModal } from '../../../modal/modal-confirm';
import { ModalWithChildren } from '../../../modal/modal-with-children';
import { EditRentBook } from '../../../edit-rent-book/edit-rent-book';

interface BookActionsProps {
  bookId: number;
  availabilityStatus: string;
}

export const BookActions: FC<BookActionsProps> = observer(({ bookId, availabilityStatus }) => {
  const { rentBookStore } = useStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    action: string | null;
    message: string;
  } | null>(null);

  const handleConfirmAction = async () => {
    if (!confirmState?.action) return;

    try {
      switch (confirmState.action) {
        case 'hide':
          await rentBookStore.hideUserBook(bookId);
          break;
        case 'show':
          await rentBookStore.openUserBook(bookId);
          break;
        case 'delete':
          await rentBookStore.deleteBook(bookId);
          break;
      }
    } catch (error) {
      console.error('Error performing book action:', error);
    } finally {
      setConfirmState(null);
    }
  };

  const handleCancelModal = () => {
    setConfirmState(null);
  };

  const openConfirmModal = (action: string, message: string) => {
    setConfirmState({ action, message });
  };

  return (
    <>
      {confirmState && (
        <ConfirmModal
          message={confirmState.message}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelModal}
          variant="owner"
        />
      )}
      {isEditModalOpen && (
        <ModalWithChildren
          onCancel={() => setIsEditModalOpen(false)}
          headerText="Редактирование объявления"
        >
          <EditRentBook bookId={bookId} onSaveData={() => setIsEditModalOpen(false)}/>
        </ModalWithChildren>
      )}

      <div className={styles.book_actions}>
        <div className={styles.main_actions}>
          <UserActionButton
            onClick={() => {
              setIsEditModalOpen(true);
            }}
          >
            Изменить
          </UserActionButton>
          {availabilityStatus !== 'CLOSED' && availabilityStatus !== 'RENTED' && (
            <UserActionButton
              onClick={() => openConfirmModal('hide', 'Вы уверены, что хотите скрыть книгу?')}
            >
              Скрыть
            </UserActionButton>
          )}
          {availabilityStatus === 'CLOSED' && (
            <UserActionButton
              onClick={() => openConfirmModal('show', 'Вы уверены, что хотите показать книгу?')}
            >
              Показать
            </UserActionButton>
          )}
        </div>
        {availabilityStatus !== 'RENTED' && (
          <UserActionButton
            variant="rejected"
            onClick={() => openConfirmModal('delete', 'Вы уверены, что хотите удалить книгу?')}
          >
            Удалить
          </UserActionButton>
        )}
      </div>
    </>
  );
});
