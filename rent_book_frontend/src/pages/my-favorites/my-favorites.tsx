import { useEffect, useState } from "react";
import { useStore } from "../../hooks/useStore";
import { Preloader } from "../../components/ui/preloader";
import { BookList } from "../../components/book/book-list";
import { observer } from "mobx-react-lite";

import styles from './my-favorites.module.scss';
import { FavoriteBookList } from "../../components/book/favorite-book/favorite-bool-list";
import { DashboardTitle } from "../../components/ui/dashboard-title";

export const MyFavoritesPage = observer(() => {
  const { rentBookStore } = useStore();
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  useEffect(() => {
    rentBookStore.fetchUserFavorites();
  }, []);

  if (rentBookStore.isFavoritesLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles['favorites-page']}>
      <DashboardTitle>Избранное</DashboardTitle>

      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

      <FavoriteBookList
        books={rentBookStore.favoriteBooks}
        currentImageIndices={currentImageIndices}
        setCurrentImageIndices={setCurrentImageIndices}
      />
    </div>
  );
});