import { Outlet, NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";

import common from "../../components/commonDashboard/commonDashboard.module.scss";
import clsx from "clsx";

export const DashboardSupport = observer(() => {
  const { authStore } = useStore();

  return (
    <div className={common.dashboard}>
      <h1 className={common['dashboard-title']}>Поддержка</h1>
      <div className={common['dashboard-container']}>
        <nav className={common['dashboard-nav']}>
          <NavLink 
            to="/support/new" 
            className={({ isActive }) => isActive ? clsx(common.activeLink, common.navLink) : common.navLink}
          >
            Новое обращение
          </NavLink>
          <NavLink 
            to="/support/my-tickets" 
            className={({ isActive }) => isActive ? clsx(common.activeLink, common.navLink) : common.navLink}
          >
            Мои обращения
          </NavLink>
          <NavLink 
            to="/support/archive" 
            className={({ isActive }) => isActive ? clsx(common.activeLink, common.navLink) : common.navLink}
          >
            Архив
          </NavLink>
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
