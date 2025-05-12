import { FC, useState } from 'react';
import ApiRentBookController from '../../../api/RentBookController';
import { BookComplainTranslations, BookComplain as BookComplainType } from '../../../types/complain/complain';

import styles from './book-complain.module.scss';
import { UserActionButton } from '../../ui';

interface BookComplainProps {
  bookId: number;
  onComplain: () => void;
}

export const BookComplain: FC<BookComplainProps> = ({ bookId, onComplain }) => {
  const [complain, setComplain] = useState<BookComplainType | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const onComplainSend = async () => {
    if (!complain) {
      setError('Пожалуйста, выберите причину жалобы');
      return;
    }

    await ApiRentBookController.bookComplain(bookId, {
      bookId,
      complain,
      message,
    });

    onComplain();
  };

  const complainValues = Object.entries(BookComplainType);

  return (
    <div>
      {error && <div>{error}</div>}
      <fieldset className={styles.fieldset}>
        <legend className={styles.title}>Укажите причину жалобы на издание:</legend>
        {complainValues.map(([key, value]) => (
          <div key={key}>
            <input
              type="radio"
              name="complain"
              id={`complain-${key}`}
              value={key}
              onChange={(e) => setComplain(e.target.value as BookComplainType)}
              className={styles.radio}
              
            />
            <label className={styles.standardText} htmlFor={`complain-${key}`}>
              {BookComplainTranslations[value]}
            </label>
          </div>
        ))}
        {complain === BookComplainType.ANOTHER && (
          <div>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите текст жалобы..."
              className={styles.textarea}
            />
          </div>
        )}
        <div className={styles.buttonWrapper}>
          <UserActionButton onClick={onComplainSend} variant='reader' disabled={!complain}>Отправить</UserActionButton>
        </div>
      </fieldset>
    </div>
  );
};
