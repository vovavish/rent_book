import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/useStore';
import { DashboardTitle } from '../../../components/ui/dashboard-title';
import styles from './admin-requests-in-progress.module.scss';
import { AdminSupportRequestList } from '../../../components/admin-support-request-list';

export const AdminRequestsInProgress = observer(() => {
  const { supportRequestStore } = useStore();
  const [responseText, setResponseText] = useState<{ [key: number]: string }>({});
  const [showResponseInput, setShowResponseInput] = useState<{ [key: number]: boolean }>({});

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
      <DashboardTitle>Обращения в работе</DashboardTitle>
      <AdminSupportRequestList
        requests={supportRequestStore.allInProgressRequests}
        isLoading={supportRequestStore.isLoading}
        error={supportRequestStore.error}
        emptyText="Обращений нет"
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
              <button
                className={styles.actionButton}
                onClick={() => toggleResponseInput(request.id)}
                disabled={supportRequestStore.isLoading}
              >
                {showResponseInput[request.id] ? 'Отменить' : 'Закрыть обращение'}
              </button>
              {showResponseInput[request.id] && (
                <button
                  className={styles.submitButton}
                  onClick={() => handleCloseRequest(request.id)}
                  disabled={supportRequestStore.isLoading || !responseText[request.id]?.trim()}
                >
                  Подтвердить закрытие
                </button>
              )}
            </div>
          </>
        )}
      />
    </div>
  );
});
