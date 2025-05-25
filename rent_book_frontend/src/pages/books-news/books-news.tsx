import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import { Preloader } from '../../components/ui/preloader';
import { BookList } from '../../components/book/book-list';

import styles from './books-news.module.scss';

export const BooksNews = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  useEffect(() => {
    rentBookStore.fetchBooksNews();
    if (authStore.isAuth) {
      rentBookStore.fetchUserFavorites();
    }
  }, [authStore.isAuth, rentBookStore]);

  if (rentBookStore.isLoading || rentBookStore.isFavoritesLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles['container']}>
      <h1>Новинки</h1>

      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

      <BookList
        books={rentBookStore.books}
        currentImageIndices={currentImageIndices}
        setCurrentImageIndices={setCurrentImageIndices}
      />
    </div>
  );
});
