import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './rent-book.module.scss';
import { Star } from 'lucide-react';

export const RentBookPage = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const { bookId } = useParams<{ bookId: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (bookId) {
      rentBookStore.fetchToRentalBookById(Number(bookId));
      rentBookStore.fetchBookReviewsById(Number(bookId));
    }
  }, [bookId]);

  const book = rentBookStore.currentBook;

  const nextImage = () => {
    if (book?.coverImagesUrls) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % book.coverImagesUrls.length);
    }
  };

  const prevImage = () => {
    if (book?.coverImagesUrls) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + book.coverImagesUrls.length) % book.coverImagesUrls.length,
      );
    }
  };

  return (
    <div className={styles['rent-book-page']}>
      {rentBookStore.isLoading && <p>Загрузка...</p>}
      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

      {book ? (
        <div className={styles['book-details']}>
          <div className={styles['image-slider']}>
            {book.coverImagesUrls?.length > 0 && (
              <>
                <div className={styles['image-container']}>
                  <img
                    src={book.coverImagesUrls[currentImageIndex]}
                    alt={`${book.title} ${currentImageIndex + 1}`}
                  />
                </div>
                {book.coverImagesUrls.length > 1 && (
                  <div className={styles['slider-controls']}>
                    <button onClick={prevImage} className={styles['slider-button']}>
                      &lt;
                    </button>
                    <span className={styles['slider-counter']}>
                      {currentImageIndex + 1}/{book.coverImagesUrls.length}
                    </span>
                    <button onClick={nextImage} className={styles['slider-button']}>
                      &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className={styles['book-info']}>
            <h1>{book.title}</h1>
            <p>Автор: {book.author}</p>
            <p>Состояние: {book.condition}</p>
            <p>Год издания: {book.publishedYear}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Язык: {book.language}</p>
            <p>Категория: {book.category}</p>
            <p>Описание: {book.description}</p>
            <p>Цена: {book.price} рублей</p>
            <p>Статус: {book.availabilityStatus}</p>
            <p>Владелец: {`${book.user.name} ${book.user.lastname} ${book.user.surname}`}</p>

            {authStore.isAuth && book.user.id !== authStore.user?.id && (
              <Link to={`/rent_book/start/${book.id}`} className={styles['rent-button']}>
                Арендовать
              </Link>
            )}
            {authStore.isAuth && book.user.id === authStore.user?.id && <p>Это ваша книга</p>}
          </div>
          {book && (
            <div className={styles['book-reviews']}>
              <h2>Отзывы о книге</h2>

              {/* Средний рейтинг */}
              <div className={styles['average-rating']}>
                <Star size={24} color="#FFD700" fill="#FFD700" />
                <span className={styles['rating-value']}>
                  {book.bookRating ? book.bookRating.toFixed(1) : 'Нет рейтинга'}
                </span>
              </div>

              {/* Список отзывов */}
              {rentBookStore.currentBookReviews.length > 0 ? (
                <ul className={styles['reviews-list']}>
                  {rentBookStore.currentBookReviews.map((review) => (
                    <li key={review.id} className={styles['review-item']}>
                      <div className={styles['review-header']}>
                        <span className={styles['review-author']}>
                          {review.user.name} {review.user.lastname}
                        </span>
                        {review.rating !== null && (
                          <div className={styles['review-rating']}>
                            <Star size={16} color="#FFD700" fill="#FFD700" />
                            <span>{review.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      {review.content && (
                        <p className={styles['review-content']}>{review.content}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Отзывов пока нет</p>
              )}
            </div>
          )}
        </div>
      ) : (
        !rentBookStore.isLoading && <p>Книга не найдена</p>
      )}
    </div>
  );
});
