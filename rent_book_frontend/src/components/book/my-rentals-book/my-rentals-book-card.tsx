import { FC } from 'react';

import styles from '../book-card.module.scss';
import { observer } from 'mobx-react-lite';
import { RentalResponse } from '../../../types/response/rentalResonse';
import { useStore } from '../../../hooks/useStore';
import { BookImageSliderRental } from '../rental-image-slider';
import { RentalBookStatus } from '../rental-book-status/rental-book-status';
import dayjs from 'dayjs';

interface RentInOutBookCardProps {
  rental: RentalResponse;
  currentImageIndex: number;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const MyRentalsBookCard: FC<RentInOutBookCardProps> = observer(
  ({ rental, currentImageIndex, setCurrentImageIndices }) => {
    const { rentBookStore, authStore } = useStore();
    const book = rental.book;

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
    console.log(rental.owner);
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
          <p className={styles['book-author']}>{book.author}</p>
          <p className={styles['book-title']}>"{book.title}"</p>
          <div className={styles['book-price-wrapper']}>
            <div className={styles['book-price']}>{rental.price}</div>
            <p>руб</p>
          </div>
          <p>
            {dayjs(rental.rentStartDate).format('DD-MM-YYYY')} -{' '}
            {dayjs(rental.rentEndDate).format('DD-MM-YYYY')}
          </p>
          <p>Владелец - {rental.owner.lastname + ' ' + rental.owner.name + ' ' + rental.owner.surname}</p>

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
          </div>
        </div>
      </div>
    );
  },
);
