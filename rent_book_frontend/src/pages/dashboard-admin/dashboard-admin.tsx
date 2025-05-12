import { Outlet, NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";

import common from "../../components/commonDashboard/commonDashboard.module.scss";
import clsx from "clsx";

export const DashboardAdmin = observer(() => {
  const { authStore } = useStore();

  return (
    <div className={common.dashboard}>
      <h1 className={common['dashboard-title']}>Техническая поддержка</h1>
      <div className={common['dashboard-container']}>
        <nav className={common['dashboard-nav']}>
          <NavLink 
            to="/admin/dashboard/complaints" 
            className={({ isActive }) => isActive ? clsx(common.activeLink, common.navLink, common.accentLink) : clsx(common.navLink, common.accentLink)}
          >
            Жалобы
          </NavLink>

          <div className={common['dashboard-nav-group']}>
            <div className={common['dashboard-nav-title']}>Обращения</div>
            <NavLink 
              to="/admin/dashboard/requests/new" 
              className={({ isActive }) => isActive ? clsx(common.activeLink, common.navLinkList) : common.navLinkList}
            >
              Новые
            </NavLink>
            <NavLink 
              to="/admin/dashboard/requests/in-progress" 
              className={({ isActive }) => isActive ? clsx(common.activeLink, common.navLinkList) : common.navLinkList}
            >
              В работе
            </NavLink>
            <NavLink 
              to="/admin/dashboard/requests/closed" 
              className={({ isActive }) => isActive ? clsx(common.activeLink, common.navLinkList) : common.navLinkList}
            >
              Закрытые
            </NavLink>
          </div>
        </nav>
        <div className={common['dashboard-content']}>
          {authStore.isAuth ? (
            <Outlet />
          ) : (
            <p>Пожалуйста, войдите в систему</p>
          )}
        </div>
      </div>
    </div>
  );
});
