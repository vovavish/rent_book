import { FC } from 'react';
import { SupportRequestResponse } from '../../types/response/supportRequestResponse';
import styles from './admin-support-request-list.module.scss';
import dayjs from 'dayjs';
import { Preloader } from '../ui';
import { EmptyText } from '../empty-text/empty-text';

interface AdminSupportRequestListProps {
  requests: SupportRequestResponse[];
  isLoading: boolean;
  error: string | null;
  renderActions?: (request: SupportRequestResponse) => React.ReactNode;
  emptyText?: string;
  showUpdatedAt?: boolean;
  updatedAtLabel?: string;
}

export const AdminSupportRequestList: FC<AdminSupportRequestListProps> = ({
  requests,
  isLoading,
  error,
  renderActions,
  emptyText = 'Нет обращений',
  showUpdatedAt,
  updatedAtLabel = 'Обновлено',
}) => {
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}

      {requests.length === 0 && !isLoading && <EmptyText>{emptyText}</EmptyText>}

      <div className={styles.requestsList}>
        {requests.map((request) => (
          <div key={request.id} className={styles.requestCard}>
            <h2 className={styles.requestTitle}>{request.title}</h2>
            <p className={styles.userInfo}>
              От: {request.user.lastname} {request.user.name} {request.user.surname},{' '}
              {dayjs(request.createdAt).format('DD.MM.YYYY HH:mm')}
              {showUpdatedAt && `, ${updatedAtLabel} ${dayjs(request.updatedAt).format('DD.MM.YYYY HH:mm')}`}
            </p>
            <p className={styles.requestContent}>{request.content}</p>

            {renderActions && <div className={styles.buttonGroup}>{renderActions(request)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
