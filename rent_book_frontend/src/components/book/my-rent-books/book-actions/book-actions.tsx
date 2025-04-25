import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../hooks/useStore';

import styles from './book-actions.module.scss';

interface BookActionsProps {
  bookId: number;
  availabilityStatus: string;
}

export const BookActions: FC<BookActionsProps> = observer(({ bookId, availabilityStatus }) => {
  const { rentBookStore } = useStore();

  return (
    <div className={styles.book_actions}>
      {availabilityStatus !== 'RENTED' && (
        <button className={styles.book_actions_button} onClick={() => rentBookStore.deleteBook(bookId)}>Удалить</button>
      )}
      {availabilityStatus !== 'CLOSED' && availabilityStatus !== 'RENTED' && (
        <button className={styles.book_actions_button} onClick={() => rentBookStore.hideUserBook(bookId)}>Скрыть</button>
      )}
      {availabilityStatus === 'CLOSED' && (
        <button className={styles.book_actions_button} onClick={() => rentBookStore.openUserBook(bookId)}>Показать</button>
      )}
    </div>
  );
});