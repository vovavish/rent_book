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

export const RentInOutBookCard: FC<RentInOutBookCardProps> = observer(
  ({ rental, currentImageIndex, setCurrentImageIndices }) => {
    const { rentBookStore, authStore } = useStore();
    const [rating, setRating] = useState<number | null>(null);
    const [hover, setHover] = useState<number | null>(null);

    const handleRentalAction = async (rentalId: number, action: string) => {
      try {
        switch (action) {
          case 'approve':
            await rentBookStore.approveRental(rentalId);
            break;
          case 'reject':
            await rentBookStore.rejectRental(rentalId);
            break;
          case 'rejectFromApproval':
            await rentBookStore.rejectRentalFromApproval(rentalId);
            break;
          case 'confirm':
            await rentBookStore.confirmPayment(rentalId);
            break;
          case 'giveToReader':
            await rentBookStore.confirmGivingBook(rentalId);
            break;
          case 'confirmReceive':
            await rentBookStore.confirmReceivingBook(rentalId);
            break;
          case 'confirmReturn':
            await rentBookStore.approveReturn(rentalId);
            break;
          case 'cancelGivingBook':
            await rentBookStore.cancelGivingBook(rentalId);
            break;
        }
      } catch (error) {
        console.error('Error handling rental action:', error);
      }
    };

    const handleRateRenter = async (rentalId: number, rating: number) => {
      try {
        await rentBookStore.rateRenter(rentalId, rating);
        setRating(null); // Reset local rating after submission
      } catch (error) {
        console.error('Error rating renter:', error);
      }
    };

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
          <p>Читатель - {rental.renterLastname + ' ' + rental.renterName + ' ' + rental?.renterSurname}</p>

          <div className={styles.rentalActions}>
            {rental.status === 'PENDING' && rental.ownerId === authStore.user?.id && (
              <>
                <button onClick={() => handleRentalAction(rental.id, 'approve')}>Принять</button>
                <button onClick={() => handleRentalAction(rental.id, 'reject')}>Отклонить</button>
              </>
            )}
            {rental.status === 'APPROVED_BY_OWNER' && rental.ownerId === authStore.user?.id && (
              <button onClick={() => handleRentalAction(rental.id, 'rejectFromApproval')}>
                Отклонить бронирование
              </button>
            )}
            {rental.status === 'CONFIRMED' && rental.ownerId === authStore.user?.id && (
              <>
                <button onClick={() => handleRentalAction(rental.id, 'giveToReader')}>
                  Подтвердить передачу
                </button>
                <button onClick={() => handleRentalAction(rental.id, 'cancelGivingBook')}>
                  Отклонить
                </button>
              </>
            )}
            {rental.status === 'RETURN_APPROVAL' && rental.ownerId === authStore.user?.id && (
              <button onClick={() => handleRentalAction(rental.id, 'confirmReturn')}>
                Подтвердить возврат
              </button>
            )}

            {/* Рейтинг */}
            {(rental.status === 'CANCELED' || rental.status === 'COMPLETED') && rental.ownerId === authStore.user?.id && (
              <div className={styles.ratingSection}>
                {rental.renterRating ? (
                  <div className={styles.starsDisplay}>
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={24}
                        color={index < rental.renterRating! ? '#ffc107' : '#e4e5e9'}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.starsInput}>
                    {[...Array(5)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <label key={starValue}>
                          <input
                            type="radio"
                            name="rating"
                            value={starValue}
                            onClick={() => setRating(starValue)}
                            style={{ display: 'none' }}
                          />
                          <Star
                            size={30}
                            color={starValue <= (hover ?? rating ?? 0) ? '#ffc107' : '#e4e5e9'}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(null)}
                          />
                        </label>
                      );
                    })}
                    <button
                      onClick={() => rating && handleRateRenter(rental.id, rating)}
                      disabled={!rating}
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
  }
);
