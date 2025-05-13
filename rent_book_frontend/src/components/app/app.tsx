import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { HomePage } from '../../pages/home';
import { RentBookPage } from '../../pages/rent-book';
import { Dashboard } from '../../pages/dashboard';
import { MyRentBooksPage } from '../../pages/my-rent-books';
import { MyRentalsPage } from '../../pages/my-rentals';
import { MyRentalsInOutPage } from '../../pages/rent-in-out';
import { LoginPage } from '../../pages/login';
import { RegisterPage } from '../../pages/register';
import { AboutPage } from '../../pages/about';
import { MyProfilePage } from '../../pages/profile';
import { NotFoundPage } from '../../pages/not-found';
import { MyFavoritesPage } from '../../pages/my-favorites';
import { DashboardSupport } from '../../pages/dashboard-support/dashboard-support';
import { ArchiveTickets, MyTickets, NewTicket } from '../../pages/user-support';
import { DashboardAdmin } from '../../pages/dashboard-admin/dashboard-admin';
import { AdminRequestsClosed, AdminRequestsInProgress, AdminRequestsNew } from '../../pages/admin';
import { AdminBookComplains } from '../../pages/admin/admin-book-complaints/admin-book-complains';
import { Privacy } from '../../pages/privacy/privacy';
import { Terms } from '../../pages/terms/terms';
import { PublicOffer } from '../../pages/public-offer/public-offer';

import { Footer } from '../footer';
import { Header } from '../header';
import { useStore } from '../../hooks/useStore';
import { ProtectedRoute } from '../protected-route';

import styles from './app.module.scss';

export const App = () => {
  const { authStore, userProfileStore } = useStore();
  const location = useLocation();
  const isAuthPage =
    location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  useEffect(() => {
    const initUser = async () => {
      await authStore.checkAuth();
      userProfileStore.profile = authStore.user;
    };

    initUser();
  }, []);

  return (
    <div className={styles.layout}>
      {!isAuthPage && <Header />}

      <main className={styles.mainContent}>
        <Routes>
          <Route index element={<HomePage />} />

          <Route path="/rent_book/:bookId" element={<RentBookPage />} />

          <Route path="/privacy" element={<Privacy />}></Route>
          <Route path="/terms" element={<Terms />}></Route>
          <Route path="/public_offer" element={<PublicOffer />}></Route>

          <Route path="/" element={<ProtectedRoute requiredRole="USER" />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Navigate replace to="profile" />} />
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

              <Route path="complaints" element={<AdminBookComplains />} />

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
      {!isAuthPage && <Footer />}
    </div>
  );
};
