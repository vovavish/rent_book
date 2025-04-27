import { FC } from 'react';
import { SupportRequestResponse } from '../../types/response/supportRequestResponse';
import styles from './admin-support-request-list.module.scss';
import dayjs from 'dayjs';

interface AdminSupportRequestListProps {
  requests: SupportRequestResponse[];
  isLoading: boolean;
  error: string | null;
  renderActions?: (request: SupportRequestResponse) => React.ReactNode;
  emptyText?: string;
}

export const AdminSupportRequestList: FC<AdminSupportRequestListProps> = ({
  requests,
  isLoading,
  error,
  renderActions,
  emptyText = 'Нет обращений',
}) => {
  return (
    <div className={styles.container}>
      {isLoading && <div className={styles.loading}>Загрузка...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {requests.length === 0 && !isLoading && (
        <div className={styles.empty}>{emptyText}</div>
      )}

      <div className={styles.requestsList}>
        {requests.map((request) => (
          <div key={request.id} className={styles.requestCard}>
            <h2 className={styles.requestTitle}>{request.title}</h2>
            <p className={styles.userInfo}>
              От: {request.user.lastname} {request.user.name} {request.user.surname}, {dayjs(request.createdAt).format('DD-MM-YYYY HH:mm')}
            </p>
            <p className={styles.requestContent}>{request.content}</p>
            
            {renderActions && (
              <div className={styles.buttonGroup}>
                {renderActions(request)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
