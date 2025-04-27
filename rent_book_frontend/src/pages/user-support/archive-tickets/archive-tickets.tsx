import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { SupportRequestList } from '../../../components/support-request-list/support-request-list';
import { DashboardTitle } from '../../../components/ui/dashboard-title';
import { useStore } from '../../../hooks/useStore';

export const ArchiveTickets = observer(() => {
  const { supportRequestStore } = useStore();

  useEffect(() => {
    supportRequestStore.fetchClosedRequests();
  }, []);

  return (
    <div>
      <DashboardTitle>Архив</DashboardTitle>
      <SupportRequestList
        requests={supportRequestStore.closedRequests}
        isLoading={supportRequestStore.isLoading}
        error={supportRequestStore.error}
      />
    </div>
  );
});
