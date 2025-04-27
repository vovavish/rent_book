import { Navigate, Route, Routes } from 'react-router-dom';

import { HomePage } from '../../pages/home'; // Главная страница со списком книг
import { RentBookPage } from '../../pages/rent-book'; // Страница конкретной книги
import { StartRentBookPage } from '../../pages/start-rent-book'; // Страница конкретной книги
import { Dashboard } from '../../pages/dashboard'; // Личный кабинет
import { MyRentBooksPage } from '../../pages/my-rent-books'; // Мои книги (владельца)
import { MyRentalsPage } from '../../pages/my-rentals'; // Мои аренды (арендатора)
import { MyRentalsInOutPage } from '../../pages/rent-in-out';
import { LoginPage } from '../../pages/login'; // Страница входа
import { RegisterPage } from '../../pages/register'; // Страница регистрации
import { AboutPage } from '../../pages/about'; // О нас
import { MyProfilePage } from '../../pages/profile';
import { NotFoundPage } from '../../pages/not-found'; // 404

import { Footer } from '../footer';
import { Header } from '../header';
import { useStore } from '../../hooks/useStore';
import { useEffect } from 'react';
import { ProtectedRoute } from '../protected-route';

import styles from './app.module.scss';
import { MyFavoritesPage } from '../../pages/my-favorites';
import { DashboardSupport } from '../../pages/dashboard-support/dashboard-support';
import { ArchiveTickets, MyTickets, NewTicket } from '../../pages/user-support';
import { DashboardAdmin } from '../../pages/dashboard-admin/dashboard-admin';
import { AdminRequestsClosed, AdminRequestsInProgress, AdminRequestsNew } from '../../pages/admin';

export const App = () => {
  const { authStore, userProfileStore } = useStore();
  useEffect(() => {
    const initUser = async () => {
      await authStore.checkAuth();
      userProfileStore.profile = authStore.user;
    };

    initUser();
  }, []);

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.mainContent}>
        <Routes>
          <Route index element={<HomePage />} />

          <Route path="/rent_book/:bookId" element={<RentBookPage />} />

          <Route path="/" element={<ProtectedRoute requiredRole="USER" />}>
            <Route path="/rent_book/start/:bookId" element={<StartRentBookPage />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<MyProfilePage />} />
              <Route path="profile" element={<MyProfilePage />} />
              <Route path="books" element={<MyRentBooksPage />} />
              <Route path="rent_in_out" element={<MyRentalsInOutPage />} />
              <Route path="my_rents" element={<MyRentalsPage />} />
              <Route path="favorites" element={<MyFavoritesPage />} />
            </Route>

            <Route path="support" element={<DashboardSupport />}>
              <Route index element={<Navigate replace to="new" />} />
              <Route path="new" element={<NewTicket />} />
              <Route path="my-tickets" element={<MyTickets />} />
              <Route path="archive" element={<ArchiveTickets />} />
            </Route>
          </Route>

          <Route path="admin" element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<DashboardAdmin />}>
              <Route index element={<Navigate replace to="requests/new" />} />

              <Route path="complaints" element={<div>Жалобы</div>} />

              <Route path="requests">
                <Route path="new" element={<AdminRequestsNew />} />
                <Route path="in-progress" element={<AdminRequestsInProgress />} />
                <Route path="closed" element={<AdminRequestsClosed />} />
              </Route>
            </Route>
          </Route>

          <Route path="/" element={<ProtectedRoute onlyUnAuthorized />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="/about" element={<AboutPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
