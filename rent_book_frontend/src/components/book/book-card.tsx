import { FC } from 'react';
import { BookResponse, typeTranslations } from '../../types/response/bookResponse';
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
          <div>
            <div className={styles['book-header']}>
              <h3>{typeTranslations[book.type]}</h3>
              {authStore.isAuth && <FavoriteButton bookId={book.id} />}
            </div>
            <p className={styles['book-author']}>{book.author}</p>
            <p className={styles['book-title']}>"{book.title}"</p>

            <div className={styles['book-price-wrapper']}>
              <div className={styles['book-price']}>{book.price}</div>
              <p>руб/день</p>
            </div>

            <div className={styles['book-rating']}>
              <span>{book.bookRating ? book.bookRating.toFixed(1) : 'Нет рейтинга'}</span>
              <Star size={22} color="#FFD700" fill="#FFD700" />
            </div>
          </div>
          <div>
            <Link to={`/rent_book/${book.id}`} className={styles.rentLink}>
              {' '}
              <UserActionButton variant="reader" className={styles.rentLinkButton}>
                Подробнее
              </UserActionButton>
            </Link>
          </div>
        </div>
      </div>
    );
  },
);
