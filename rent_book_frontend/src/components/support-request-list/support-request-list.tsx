import { FC } from 'react';
import {
  SupportRequestResponse,
  SupportRequestStatus,
} from '../../types/response/supportRequestResponse';
import styles from './support-request-list.module.scss';
import dayjs from 'dayjs';

interface SupportRequestListProps {
  requests: SupportRequestResponse[];
  isLoading: boolean;
  error: string | null;
  renderActions?: (request: SupportRequestResponse) => React.ReactNode;
  emptyText?: string;
}

const getStatusLabel = (status: SupportRequestStatus) => {
  switch (status) {
    case 'REGISTERED':
      return 'На рассмотрении';
    case 'IN_PROGRESS':
      return 'В работе';
    case 'CLOSED':
      return 'Закрыто';
    default:
      return status;
  }
};

export const SupportRequestList: FC<SupportRequestListProps> = ({
  requests,
  isLoading,
  error,
  renderActions,
  emptyText = 'У вас нет обращений',
}) => {
  return (
    <div className={styles.container}>
      {isLoading && <div className={styles.loading}>Загрузка...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {requests.length === 0 && !isLoading && <div className={styles.empty}>{emptyText}</div>}

      <div className={styles.requestsList}>
        {requests.map((request) => (
          <div key={request.id} className={styles.requestCard}>
            <div
              className={`${styles.statusBadge} ${
                request.status === 'REGISTERED'
                  ? styles.registered
                  : request.status === 'IN_PROGRESS'
                  ? styles.inProgress
                  : request.status === 'CLOSED'
                  ? styles.closed
                  : ''
              }`}
            >
              {getStatusLabel(request.status)}
            </div>

            <h2 className={styles.requestTitle}>{request.title}</h2>

            <p className={styles.requestDate}>
              {dayjs(request.createdAt).format('DD-MM-YYYY HH:mm')}
            </p>

            <p className={styles.requestContent}>{request.content}</p>

            {request.status === 'CLOSED' && request.adminResponse && (
              <>
                <p className={styles.adminResponseTitle}>Ответ администратора:</p>
                <p className={styles.adminResponse}>{request.adminResponse}</p>
              </>
            )}

            {renderActions && <div className={styles.buttonGroup}>{renderActions(request)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
