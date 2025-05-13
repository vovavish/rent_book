import { FC } from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

import styles from './favorite-button.module.scss';
import { observer } from 'mobx-react-lite';

interface FavoriteButtonProps {
  bookId: number;
}

export const FavoriteButton: FC<FavoriteButtonProps> = observer(({ bookId }) => {
  const { rentBookStore } = useStore();
  const isFav = rentBookStore.isFavorite(bookId);

  const toggleFavorite = async () => {
    if (isFav) {
      await rentBookStore.removeFromFavorites(bookId);
    } else {
      await rentBookStore.addToFavorites(bookId);
    }
  };

  return (
    <button
      className={`${styles['favorite-button']} ${isFav ? styles['favorite'] : ''}`}
      onClick={toggleFavorite}
    >
      <Heart size={22} fill={isFav ? '#e74c3c' : 'none'} stroke="currentColor" />
    </button>
  );
});
