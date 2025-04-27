import { RentalStatus } from '../../../types/response/rentalResonse';
import styles from './rental-book-status.module.scss';

interface RentalBookStatusProps {
  rentalStatus: RentalStatus;
}

const statusToLabelMap: Record<RentalStatus, string> = {
  [RentalStatus.PENDING]: 'В ожидании',
  [RentalStatus.APPROVED_BY_OWNER]: 'Одобрена владельцем',
  [RentalStatus.CONFIRMED]: 'Подтверждена',
  [RentalStatus.GIVEN_TO_READER]: 'Издание передано',
  [RentalStatus.CANCELED]: 'Прервана',
  [RentalStatus.ACTIVE]: 'Активна',
  [RentalStatus.RETURN_APPROVAL]: 'Ожидает возврата',
  [RentalStatus.COMPLETED]: 'Завершена',
  [RentalStatus.REJECTED]: 'Отклонена',
};

const statusToColorMap: Record<RentalStatus, string> = {
  [RentalStatus.PENDING]: styles.pending,
  [RentalStatus.APPROVED_BY_OWNER]: styles.approved_by_owner,
  [RentalStatus.CONFIRMED]: styles.confirmed,
  [RentalStatus.GIVEN_TO_READER]: styles.given_to_reader,
  [RentalStatus.CANCELED]: styles.canceled,
  [RentalStatus.ACTIVE]: styles.active,
  [RentalStatus.RETURN_APPROVAL]: styles.return_approval,
  [RentalStatus.COMPLETED]: styles.completed,
  [RentalStatus.REJECTED]: styles.rejected,
};

export const RentalBookStatus = ({ rentalStatus }: RentalBookStatusProps) => {
  const statusLabel = statusToLabelMap[rentalStatus];
  const statusClassName = statusToColorMap[rentalStatus];
  console.log('rentalStatus', rentalStatus);
  return (
    <div className={`${styles.rental_status} ${statusClassName}`}>
      {statusLabel}
    </div>
  );
};
