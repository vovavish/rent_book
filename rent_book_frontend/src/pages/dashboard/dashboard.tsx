import { Outlet, NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";

import styles from './dashboard.module.scss';
import clsx from "clsx";

export const Dashboard = observer(() => {
  const { authStore } = useStore();

  return (
    <div className={styles.dashboard}>
      <h1 className={styles['dashboard-title']}>Личный кабинет</h1>
      <div className={styles['dashboard-container']}>
        <nav className={styles['dashboard-nav']}>
          <NavLink 
            to="/dashboard/profile" 
            className={({ isActive }) => isActive ? clsx(styles.activeLink, styles.navLink) : styles.navLink}
          >
            Профиль
          </NavLink>

          <div>
            <div className={styles['dashboard-nav-title']}>Я - владелец</div>
            <NavLink 
              to="/dashboard/books" 
              className={({ isActive }) => isActive ? clsx(styles.activeLink, styles.navLinkList) : styles.navLinkList}
            >
              Мои объявления
            </NavLink>
            <NavLink 
              to="/dashboard/rent_in_out" 
              className={({ isActive }) => isActive ? clsx(styles.activeLink, styles.navLinkList) : styles.navLinkList}
            >
              Сдаю
            </NavLink>
            <NavLink 
              to="/dashboard/my_reviews" 
              className={({ isActive }) => isActive ? clsx(styles.activeLink, styles.navLinkList) : styles.navLinkList}
            >
              Отзывы обо мне
            </NavLink>
          </div>
          <div>
            <div className={styles['dashboard-nav-title']}>Я - читатель</div>
            <NavLink 
              to="/dashboard/my_rents" 
              className={({ isActive }) => isActive ? clsx(styles.activeLink, styles.navLinkList) : styles.navLinkList}
            >
              Арендую
            </NavLink>
            <NavLink 
              to="/dashboard/favorites" 
              className={({ isActive }) => isActive ? clsx(styles.activeLink, styles.navLinkList) : styles.navLinkList}
            >
              Избранное
            </NavLink>
          </div>
        </nav>
        <div className={styles['dashboard-content']}>
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
