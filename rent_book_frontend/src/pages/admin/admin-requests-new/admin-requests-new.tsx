import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { SupportRequestStatus } from '../../../types/response/supportRequestResponse';

import styles from './admin-requests-new.module.scss';
import { useStore } from '../../../hooks/useStore';
import { DashboardTitle } from '../../../components/ui/dashboard-title';
import { AdminSupportRequestList } from '../../../components/admin-support-request-list';

export const AdminRequestsNew = observer(() => {
  const { supportRequestStore } = useStore();

  useEffect(() => {
    supportRequestStore.fetchAllRegisteredRequests();
  }, []);

  const handleSetInProgress = async (requestId: number) => {
    await supportRequestStore.setInProgress(requestId, { status: SupportRequestStatus.IN_PROGRESS });
  };

  return (
    <div>
      <DashboardTitle>Новые обращения</DashboardTitle>
      <AdminSupportRequestList
        requests={supportRequestStore.allRegisteredRequests}
        isLoading={supportRequestStore.isLoading}
        error={supportRequestStore.error}
        emptyText="Обращений нет"
        renderActions={(request) => (
          <button
            className={styles.actionButton}
            onClick={() => handleSetInProgress(request.id)}
            disabled={supportRequestStore.isLoading}
          >
            Отправить в работу
          </button>
        )}
      />
    </div>
  );
});