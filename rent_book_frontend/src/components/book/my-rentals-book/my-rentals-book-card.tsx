import { FC, useState } from 'react';
import styles from '../book-card.module.scss';
import { observer } from 'mobx-react-lite';
import { RentalResponse } from '../../../types/response/rentalResonse';
import { useStore } from '../../../hooks/useStore';
import { BookImageSliderRental } from '../rental-image-slider';
import { RentalBookStatus } from '../rental-book-status/rental-book-status';
import dayjs from 'dayjs';
import { Star } from 'lucide-react';

interface RentInOutBookCardProps {
  rental: RentalResponse;
  currentImageIndex: number;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const MyRentalsBookCard: FC<RentInOutBookCardProps> = observer(
  ({ rental, currentImageIndex, setCurrentImageIndices }) => {
    const { rentBookStore, authStore } = useStore();
    const [ownerRating, setOwnerRating] = useState<number | null>(null);
    const [bookRating, setBookRating] = useState<number | null>(null);
    const [reviewContent, setReviewContent] = useState<string>('');
    const [ownerHover, setOwnerHover] = useState<number | null>(null);
    const [bookHover, setBookHover] = useState<number | null>(null);

    const handleRentalAction = async (rentalId: number, action: string) => {
      try {
        switch (action) {
          case 'confirm':
            await rentBookStore.confirmPayment(rentalId);
            break;
          case 'confirmReceive':
            await rentBookStore.confirmReceivingBook(rentalId);
            break;
          case 'confirmReturn':
            await rentBookStore.approveReturn(rentalId);
            break;
          case 'rejectFromPending':
            await rentBookStore.rejectRentalFromPending(rentalId);
            break;
          case 'rejectFromApprovedByOwner':
            await rentBookStore.rejectRentalFromApprovedByOwner(rentalId);
            break;
          case 'cancelReceive':
            await rentBookStore.cancelRecivingBook(rentalId);
            break;
        }
      } catch (error) {
        console.error('Error handling rental action:', error);
      }
    };

    const handleRateOwnerAndBook = async (rentalId: number, ownerRating: number, bookRating: number, reviewContent: string) => {
      try {
        await rentBookStore.rateOwnerAndBook(rentalId, ownerRating, bookRating, reviewContent);
        setOwnerRating(null);
        setBookRating(null);
        setReviewContent('');
      } catch (error) {
        console.error('Error rating owner and book:', error);
      }
    };
    console.log('rental', rental);
    return (
      <div className={styles['book-item']}>
        <BookImageSliderRental
          rental={rental}
          rentalId={rental.id}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndices={setCurrentImageIndices}
        />

        <div className={styles['book-info']}>
          <div className={styles['book-header']}>
            <h3>Книга</h3>
            <RentalBookStatus rentalStatus={rental.status} />
          </div>
          <p className={styles['book-author']}>{rental.bookAuthor}</p>
          <p className={styles['book-title']}>"{rental.bookTitle}"</p>
          <div className={styles['book-price-wrapper']}>
            <div className={styles['book-price']}>{rental.price}</div>
            <p>руб</p>
          </div>
          <p>
            {dayjs(rental.rentStartDate).format('DD-MM-YYYY')} -{' '}
            {dayjs(rental.rentEndDate).format('DD-MM-YYYY')}
          </p>
          <p>Владелец - {rental.ownerLastname + ' ' + rental.ownerName + ' ' + rental?.ownerSurname}</p>

          <div className={styles.rentalActions}>
            {rental.status === 'PENDING' && rental.renterId === authStore.user?.id && (
              <button
                className={styles.actionButton}
                onClick={() => handleRentalAction(rental.id, 'rejectFromPending')}
              >
                Отклонить заявку
              </button>
            )}
            {rental.status === 'APPROVED_BY_OWNER' && rental.renterId === authStore.user?.id && (
              <>
                <button
                  className={styles.actionButton}
                  onClick={() => handleRentalAction(rental.id, 'confirm')}
                >
                  Оплатить
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleRentalAction(rental.id, 'rejectFromApprovedByOwner')}
                >
                  Отклонить
                </button>
              </>
            )}
            {rental.status === 'GIVEN_TO_READER' && rental.renterId === authStore.user?.id && (
              <>
                <button
                  className={styles.actionButton}
                  onClick={() => handleRentalAction(rental.id, 'confirmReceive')}
                >
                  Подтвердить получение
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleRentalAction(rental.id, 'cancelReceive')}
                >
                  Отменить
                </button>
              </>
            )}
            {rental.status === 'RETURN_APPROVAL' && rental.ownerId === authStore.user?.id && (
              <button
                className={styles.actionButton}
                onClick={() => handleRentalAction(rental.id, 'confirmReturn')}
              >
                Подтвердить возврат
              </button>
            )}

            {/* Оценка владельца и книги */}
            {(rental.status === 'CANCELED' || rental.status === 'COMPLETED') && rental.renterId === authStore.user?.id && (
              <div className={styles.ratingSection}>
                {rental.ownerRating && rental.bookRating ? (
                  <div className={styles.starsDisplay}>
                    <div>
                      <p>Оценка владельца:</p>
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={24}
                          color={index < rental.ownerRating! ? '#ffc107' : '#e4e5e9'}
                        />
                      ))}
                    </div>
                    <div>
                      <p>Оценка книги:</p>
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={24}
                          color={index < rental.bookRating! ? '#ffc107' : '#e4e5e9'}
                        />
                      ))}
                    </div>
                    {rental.reviewContent && <p>Отзыв: {rental.reviewContent}</p>}
                  </div>
                ) : (
                  <div className={styles.ratingInput}>
                    <div>
                      <p>Оцените владельца:</p>
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                          <label key={starValue}>
                            <input
                              type="radio"
                              name="ownerRating"
                              value={starValue}
                              onClick={() => setOwnerRating(starValue)}
                              style={{ display: 'none' }}
                            />
                            <Star
                              size={30}
                              color={starValue <= (ownerHover ?? ownerRating ?? 0) ? '#ffc107' : '#e4e5e9'}
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => setOwnerHover(starValue)}
                              onMouseLeave={() => setOwnerHover(null)}
                            />
                          </label>
                        );
                      })}
                    </div>
                    <div>
                      <p>Оцените книгу:</p>
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                          <label key={starValue}>
                            <input
                              type="radio"
                              name="bookRating"
                              value={starValue}
                              onClick={() => setBookRating(starValue)}
                              style={{ display: 'none' }}
                            />
                            <Star
                              size={30}
                              color={starValue <= (bookHover ?? bookRating ?? 0) ? '#ffc107' : '#e4e5e9'}
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => setBookHover(starValue)}
                              onMouseLeave={() => setBookHover(null)}
                            />
                          </label>
                        );
                      })}
                    </div>
                    <div>
                      <p>Отзыв о книге:</p>
                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Напишите отзыв о книге (необязательно)"
                        className={styles.reviewTextarea}
                      />
                    </div>
                    <button
                      onClick={() => ownerRating && bookRating && handleRateOwnerAndBook(rental.id, ownerRating, bookRating, reviewContent)}
                      disabled={!ownerRating || !bookRating}
                      className={styles.submitRatingButton}
                    >
                      Подтвердить оценку
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);