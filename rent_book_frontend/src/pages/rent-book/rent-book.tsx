import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './rent-book.module.scss';
import { AlertTriangle, Star } from 'lucide-react';
import { BookImageSlider } from '../../components/book/book-home-slider';
import {
  ageRatingTranslations,
  categoryTranslations,
  conditionTranslations,
  formatTranslations,
  materialConstructionTranslations,
  periodicityTranslations,
  typeTranslations,
} from '../../types/response/bookResponse';
import { Preloader, UserActionButton } from '../../components/ui';
import { FavoriteButton } from '../../components/book/favorite-button';
import clsx from 'clsx';
import { ModalWithChildren } from '../../components/modal/modal-with-children';
import { StartRentBookPage } from '../../components/start-rent-book';
import { BookComplain } from '../../components/book/book-complain/book-complain';

export const RentBookPage = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const { bookId } = useParams<{ bookId: string }>();
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComplainModalOpen, setIsComplainModalOpen] = useState(false);

  useEffect(() => {
    if (bookId) {
      rentBookStore.fetchToRentalBookById(Number(bookId));
      rentBookStore.fetchBookReviewsById(Number(bookId));
    }
  }, [bookId, rentBookStore]);

  const book = rentBookStore.currentBook;

  if (rentBookStore.isLoading || authStore.isUserLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles['rent-book-page']}>
      {isModalOpen && (
        <ModalWithChildren
          onCancel={() => setIsModalOpen(false)}
          headerText="Отправка заявки на аренду"
        >
          <StartRentBookPage />
        </ModalWithChildren>
      )}
      {isComplainModalOpen && (
        <ModalWithChildren
          onCancel={() => setIsComplainModalOpen(false)}
          headerText="Пожаловаться"
        >
          <BookComplain bookId={Number(bookId)} onComplain={() => setIsComplainModalOpen(false)}/>
        </ModalWithChildren>
      )}

      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

      {book ? (
        <>
          <div className={styles.bookAuthorAndTitle}>
            <div>
              {book.author}, {book.title}. {book.frequencyTitle && book.frequencyTitle}
            </div>
          </div>
          <div className={styles.book_top}>
            <div className={styles.bookMainInfo}>
              <BookImageSlider
                book={book}
                currentImageIndex={currentImageIndices[book.id] || 0}
                setCurrentImageIndices={setCurrentImageIndices}
              />

              <div className={styles.bookInfoHeader}>
                <div className={styles.bookInfoHeaderTop}>
                  <div className={styles.bookInfoHeaderTopLeft}>
                    <div className={styles.bookInfoHeaderTopType}>
                      {typeTranslations[book.type]}
                    </div>
                    <div className={styles.rating}>
                      <span>{book.bookRating ? book.bookRating.toFixed(1) : 'Нет рейтинга'}</span>
                      <Star size={22} color="#FFD700" fill="#FFD700" />
                    </div>
                  </div>
                  <div className={styles.bookInfoHeaderTopAge}>
                    {ageRatingTranslations[book.ageRestriction!]}
                    {!authStore.isAuth || book.user.id !== authStore.user?.id && <button onClick={() => setIsComplainModalOpen(true)} title="Пожаловаться" className={styles.complainButton}>
                      <AlertTriangle size={22} />
                    </button>}
                  </div>
                </div>

                <div className={styles.bookInfoHeaderBottom}>
                  <div>
                    <span className={clsx(styles.boldText, styles.price)}>{book.price}</span> руб/день
                  </div>
                  <div>депозит - <span className={styles.boldText}>{book.deposit}</span> руб</div>
                  {!authStore.isAuth || book.user.id !== authStore.user?.id ? (
                    <div className={styles.actions}>
                      <UserActionButton
                        variant="reader"
                        onClick={() => {
                          setIsModalOpen(true);
                        }}
                      >
                        Арендовать
                      </UserActionButton>
                      или
                      <FavoriteButton bookId={book.id} />
                    </div>
                  ) : (
                    <p className={styles.normalText}>Это ваша книга</p>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.ownerInfo}>
              <div className={styles.owner}>
                <h3 className={styles.aboutBookTitle}>Владелец:</h3>
                {book.user.ownerRating !== null && (
                  <div className={styles.rating}>
                    <span>{book.user.ownerRating.toFixed(1)}</span>
                    <Star size={22} color="#FFD700" fill="#FFD700" />
                  </div>
                )}
              </div>
              <div className={styles.aboutBookMainInfo}>
                <div className={clsx(styles.aboutBookMainInfoItem)}>
                  <div className={styles.normalText}>
                    {book.user.name} {book.user.lastname} {book.user.surname}
                  </div>
                </div>
              </div>
              <div className={styles.aboutBookMainInfo}>
                <div className={clsx(styles.aboutBookMainInfoItem)}>
                  <div className={styles.normalText}>{book.user.phoneNumbers.join(', ')}</div>
                </div>
              </div>
              <h3 className={styles.aboutBookTitle}>Местоположение:</h3>
              <div className={styles.aboutBookMainInfo}>
                <div className={clsx(styles.aboutBookMainInfoItem)}>
                  <div className={styles.normalText}>
                    {book.address.split(',').slice(0, 3).join(', ')}
                  </div>
                </div>
              </div>
              <h3 className={styles.aboutBookTitle}>Описание:</h3>
              <div className={styles.aboutBookMainInfo}>
                <div className={clsx(styles.aboutBookMainInfoItem)}>
                  <div className={styles.normalText}>{book.description}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.book_bottom}>
            <div className={styles.aboutBook}>
              <h3 className={styles.aboutBookTitle}>Об издании:</h3>
              <div className={styles.aboutBookMainInfo}>
                <div className={clsx(styles.aboutBookMainInfoItem)}>
                  Место издания: <div className={styles.normalText}>{book.publishingCity}</div>
                </div>
              </div>
              <div className={styles.aboutBookMainInfo}>
                <div className={clsx(styles.aboutBookMainInfoItem)}>
                  Издательство: <div className={styles.normalText}>{book.publisher}</div>
                </div>
              </div>
              <div className={styles.aboutBookMainInfo}>
                <div className={clsx(styles.aboutBookMainInfoItem)}>
                  Год: <div className={styles.normalText}>{book.publishedYear}</div>
                </div>
              </div>
              <div className={styles.aboutBookMainInfo}>
                <div className={clsx(styles.aboutBookMainInfoItem)}>
                  Тираж: <div className={styles.normalText}>{book.printRun}</div>
                </div>
              </div>
              <div className={styles.aboutBookMainInfo}>
                <div className={clsx(styles.aboutBookMainInfoItem)}>
                  Количество страниц: <div className={styles.normalText}>{book.pages}</div>
                </div>
              </div>
              <div className={styles.aboutBookMainInfo}>
                <div className={clsx(styles.aboutBookMainInfoItem)}>
                  Возрастное ограничение:{' '}
                  <div className={styles.normalText}>
                    {ageRatingTranslations[book.ageRestriction!]}
                  </div>
                </div>
              </div>
              <div className={styles.aboutBookInfo}>
                <div className={styles.categoryName}>Состояние:</div>
                <div className={styles.normalText}>{conditionTranslations[book.condition!]}</div>
              </div>
              <div className={styles.aboutBookInfo}>
                <div className={styles.categoryName}>Жанры:</div>
                <div className={styles.normalText}>
                  {book.category.map((c) => categoryTranslations[c]).join(', ')}
                </div>
              </div>
              {(book.periodicity || book.materialConstruction || book.format) && (
                <h3 className={styles.aboutBookTitle}>Прочее:</h3>
              )}
              {book.periodicity && (
                <div className={styles.aboutBookMainInfo}>
                  <div className={clsx(styles.aboutBookMainInfoItem)}>
                    Периодичность издания: {periodicityTranslations[book.periodicity]}
                  </div>
                </div>
              )}
              {book.materialConstruction && (
                <div className={styles.aboutBookMainInfo}>
                  <div className={clsx(styles.aboutBookMainInfoItem)}>
                    Материальная конструкция:{' '}
                    {materialConstructionTranslations[book.materialConstruction]}
                  </div>
                </div>
              )}
              {book.format && (
                <div className={styles.aboutBookMainInfo}>
                  <div className={clsx(styles.aboutBookMainInfoItem)}>
                    Формат: {formatTranslations[book.format]}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.bookReviews}>
              <h3 className={styles.categoryName}>Отзывы:</h3>
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
                            <span>{review.rating.toFixed(1)}</span>
                            <Star size={22} color="#FFD700" fill="#FFD700" />
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
                <p className={clsx(styles.normalText, styles.noReviews)}>Отзывов пока нет</p>
              )}
            </div>
          </div>
        </>
      ) : (
        !rentBookStore.isLoading && <p className={styles.normalText}>Книга не найдена</p>
      )}
    </div>
  );
});
