import { BookStatus } from "../../../types/response/bookResponse";
import styles from './availability-book-status.module.scss';

interface AvailabilityBookStatusProps {
  availabilityStatus: BookStatus;
}

const statusToLabelMap: Record<BookStatus, string> = {
  [BookStatus.ACTIVE]: 'Активно',
  [BookStatus.RENTED]: 'В аренде',
  [BookStatus.CLOSED]: 'Скрыто',
};

const statusToColorMap: Record<BookStatus, string> = {
  [BookStatus.ACTIVE]: styles.active,
  [BookStatus.RENTED]: styles.rented,
  [BookStatus.CLOSED]: styles.closed,
};

export const AvailablityBookStatus = ({ availabilityStatus }: AvailabilityBookStatusProps) => {
  const statusLabel = statusToLabelMap[availabilityStatus];
  const statusClassName = statusToColorMap[availabilityStatus];
  
  return (
    <div className={`${styles.availability_status} ${statusClassName}`}>
      {statusLabel}
    </div>
  );
};