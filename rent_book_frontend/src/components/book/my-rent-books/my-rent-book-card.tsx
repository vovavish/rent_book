import { FC } from 'react';
import { BookResponse, typeTranslations } from '../../../types/response/bookResponse';
import { BookImageSlider } from '../book-home-slider';

import styles from '../book-card.module.scss';
import { AvailablityBookStatus } from '../availability-book-status/availability-book-status';
import { observer } from 'mobx-react-lite';
import { BookActions } from './book-actions/book-actions';

interface MyRentBookCardProps {
  book: BookResponse;
  currentImageIndex: number;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const MyRentBookCard: FC<MyRentBookCardProps> = observer(
  ({ book, currentImageIndex, setCurrentImageIndices }) => {
    return (
      <div className={styles['book-item']}>
        <BookImageSlider
          book={book}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndices={setCurrentImageIndices}
        />

        <div className={styles['book-info']}>
          <div className={styles['book-header']}>
            <h3>{typeTranslations[book.type]}</h3>
            <AvailablityBookStatus availabilityStatus={book.availabilityStatus} />
          </div>
          <p className={styles['book-author']}>{book.author}</p>
          <p className={styles['book-title']}>"{book.title}"</p>
          <div className={styles['book-price-wrapper']}>
            <div className={styles['book-price']}>{book.price}</div>
            <p>руб/день</p>
          </div>
          <BookActions bookId={book.id} availabilityStatus={book.availabilityStatus} />
        </div>
      </div>
    );
  },
);
