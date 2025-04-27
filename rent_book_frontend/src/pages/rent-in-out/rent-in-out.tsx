import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import styles from './rent-in-out.module.css';
import { RentInOutBookList } from '../../components/book/rent-in-out-book/rent-in-out-book-list';
import { DashboardTitle } from '../../components/ui/dashboard-title';

export const MyRentalsInOutPage = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  useEffect(() => {
    if (authStore.isAuth) {
      rentBookStore.fetchUserRentalsInOut();
    }
  }, [authStore.isAuth]);


  return (
    <div className={styles.container}>
      <DashboardTitle>Мои сдачи в аренду</DashboardTitle>

      {rentBookStore.isLoading && <p className={styles.loading}>Загрузка...</p>}
      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

        {rentBookStore.rentalsInOutBooks.length > 0 && (
          <RentInOutBookList
            rental={rentBookStore.rentalsInOutBooks}
            currentImageIndices={currentImageIndices}
            setCurrentImageIndices={setCurrentImageIndices}
          />
        )}
    </div>
  );
});
