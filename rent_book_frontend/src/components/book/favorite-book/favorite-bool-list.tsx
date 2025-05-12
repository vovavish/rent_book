import { FC } from 'react';
import { FavoriteBookCard } from './favorite-book-card';

import { BookResponse } from '../../../types/response/bookResponse';

import styles from '../book-list.module.scss';
import { Link } from 'react-router-dom';
import { EmptyText } from '../../empty-text/empty-text';

interface BookListProps {
  books: BookResponse[];
  currentImageIndices: Record<number, number>;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const FavoriteBookList: FC<BookListProps> = ({
  books,
  currentImageIndices,
  setCurrentImageIndices,
}) => {
  if (books.length === 0) {
    return <EmptyText>Тут пусто... Добавьте книгу в избранное в <Link to="/">нашем каталоге</Link></EmptyText>;
  }

  return (
    <div className={styles['books-list']}>
      {books.map((book) => (
        <FavoriteBookCard
          key={book.id}
          book={book}
          currentImageIndex={currentImageIndices[book.id] || 0}
          setCurrentImageIndices={setCurrentImageIndices}
        />
      ))}
    </div>
  );
};
