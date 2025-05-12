import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { SupportRequestStatus } from '../../../types/response/supportRequestResponse';

import { useStore } from '../../../hooks/useStore';
import { DashboardTitle } from '../../../components/ui/dashboard-title';
import { AdminSupportRequestList } from '../../../components/admin-support-request-list';
import { UserActionButton } from '../../../components/ui';
import { ConfirmModal } from '../../../components/modal/modal-confirm';

export const AdminRequestsNew = observer(() => {
  const { supportRequestStore } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<number | null>(null);

  useEffect(() => {
    supportRequestStore.fetchAllRegisteredRequests();
  }, []);

  const handleSetInProgress = async (requestId: number) => {
    setIsModalOpen(true);
    await supportRequestStore.setInProgress(requestId, {
      status: SupportRequestStatus.IN_PROGRESS,
    });
  };

  return (
    <div>
      {isModalOpen && (
        <ConfirmModal
          onConfirm={async() => {
            await handleSetInProgress(currentRequest!)
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
          message='Вы уверены, что хотите отправить обращение в работу?'
        />
      )}
      <DashboardTitle>Новые обращения</DashboardTitle>
      <AdminSupportRequestList
        requests={supportRequestStore.allRegisteredRequests}
        isLoading={supportRequestStore.isLoading}
        error={supportRequestStore.error}
        emptyText="Обращений нет"
        renderActions={(request) => (
          <UserActionButton
            onClick={() => {
              setCurrentRequest(request.id);
              setIsModalOpen(true);
            }}
            disabled={supportRequestStore.isLoading}
            variant="owner"
          >
            Отправить в работу
          </UserActionButton>
        )}
      />
    </div>
  );
});
