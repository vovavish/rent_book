import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/useStore';
import { DashboardTitle } from '../../../components/ui/dashboard-title';
import styles from './admin-requests-in-progress.module.scss';
import { AdminSupportRequestList } from '../../../components/admin-support-request-list';
import { UserActionButton } from '../../../components/ui';
import { ConfirmModal } from '../../../components/modal/modal-confirm';

export const AdminRequestsInProgress = observer(() => {
  const { supportRequestStore } = useStore();
  const [responseText, setResponseText] = useState<{ [key: number]: string }>({});
  const [showResponseInput, setShowResponseInput] = useState<{ [key: number]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<number | null>(null);

  useEffect(() => {
    supportRequestStore.fetchAllInProgressRequests();
  }, []);

  const handleCloseRequest = async (requestId: number) => {
    if (!responseText[requestId]?.trim()) {
      alert('Пожалуйста, введите текст ответа перед закрытием обращения');
      return;
    }

    await supportRequestStore.closeRequest(requestId, { adminResponse: responseText[requestId] });
    setShowResponseInput((prev) => ({ ...prev, [requestId]: false }));
    setResponseText((prev) => ({ ...prev, [requestId]: '' }));
  };

  const toggleResponseInput = (requestId: number) => {
    setShowResponseInput((prev) => ({ ...prev, [requestId]: !prev[requestId] }));
  };

  return (
    <div>
      {isModalOpen && (
        <ConfirmModal
          onConfirm={async () => {
            await handleCloseRequest(currentRequest!);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
          message="Вы уверены, что хотите закрыть обращение?"
        />
      )}
      <DashboardTitle>Обращения в работе</DashboardTitle>
      <AdminSupportRequestList
        requests={supportRequestStore.allInProgressRequests}
        isLoading={supportRequestStore.isLoading}
        error={supportRequestStore.error}
        emptyText="Обращений нет"
        showUpdatedAt
        updatedAtLabel='в работе с'
        renderActions={(request) => (
          <>
            {showResponseInput[request.id] && (
              <textarea
                className={styles.responseInput}
                value={responseText[request.id] || ''}
                onChange={(e) =>
                  setResponseText((prev) => ({ ...prev, [request.id]: e.target.value }))
                }
                placeholder="Введите ответ пользователю"
              />
            )}
            <div className={styles.buttonGroup}>
              <UserActionButton
                onClick={() => toggleResponseInput(request.id)}
                disabled={supportRequestStore.isLoading}
              >
                {showResponseInput[request.id] ? 'Отменить' : 'Закрыть обращение'}
              </UserActionButton>
              {showResponseInput[request.id] && (
                <UserActionButton
                  onClick={() => {
                    setIsModalOpen(true);
                    setCurrentRequest(request.id);
                  }}
                  disabled={supportRequestStore.isLoading || !responseText[request.id]?.trim()}
                  variant="reader"
                >
                  Подтвердить закрытие
                </UserActionButton>
              )}
            </div>
          </>
        )}
      />
    </div>
  );
});
