import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import styles from './my-rentals.module.css';

import { Preloader } from '../../components/ui/preloader';
import { MyRentalsBookList } from '../../components/book/my-rentals-book/my-rentals-book-list';
import { DashboardTitle } from '../../components/ui/dashboard-title';

export const MyRentalsPage = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<number, number>>({});

  useEffect(() => {
    if (authStore.isAuth) {
      rentBookStore.fetchUserRentals();
    }
  }, [authStore.isAuth]);

  if (rentBookStore.isLoading && rentBookStore.rentals.length === 0) {
    <Preloader />;
  }
  console.log('rentBookStore.rentals', rentBookStore.rentals);
  return (
    <div className={styles.container}>
      <DashboardTitle>Мои аренды</DashboardTitle>

      {rentBookStore.isLoading && <p className={styles.loading}>Загрузка...</p>}
      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

      {rentBookStore.rentals.length > 0 && (
        <MyRentalsBookList
          rental={rentBookStore.rentals}
          currentImageIndices={currentImageIndexes}
          setCurrentImageIndices={setCurrentImageIndexes}
        />
      )}
    </div>
  );
});
