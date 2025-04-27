import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { SupportRequestList } from '../../../components/support-request-list/support-request-list';
import { DashboardTitle } from '../../../components/ui/dashboard-title';
import { useStore } from '../../../hooks/useStore';

export const MyTickets = observer(() => {
  const { supportRequestStore } = useStore();

  useEffect(() => {
    supportRequestStore.fetchActiveRequests();
  }, []);

  return (
    <div>
      <DashboardTitle>Мои обращения</DashboardTitle>
      <SupportRequestList
        requests={supportRequestStore.activeRequests}
        isLoading={supportRequestStore.isLoading}
        error={supportRequestStore.error}
      />
    </div>
  );
});
