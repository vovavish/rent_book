import { FC, useState } from 'react';
import styles from '../book-card.module.scss';
import { observer } from 'mobx-react-lite';
import { RentalResponse, RentalStatus } from '../../../types/response/rentalResonse';
import { useStore } from '../../../hooks/useStore';
import { BookImageSliderRental } from '../rental-image-slider';
import { RentalBookStatus } from '../rental-book-status/rental-book-status';
import dayjs from 'dayjs';
import { RatingByReader } from '../rating';
import { UserActionButton } from '../../ui';
import { ConfirmModal } from '../../modal/modal-confirm';
import { ModalWithChildren } from '../../modal/modal-with-children';
import { Contract } from '../../contract/contract';
import { File } from 'lucide-react';
import { EmptyText } from '../../empty-text/empty-text';

interface RentInOutBookCardProps {
  rental: RentalResponse;
  currentImageIndex: number;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const MyRentalsBookCard: FC<RentInOutBookCardProps> = observer(
  ({ rental, currentImageIndex, setCurrentImageIndices }) => {
    const { rentBookStore, authStore } = useStore();
    const [, setOwnerRating] = useState<number | null>(null);
    const [, setBookRating] = useState<number | null>(null);
    const [, setReviewContent] = useState<string>('');
    const [confirmState, setConfirmState] = useState<{
      rentalId: number | null;
      action: string | null;
      message: string;
    } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRenweRentModalOpen, setIsRenweRentModalOpen] = useState(false);

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

    const handleRateOwnerAndBook = async (
      rentalId: number,
      ownerRating: number,
      bookRating: number,
      reviewContent: string,
    ) => {
      try {
        await rentBookStore.rateOwnerAndBook(rentalId, ownerRating, bookRating, reviewContent);
        setOwnerRating(null);
        setBookRating(null);
        setReviewContent('');
      } catch (error) {
        console.error('Error rating owner and book:', error);
      }
    };

    const openConfirmModal = (rentalId: number, action: string, message: string) => {
      setConfirmState({ rentalId, action, message });
    };

    const handleConfirmAction = async () => {
      if (confirmState?.rentalId && confirmState?.action) {
        await handleRentalAction(confirmState.rentalId, confirmState.action);
        setConfirmState(null);
      }
    };

    const handleCancelModal = () => {
      setConfirmState(null);
    };

    return (
      <>
        {confirmState && (
          <ConfirmModal
            message={confirmState.message}
            onConfirm={handleConfirmAction}
            onCancel={handleCancelModal}
            variant="reader"
          />
        )}

        {isModalOpen && (
          <ModalWithChildren
            headerText="Просмотр договора аренды"
            onCancel={() => {
              setIsModalOpen(false);
            }}
          >
            <Contract rentalId={rental.id} />
          </ModalWithChildren>
        )}

        {isRenweRentModalOpen && (
          <ModalWithChildren
            headerText="Продление аренды"
            onCancel={() => {
              setIsRenweRentModalOpen(false);
            }}
          >
            <EmptyText>Эта функция временно недоступна.</EmptyText>
          </ModalWithChildren>
        )}

        <div className={styles['book-item']}>
          <div className={styles['book-image-wrapper']}>
            {rental.status !== RentalStatus.PENDING && rental.status !== RentalStatus.REJECTED && (
              <File
                size={22}
                className={styles.bookContract}
                onClick={() => setIsModalOpen(true)}
                stroke='currentColor'
              />
            )}
            <BookImageSliderRental
              rental={rental}
              rentalId={rental.id}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndices={setCurrentImageIndices}
            />
          </div>

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
            <p className={styles.standardText}>
              {dayjs(rental.rentStartDate).format('DD-MM-YYYY')} -{' '}
              {dayjs(rental.rentEndDate).format('DD-MM-YYYY')}
            </p>
            <p className={styles.standardText}>
              Владелец: {rental.ownerLastname + ' ' + rental.ownerName + ' ' + rental?.ownerSurname}
            </p>
            {rental.status !== 'PENDING' && (
              <p className={styles.standardText}>Адрес: {rental.address}</p>
            )}

            <div className={styles.rentalActions}>
              {rental.status === 'PENDING' && rental.renterId === authStore.user?.id && (
                <UserActionButton
                  onClick={() =>
                    openConfirmModal(rental.id, 'rejectFromPending', 'Отклонить заявку?')
                  }
                  variant="rejected"
                >
                  Отклонить заявку
                </UserActionButton>
              )}
              {rental.status === 'APPROVED_BY_OWNER' && rental.renterId === authStore.user?.id && (
                <>
                  {rental.bookIsCashPayment ? (
                    <UserActionButton
                      onClick={() => openConfirmModal(rental.id, 'confirm', 'Подтвердить оплату?')}
                      variant="reader"
                    >
                      Подтвердить оплату
                    </UserActionButton>
                  ) : (
                    <UserActionButton
                      onClick={() => openConfirmModal(rental.id, 'confirm', 'Подтвердить оплату?')}
                      variant="reader"
                    >
                      Оплатить
                    </UserActionButton>
                  )}
                  <UserActionButton
                    onClick={() =>
                      openConfirmModal(
                        rental.id,
                        'rejectFromApprovedByOwner',
                        'Отклонить бронирование?',
                      )
                    }
                    variant="rejected"
                  >
                    Отклонить
                  </UserActionButton>
                </>
              )}
              {rental.status === 'GIVEN_TO_READER' && rental.renterId === authStore.user?.id && (
                <>
                  <UserActionButton
                    onClick={() =>
                      openConfirmModal(rental.id, 'confirmReceive', 'Подтвердить получение книги?')
                    }
                    variant="reader"
                  >
                    Подтвердить получение
                  </UserActionButton>
                  <UserActionButton
                    onClick={() =>
                      openConfirmModal(rental.id, 'cancelReceive', 'Отменить получение книги?')
                    }
                    variant="rejected"
                  >
                    Отменить
                  </UserActionButton>
                </>
              )}
              {rental.status === 'RETURN_APPROVAL' && rental.ownerId === authStore.user?.id && (
                <UserActionButton
                  onClick={() =>
                    openConfirmModal(rental.id, 'confirmReturn', 'Подтвердить возврат книги?')
                  }
                  variant="reader"
                >
                  Подтвердить возврат
                </UserActionButton>
              )}
              {rental.status === 'ACTIVE' && (
                <UserActionButton
                  onClick={() => setIsRenweRentModalOpen(true)}
                  variant="reader"
                >
                  Продлить аренду
                </UserActionButton>
              )}
              {(rental.status === 'CANCELED' || rental.status === 'COMPLETED') &&
                rental.renterId === authStore.user?.id && (
                  <div className={styles.ratingSection}>
                    <RatingByReader
                      existingOwnerRating={rental.ownerRating}
                      existingBookRating={rental.bookRating}
                      existingReviewContent={rental.reviewContent}
                      onSubmit={(ownerRating, bookRating, reviewContent) =>
                        handleRateOwnerAndBook(rental.id, ownerRating, bookRating, reviewContent)
                      }
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </>
    );
  },
);
