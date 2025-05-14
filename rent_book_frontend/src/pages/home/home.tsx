import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import { Preloader } from '../../components/ui/preloader';
import { BookList } from '../../components/book/book-list';

import styles from './home.module.scss';

export const HomePage = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  useEffect(() => {
    rentBookStore.fetchBooks();
    if (authStore.isAuth) {
      rentBookStore.fetchUserFavorites();
    }
  }, [authStore.isAuth, rentBookStore]);

  if (rentBookStore.isLoading || rentBookStore.isFavoritesLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles['home-page']}>
      <h1 className={styles['home-page-title']}>Доступно для аренды</h1>

      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

      <BookList
        books={rentBookStore.books}
        currentImageIndices={currentImageIndices}
        setCurrentImageIndices={setCurrentImageIndices}
      />
    </div>
  );
});
