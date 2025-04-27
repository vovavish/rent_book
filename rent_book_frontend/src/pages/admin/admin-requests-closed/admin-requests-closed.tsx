import { observer } from "mobx-react-lite";
import { useStore } from "../../../hooks/useStore";
import { useEffect } from "react";
import { DashboardTitle } from "../../../components/ui/dashboard-title";
import { AdminSupportRequestList } from "../../../components/admin-support-request-list";

export const AdminRequestsClosed = observer(() => {
  const { supportRequestStore } = useStore();

  useEffect(() => {
    supportRequestStore.fetchAllClosedRequests();
  }, []);

  return (
    <div>
      <DashboardTitle>Закрытые обращения</DashboardTitle>
      <AdminSupportRequestList
        requests={supportRequestStore.allClosedRequests}
        isLoading={supportRequestStore.isLoading}
        error={supportRequestStore.error}
        emptyText="Закрытых обращений нет"
        renderActions={() => null} // Нет кнопок
      />
    </div>
  );
});
