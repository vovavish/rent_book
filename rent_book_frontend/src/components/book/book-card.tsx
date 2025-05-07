import { FC } from 'react';
import { BookResponse } from '../../types/response/bookResponse';
import { Link } from 'react-router-dom';
import { BookImageSlider } from './book-home-slider';
import { FavoriteButton } from './favorite-button';
import { Star } from 'lucide-react'; // <-- добавили импорт

import styles from './book-card.module.scss';
import { useStore } from '../../hooks/useStore';
import { observer } from 'mobx-react-lite';
import { UserActionButton } from '../ui';

interface BookCardProps {
  book: BookResponse;
  currentImageIndex: number;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const BookCard: FC<BookCardProps> = observer(
  ({ book, currentImageIndex, setCurrentImageIndices }) => {
    const { authStore } = useStore();

    return (
      <div className={styles['book-item']}>
        <BookImageSlider
          book={book}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndices={setCurrentImageIndices}
        />

        <div className={styles['book-info']}>
          <div className={styles['book-header']}>
            <h3>Книга</h3>
            {authStore.isAuth && <FavoriteButton bookId={book.id} />}
          </div>
          <p className={styles['book-author']}>{book.author}</p>
          <p className={styles['book-title']}>"{book.title}"</p>

          {/* Красивая цена */}
          <div className={styles['book-price-wrapper']}>
            <div className={styles['book-price']}>{book.price}</div>
            <p>руб/день</p>
          </div>

          {/* Красивая отрисовка рейтинга */}
          <div className={styles['book-rating']}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <span>{book.bookRating ? book.bookRating.toFixed(1) : 'Нет рейтинга'}</span>
          </div>

          <Link to={`/rent_book/${book.id}`} className={styles.rentLink}>
            {' '}
            <UserActionButton variant="reader" className={styles.rentLinkButton}>Подробнее</UserActionButton>
          </Link>
        </div>
      </div>
    );
  },
);
