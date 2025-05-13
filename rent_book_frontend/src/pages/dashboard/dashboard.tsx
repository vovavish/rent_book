import { Outlet, NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';

import common from '../../components/commonDashboard/commonDashboard.module.scss';
import clsx from 'clsx';

export const Dashboard = observer(() => {
  const { authStore } = useStore();

  return (
    <div className={common.dashboard}>
      <h1 className={common['dashboard-title']}>Личный кабинет</h1>
      <div className={common['dashboard-container']}>
        <nav className={common['dashboard-nav']}>
          <div className={common['dashboard-nav-group']}>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                isActive
                  ? clsx(common.activeLink, common.navLink, common.accentLink)
                  : clsx(common.navLink, common.accentLink)
              }
            >
              Профиль
            </NavLink>

            {authStore.user?.roles.includes('ADMIN') && (
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? clsx(common.activeLink, common.navLink, common.accentLink)
                    : clsx(common.navLink, common.accentLink)
                }
              >
                Техподдержка
              </NavLink>
            )}
          </div>
          {!authStore.user?.roles.includes('ADMIN') && <>
            <div className={common['dashboard-nav-group']}>
              <div className={common['dashboard-nav-title']}>Я - владелец</div>
              <NavLink
                to="/dashboard/books"
                className={({ isActive }) =>
                  isActive ? clsx(common.activeLink, common.navLinkList) : common.navLinkList
                }
              >
                Мои объявления
              </NavLink>
              <NavLink
                to="/dashboard/rent_in_out"
                className={({ isActive }) =>
                  isActive ? clsx(common.activeLink, common.navLinkList) : common.navLinkList
                }
              >
                Сдаю
              </NavLink>
            </div>
            <div className={common['dashboard-nav-group']}>
              <div className={common['dashboard-nav-title']}>Я - читатель</div>
              <NavLink
                to="/dashboard/my_rents"
                className={({ isActive }) =>
                  isActive ? clsx(common.activeLink, common.navLinkList) : common.navLinkList
                }
              >
                Арендую
              </NavLink>
              <NavLink
                to="/dashboard/favorites"
                className={({ isActive }) =>
                  isActive ? clsx(common.activeLink, common.navLinkList) : common.navLinkList
                }
              >
                Избранное
              </NavLink>
            </div>
          </>}
        </nav>
        <div className={common['dashboard-content']}>
          {authStore.isAuth ? <Outlet /> : <p>Пожалуйста, войдите в систему</p>}
        </div>
      </div>
    </div>
  );
});
