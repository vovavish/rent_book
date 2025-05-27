import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { RentalResponse, RentalStatus } from '../../../types/response/rentalResonse';
import { useStore } from '../../../hooks/useStore';
import { BookImageSliderRental } from '../rental-image-slider';
import { RentalBookStatus } from '../rental-book-status/rental-book-status';
import dayjs from 'dayjs';
import { ConfirmModal } from '../../modal/modal-confirm';
import { UserActionButton } from '../../ui';
import { RatingByOwner } from '../rating';

import styles from '../book-card.module.scss';
import clsx from 'clsx';
import { ModalWithChildren } from '../../modal/modal-with-children';
import { Contract } from '../../contract/contract';
import { CircleAlert, File, Star } from 'lucide-react';

interface RentInOutBookCardProps {
  rental: RentalResponse;
  currentImageIndex: number;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const RentInOutBookCard: FC<RentInOutBookCardProps> = observer(
  ({ rental, currentImageIndex, setCurrentImageIndices }) => {
    const { rentBookStore, authStore } = useStore();
    const [, setRating] = useState<number | null>(null);
    const [confirmState, setConfirmState] = useState<{
      rentalId: number | null;
      action: string | null;
      message: string;
    } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
          case 'giveToReader':
            await rentBookStore.confirmGivingBook(rentalId);
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
        setRating(null);
      } catch (error) {
        console.error('Error rating renter:', error);
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
            variant="owner"
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

        <div className={styles['book-item']}>
          <div className={styles['book-image-wrapper']}>
            {rental.status !== RentalStatus.PENDING && rental.status !== RentalStatus.REJECTED && (
              <File
                size={22}
                className={styles.bookContract}
                onClick={() => setIsModalOpen(true)}
              />
            )}
            {rental.status === RentalStatus.RETURN_APPROVAL && (
              <button className={styles.bookDispute} title="Оспорить">
                <CircleAlert size={22} />
              </button>
            )}
            <BookImageSliderRental
              rental={rental}
              rentalId={rental.id}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndices={setCurrentImageIndices}
            />
          </div>

          <div className={styles['book-info']}>
            <div>
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
                {dayjs(rental.rentStartDate).format('DD.MM.YYYY')} -{' '}
                {dayjs(rental.rentEndDate).format('DD.MM.YYYY')}
              </p>
              <div className={styles.standardText}>
                <p>
                  Читатель -{' '}
                  {rental.renterLastname + ' ' + rental.renterName + ' ' + rental?.renterSurname}
                </p>
                <div className={styles.renterRating}>
                  <p>Рейтинг читателя:</p>
                  <div className={styles.rating}>
                    <span>{rental?.renter.readerRating.toFixed(1)}</span>
                    <Star size={22} color="#FFD700" fill="#FFD700" />
                  </div>
                </div>
              </div>
              {rental.message && (
                <p className={clsx(styles.standardText, styles.croppedText)}>
                  Сообщение - {rental.message}
                </p>
              )}
            </div>
            <div>
              <div className={styles.rentalActions}>
                {rental.status === 'PENDING' && rental.ownerId === authStore.user?.id && (
                  <div className={styles.cardActions}>
                    <UserActionButton
                      onClick={() =>
                        openConfirmModal(
                          rental.id,
                          'approve',
                          'Вы уверены, что хотите принять заявку?',
                        )
                      }
                    >
                      Принять
                    </UserActionButton>
                    <UserActionButton
                      variant="rejected"
                      onClick={() =>
                        openConfirmModal(
                          rental.id,
                          'reject',
                          'Вы уверены, что хотите отклонить заявку?',
                        )
                      }
                    >
                      Отклонить
                    </UserActionButton>
                  </div>
                )}
                {rental.status === 'APPROVED_BY_OWNER' && rental.ownerId === authStore.user?.id && (
                  <UserActionButton
                    variant="rejected"
                    onClick={() =>
                      openConfirmModal(rental.id, 'rejectFromApproval', 'Отклонить бронирование?')
                    }
                  >
                    Отклонить бронирование
                  </UserActionButton>
                )}
                {rental.status === 'CONFIRMED' && rental.ownerId === authStore.user?.id && (
                  <div className={styles.cardActions}>
                    {rental.bookIsCashPayment ? (
                      <UserActionButton
                        onClick={() =>
                          openConfirmModal(
                            rental.id,
                            'giveToReader',
                            'Подтвердить получение оплаты и передачу книги читателю?',
                          )
                        }
                      >
                        Подтвердить получение оплаты и передачу
                      </UserActionButton>
                    ) : (
                      <UserActionButton
                        onClick={() =>
                          openConfirmModal(
                            rental.id,
                            'giveToReader',
                            'Подтвердить передачу книги читателю?',
                          )
                        }
                      >
                        Подтвердить передачу
                      </UserActionButton>
                    )}
                    <UserActionButton
                      variant="rejected"
                      onClick={() =>
                        openConfirmModal(
                          rental.id,
                          'cancelGivingBook',
                          'Вы уверены, что хотите отклонить передачу книги?',
                        )
                      }
                    >
                      Отклонить
                    </UserActionButton>
                  </div>
                )}
                {rental.status === 'RETURN_APPROVAL' && rental.ownerId === authStore.user?.id && (
                  <UserActionButton
                    onClick={() =>
                      openConfirmModal(rental.id, 'confirmReturn', 'Подтвердить возврат книги?')
                    }
                  >
                    Подтвердить возврат
                  </UserActionButton>
                )}

                {(rental.status === 'CANCELED' || rental.status === 'COMPLETED') &&
                  rental.ownerId === authStore.user?.id && (
                    <div className={styles.ratingSection}>
                      <RatingByOwner
                        rentalId={rental.id}
                        renterRating={rental.renterRating}
                        onRateRenter={handleRateRenter}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
