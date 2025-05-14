import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import styles from './rent-in-out.module.css';
import { RentInOutBookList } from '../../components/book/rent-in-out-book/rent-in-out-book-list';
import { DashboardTitle } from '../../components/ui/dashboard-title';
import { Preloader } from '../../components/ui';

export const MyRentalsInOutPage = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  useEffect(() => {
    if (authStore.isAuth) {
      rentBookStore.fetchUserRentalsInOut();
    }
  }, [authStore.isAuth, rentBookStore]);

  if (rentBookStore.isLoading) {
    return <Preloader />
  }

  return (
    <div className={styles.container}>
      <DashboardTitle>Мои сдачи в аренду</DashboardTitle>

      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

      <RentInOutBookList
        rental={rentBookStore.rentalsInOutBooks}
        currentImageIndices={currentImageIndices}
        setCurrentImageIndices={setCurrentImageIndices}
      />
    </div>
  );
});
